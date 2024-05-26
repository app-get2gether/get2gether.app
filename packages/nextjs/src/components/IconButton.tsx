// styled similar to @tonconnect/sdk for styling consistency
// https://github.com/ton-connect/sdk/blob/4a0e7f4e87a63b46a6de4025a197876c4fb1b30a/packages/ui/src/app/components/icon-button/style.ts
import { twMerge } from "tailwind-merge";

export default function IconButton({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={twMerge(
        "flex justify-center items-center w-[2rem] h-[2rem] cursor-pointer transition-transform duration-[125ms] ease-in-out hover:scale-105 active:scale-95",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
