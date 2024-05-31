"use client";

import { DEFAULT_EVENT_IMAGE_URL } from "@/config";
import useSWR from "@/hooks/useSWR";
import useTelegramBackButton from "@/hooks/useTelegramBackButton";
import Image from "next/image";

export default function EventPage({ params: { id } }: { params: { id: string } }) {
  const { data, isLoading, error } = useSWR(`/tgbot/v1/events/${id}`);
  useTelegramBackButton();
  console.log(data, isLoading, error);
  if (error) return <div>Failed to load</div>;
  if (!data) return null;
  return (
    <div className="flex flex-col">
      <div className="w-full mt-5">
        <div className="w-48 h-48 mx-auto relative">
          <Image src={data.imageUrl || DEFAULT_EVENT_IMAGE_URL} alt="Event image" className="opacity-90" fill={true} />
        </div>
      </div>
      <div className="card mx-5 my-5 border p-3">
        <h1 className="card-title">{data.title}</h1>
        {data.description && <div className="card-body">{data.description}</div>}
      </div>
    </div>
  );
}
