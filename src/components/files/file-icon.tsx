"use client";

import {
  FileArchive,
  FileAudio,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Image,
  File,
} from "lucide-react";
import {} from "react";

interface FileIconProps {
  filename: string;
  size: number;
}

export default function DynamicFileIcon({ filename, size }: FileIconProps) {
  const getIcon = (extension: string) => {
    switch (extension) {
      case "pdf":
      case "txt":
      case "doc":
      case "docx":
        return <FileText size={size} />;
      case "xls":
      case "xlsx":
        return <FileSpreadsheet size={size} />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "bmp":
        return <Image size={size} />;
      case "mp4":
      case "avi":
      case "mov":
      case "mkv":
        return <FileVideo size={size} />;
      case "mp3":
      case "wav":
        return <FileAudio size={size} />;
      case "zip":
      case "rar":
      case "7z":
        return <FileArchive size={size} />;
      default:
        return <File size={size} />;
    }
  };

  const extension = filename.split(".")?.pop()?.toLowerCase() ?? "";

  const icon = getIcon(extension);

  return <div style={{ height: size, width: size }}>{icon}</div>;
}
