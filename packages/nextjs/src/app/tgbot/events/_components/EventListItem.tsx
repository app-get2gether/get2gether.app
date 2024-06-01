import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import { formatHaversineDistance, haversineDistance } from "@/utils/map";
import { marked } from "marked";
import dompurify from "dompurify";

export default function EventListItem({
  id,
  imageUrl,
  membersCount,
  address,
  location,
  userLocation,
  title,
  description,
  className,
}: {
  id: string;
  imageUrl: string;
  membersCount: number;
  address?: string;
  location: { lat: number; lng: number } | null;
  userLocation: { lat: number; lng: number } | null;
  title: string;
  description: string;
  className?: string;
}) {
  const router = useRouter();
  const [distance, setDistance] = useState<string | null>(null);

  const onClick = useCallback(() => {
    router.push(`/tgbot/events/${id}?back=true`);
  }, [id, router]);

  useEffect(() => {
    if (!userLocation || !location) return;
    const _distance = formatHaversineDistance(
      haversineDistance(location.lat, location.lng, userLocation.lat, userLocation.lng),
    );
    setDistance(_distance);
  }, [userLocation, location, setDistance]);

  return (
    <div className={twMerge("flex cursor-pointer", className)} onClick={onClick}>
      <div className="avatar mr-4 rounded border h-fit">
        <div className="w-24 relative">
          <Image src={imageUrl} alt="" fill={true} className="opacity-90" />
        </div>
      </div>

      <div className="relative flex flex-col justify-between w-full min-h-full">
        <div className="flex flex-col w-full justify-between">
          <div>
            <div className="text-lg line-clamp-2 leading-snug">{title}</div>
            {/*
            <div className="h-[2.5rem] mt-1overflow-hidden line-clamp-1">
              <div
                className="text-sm leading-snug"
                dangerouslySetInnerHTML={{ __html: dompurify.sanitize(marked.parse(description) as string) }}
              ></div>
            </div>
              */}
          </div>
        </div>

        <div>
          <div className="w-full text-right flex flex-row justify-end">
            <div className="text-xs flex flex-row mr-2">
              <span>{membersCount}</span>
              <UserIcon className="w-3 h-3 mx-[0.1rem] mt-[0.1rem] opacity-50" />
            </div>
            {distance && <div className="text-xs text-success">{distance}</div>}
          </div>
          {address && (
            <div className="text-xs opacity-50">
              <div className="flex flex-row justify-end mr-3 w-full">
                <span className="w-40 truncate text-right">
                  <MapPinIcon className="h-3 w-3 -mt-[.1rem] mr-1 inline-block" />
                  {address}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
