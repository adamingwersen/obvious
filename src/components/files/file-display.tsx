import React, { useState, forwardRef, useImperativeHandle } from "react";
import DynamicFileIcon from "./file-icon";
import { Button } from "../ui/button";

import { DownloadCloud, TrashIcon } from "lucide-react";
import { Progress } from "../ui/progress";
import Spinner from "../ui/spinner";
import { useFiles } from "@/hooks/use-files";

interface FileDisplayComponentProps {
  fileName: string;
  answerId: number;
}

export interface FileDisplayComponentRef {
  updateProgress: (progress: number) => void;
}

const FileDisplayComponent = forwardRef<
  FileDisplayComponentRef,
  FileDisplayComponentProps
>(({ fileName, answerId }, ref) => {
  const { downloadFile, deleteFile } = useFiles();
  const [progress, setProgress] = useState<number>(ref === null ? 100 : 0);

  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    updateProgress: (newProgress: number) => {
      // Super hacky
      // This shouldn't be the case but we get weird numbers
      // in the callback that go back and forth
      if (newProgress > progress) {
        setProgress((prev) => {
          if (newProgress > prev) {
            return newProgress;
          } else {
            return prev;
          }
        });
      }
    },
  }));

  return (
    <div className="w-full rounded-lg border">
      <div
        key={fileName}
        className="flex items-center justify-between gap-3 px-2 py-1"
      >
        <div className="flex flex-grow items-center gap-1">
          <DynamicFileIcon filename={fileName} size={15} />
          <p className="text-xs font-extralight">{fileName}</p>
        </div>

        {downloadFile !== null && (
          <Button
            variant="ghost"
            size="icon"
            type="button"
            disabled={progress < 100}
            onClick={async () => {
              setIsDownloading(true);
              await downloadFile(fileName, answerId);
              setIsDownloading(false);
            }}
          >
            {isDownloading ? (
              <Spinner />
            ) : (
              <DownloadCloud size={12}></DownloadCloud>
            )}
          </Button>
        )}
        {deleteFile !== null && (
          <Button
            variant="ghost"
            size="icon"
            type="button"
            disabled={progress < 100}
            onClick={async () => {
              setIsDeleting(true);
              await deleteFile(fileName, answerId);
              setIsDeleting(false);
            }}
          >
            {isDeleting ? <Spinner /> : <TrashIcon size={12}></TrashIcon>}
          </Button>
        )}
      </div>
      {progress < 100 && progress > 0 && (
        <Progress value={progress} className="h-2" />
      )}
    </div>
  );
});

FileDisplayComponent.displayName = "FileDisplayComponent";

export default FileDisplayComponent;
