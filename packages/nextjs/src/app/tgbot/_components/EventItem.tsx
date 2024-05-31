import Image from "next/image";
import { twMerge } from "tailwind-merge";

export default function EventItem({
  posterUrl,
  address,
  title,
  description,
  className,
}: {
  posterUrl: string;
  address?: string;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={twMerge("flex", className)}>
      <div className="avatar mr-4">
        <div className="w-24 rounded border">
          <Image src={posterUrl} alt="" width={96} height={96} className="opacity-90" />
        </div>
      </div>
      <div className="relative flex flex-col justify-end">
        <div>
          <div className="text-lg">{title}</div>
          <div>{description}</div>
        </div>
        <div className="text-xs text-neutral-content">
          <div className="w-36 truncate">{address}</div>
        </div>
      </div>
    </div>
  );
}
