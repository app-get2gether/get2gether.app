import { useCallback } from "react";

const MAX_FILE_SIZE = 1024 * 1024 * 6; // 6MB

export default function ImageUploader({ onChange }: { onChange: (file: File) => void }) {
  const _onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        //TODO error boundary
        //TODO:compress image on client
        throw new Error("File is too big");
      }
      onChange(file);
    },
    [onChange],
  );

  return (
    <div className="text-center">
      <input
        type="file"
        onChange={_onChange}
        accept="image/*"
        className="file-input file-input-ghost whitespace-nowrap w-28"
      />
      ;
    </div>
  );
}
