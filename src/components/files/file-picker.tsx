"use client";

import {
  useState,
  type DragEvent,
  type ChangeEvent,
  useRef,
  useEffect,
} from "react";

type setFiles = (files: File[]) => void;

interface FilePickerProps {
  files: File[];
  setFiles: setFiles;
}

export default function FilePicker({ files, setFiles }: FilePickerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      setFiles([...files, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const onClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setFiles([]);
  };
  useEffect(() => {
    if (files.length === 0) {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }, [files]);

  return (
    <div className="mx-auto p-4">
      <h2 className="mb-4 text-xl font-bold">Attach documents</h2>

      <div className="flex items-center justify-center">
        <div
          className={` w-[200px] rounded-lg border-2 border-dashed p-6 ${
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
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="cursor-pointer">
            <div className="h-full">
              {files.length > 0 ? (
                <ul className="text-sm text-gray-700">
                  {files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  Drag and drop files here, or click to select files
                </p>
              )}
            </div>
          </label>
        </div>
      </div>

      {files.length > 0 && (
        <div>
          <p className="mt-2 text-sm text-gray-500">
            {files.length} file(s) selected
          </p>

          <button
            onClick={onClear}
            className="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Clear selected files
          </button>
        </div>
      )}
    </div>
  );
}
