"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { Upload } from "lucide-react";
import { Button } from "./button";

interface ImageDragAndDropProps {
  file: File | undefined | null;
  setFile: Dispatch<SetStateAction<File | undefined | null>>;
}

export default function ImageDragAndDrop({
  file,
  setFile,
}: ImageDragAndDropProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <label
      htmlFor="file-upload"
      className={`block rounded-lg border-2 border-dashed p-12 text-center ${
        isDragging ? "border-red-500 bg-red-50" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center">
        <Upload className="mb-4 h-12 w-12 text-gray-400" />

        {file ? (
          <div className="text-center">
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-red-600"
              onClick={() => setFile(undefined)}
            >
              Remove
            </Button>
          </div>
        ) : (
          <>
            <p className="mb-2 text-sm font-medium">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">Image (MAX. 1MB)</p>
          </>
        )}

        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </label>
  );
}
