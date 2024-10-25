"use client";
import {
  type UploadFileParams,
  uploadFile as uploadFileToSupabase,
} from "@/server/supabase/client";
import React, { createContext, useContext, type ReactNode } from "react";

interface UseFilesServerActionContextProps {
  uploadFile: (params: UploadFileParams) => Promise<void>;
  downloadFile: ((fileName: string, answerId: number) => Promise<void>) | null;
  deleteFile: ((fileName: string, answerId: number) => Promise<void>) | null;
}
const ServerActionContext = createContext<
  UseFilesServerActionContextProps | undefined
>(undefined);

type ServerActionProviderProps = {
  children: ReactNode;
  pathToRevalidate?: string;
  deleteFile:
    | ((
        fileName: string,
        answerId: number,
        pathToRevalidate?: string,
      ) => Promise<void>)
    | null;

  addFileToAnswer: (
    fileName: string,
    answerId: number,
    pathToRevalidate?: string,
  ) => Promise<void>;
  downloadFile: ((fileName: string, answerId: number) => Promise<void>) | null;
};

const invalidCharPattern = /[^0-9a-zA-Z!\-_\.\*'()\(\)]+/g;

// Function to find invalid characters in the input string
function findInvalidCharacters(key: string): string[] {
  const invalidChars = key.match(invalidCharPattern);
  return invalidChars ? invalidChars : [];
}

export const FileActionsProvider: React.FC<ServerActionProviderProps> = ({
  children,
  pathToRevalidate,
  downloadFile,
  deleteFile,
  addFileToAnswer,
}) => {
  const uploadFile = async (params: UploadFileParams) => {
    const invalids = findInvalidCharacters(params.fileName);
    if (invalids.length > 0) {
      params.onError(new Error(`Invalid file name:${invalids.join(",")}`));
      return;
    }
    if (params.file.size === 0) {
      params.onError(new Error("Empty file"));
      return;
    }
    try {
      await uploadFileToSupabase({
        fileName: params.fileName,
        file: params.file,
        answerId: params.answerId,
        onProgress: params.onProgress,
        onError: (e) => params.onError(e),
        onSuccess: () => {
          params.onSuccess();
          void (async () => {
            try {
              await addFileToAnswer(
                params.fileName,
                params.answerId,
                pathToRevalidate,
              );
            } catch (error) {
              console.error("Error adding file to answer:", error);
            }
          })();
        },
      });
    } catch (error) {
      params.onError(error as Error);
    }
  };

  const _deleteFile =
    deleteFile === null
      ? null
      : async (fileName: string, answerId: number) =>
          await deleteFile(fileName, answerId, pathToRevalidate);

  return (
    <ServerActionContext.Provider
      value={{ downloadFile, uploadFile, deleteFile: _deleteFile }}
    >
      {children}
    </ServerActionContext.Provider>
  );
};

export const useFiles = (): UseFilesServerActionContextProps => {
  const context = useContext(ServerActionContext);
  if (!context) {
    throw new Error("useFiles must be used within a FileActionsProvider");
  }
  return context;
};
