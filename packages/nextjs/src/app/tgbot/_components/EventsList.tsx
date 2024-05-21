"use client";

import useSWR from "@/hooks/useSWR";
import EventItem from "./EventItem";

export default function EventsList() {
  const { data, isLoading, error } = useSWR("/tgbot/v1/events");

  if (!data) return null;

  return (
    <>
      <div>Events:</div>
      <ul>
        {data.map(({ id, title, description }: { id: string; title: string; description: string }) => (
          <li key={id} className="my-4">
            <EventItem
              posterUrl="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
              title={title}
              description={description}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
