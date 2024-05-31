import { TCreateEventStore, useCreateEventStore } from "@/store";
import { useCallback, useRef, useState } from "react";
import { CameraIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/solid";

import cn from "classnames";

const MAX_FILE_SIZE = 1024 * 1024 * 6; // 6MB

export default function ImageBlock() {
  const { imageFile, setImageFile } = useCreateEventStore((state: TCreateEventStore) => ({
    imageFile: state.imageFile,
    setImageFile: state.setImageFile,
  }));
  const ref = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploaderRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(!imageFile);
  const onRootClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!imageFile) return;
      setShowControls(ref => !ref);
    },
    [setShowControls, imageFile],
  );
  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > MAX_FILE_SIZE) {
        //TODO error boundary
        //TODO:compress image on client
        throw new Error("File is too big");
      }
      setImageFile(file);
      setShowControls(false);
    },
    [setImageFile],
  );
  const onUploaderClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!inputRef.current) return;
      inputRef.current?.click();
    },
    [inputRef],
  );
  const onDeleteClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!inputRef.current) return;
      setImageFile(null);
    },
    [inputRef, setImageFile],
  );
  if (imageFile) {
    console.log(URL.createObjectURL(imageFile));
  }

  return (
    <figure className={cn("h-52 relative", { "bg-base-300": !imageFile })} onClick={onRootClick}>
      {imageFile ? (
        <div className="w-full h-52 overflow-hidden absolute top-0 left-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={ref} src={URL.createObjectURL(imageFile)} alt="Event image" className="w-full" />
        </div>
      ) : null}
      {showControls && (
        <div
          className="cursor-pointer border-2 rounded-full border-primary text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  p-3 bg-neutral bg-opacity-70 animated-on-press"
          onClick={onUploaderClick}
          ref={uploaderRef}
        >
          <CameraIcon className="h-12 w-12 -mt-1" />
        </div>
      )}
      {imageFile && showControls ? (
        <div className="absolute right-3 top-3 cursor-pointer text-primary animated-on-press" onClick={onDeleteClick}>
          <TrashIcon className="h-6 w-6" />
        </div>
      ) : null}
      <input
        type="file"
        ref={inputRef}
        onChange={onFileChange}
        accept="image/*"
        className="translate-x-[1000px]"
        onClick={e => e.stopPropagation()}
      />
    </figure>
  );
}
