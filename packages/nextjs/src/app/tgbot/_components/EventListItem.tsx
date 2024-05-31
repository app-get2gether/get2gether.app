import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function EventListItem({
  id,
  posterUrl,
  address,
  title,
  description,
  className,
}: {
  id: string;
  posterUrl: string;
  address?: string;
  title: string;
  description: string;
  className?: string;
}) {
  const router = useRouter();
  const onClick = useCallback(() => {
    router.push(`/tgbot/events/${id}?back=true`);
  }, [id, router]);

  return (
    <div className={twMerge("flex cursor-pointer", className)} onClick={onClick}>
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
