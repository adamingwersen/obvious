"use client";

import { ACCPECTED_MIMETYPES } from "@/consts/files-types";
import { useState, type DragEvent, useRef } from "react";

interface FilePickerProps {
  uploadFiles: (files: File[]) => Promise<void>;
}

export default function FilePicker({ uploadFiles }: FilePickerProps) {
  const [isDragging, setIsDragging] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      await uploadFiles(files);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (!files) return;

    await uploadFiles(Array.from(files));
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="">
      <h2 className="text-center text-lg font-extralight">Attach documents</h2>

      <div className="flex items-center justify-center">
        <div
          className={` w-[200px] rounded-lg border-2 border-dashed p-4 lg:p-6 ${
            isDragging ? "border-blue-500 bg-blue-100" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            ref={inputRef}
            accept={ACCPECTED_MIMETYPES.join(",")}
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="cursor-pointer">
            <div className="h-full">
              <p className="text-center text-sm text-gray-500">
                Drag and drop files here, or click to select files
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
