import { twMerge } from "tailwind-merge";

export default function SimpleLoader({ className }: { className?: string }) {
  return <div className={twMerge("simple-loader", className)}></div>;
}
