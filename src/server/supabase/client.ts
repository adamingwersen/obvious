import { createBrowserClient } from "@supabase/ssr";
import * as tus from "tus-js-client";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

const getProjectId = () => {
  const id = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;
  if (!id) throw new Error("Supabase project id env variable not set");
  return id;
};

export type UploadFileParams = {
  fileName: string;
  file: File;
  answerId: number;
  onProgress: (progress: number) => void;
  onError: (error: Error) => void;
  onSuccess: () => void;
};

export const uploadFile = async ({
  fileName,
  file,
  answerId,
  onProgress,
  onError,
  onSuccess,
}: UploadFileParams): Promise<void> => {
  const supabase = createClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) throw new Error("Cant upload file without a user session");
    return new Promise<void>((resolve, reject) => {
      const upload = new tus.Upload(file, {
        endpoint: `https://${getProjectId()}.supabase.co/storage/v1/upload/resumable`,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          authorization: `Bearer ${session.access_token}`,
          "x-upsert": "true", // optionally set upsert to true to overwrite existing files
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess
        metadata: {
          bucketName: `uploads`,
          objectName: `${answerId}/${fileName}`,
          contentType: file.type,
        },
        chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
        onError: (error) => {
          onError(error);
          reject(error);
        },
        onProgress: (bytesUploaded: number, bytesTotal: number) => {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          onProgress(Number(percentage));
        },
        onSuccess: () => {
          onSuccess();
          resolve();
        },
      });

      // Check if there are any previous uploads to continue.
      void upload
        .findPreviousUploads()
        .then((previousUploads) => {
          // Found previous uploads so we select the first one.
          if (previousUploads.length) {
            const prevUpload = previousUploads[0];
            if (!prevUpload) throw new Error("Error resuming upload");
            upload.resumeFromPreviousUpload(prevUpload);
          }

          // Start the upload
          upload.start();
        })
        .catch();
    });
  } catch (error) {
    onError(error as Error);
  }
};
