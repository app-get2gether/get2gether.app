"use client";

import useSWR from "@/hooks/useSWR";
import EventListItem from "./EventListItem";
import { useTranslation } from "react-i18next";
import { DEFAULT_EVENT_IMAGE_URL } from "@/config";
import { useEffect, useState } from "react";

/*posterUrl="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"*/
export default function EventsList() {
  const { data, isLoading, error } = useSWR("/tgbot/v1/events");
  const { t } = useTranslation();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
    });
  }, [setUserLocation]);

  if (error) return <div>Failed to load</div>;
  if (!data) return null;

  return (
    <>
      <div>{t("title.events")}</div>
      <ul>
        {data.map(
          ({
            id,
            title,
            lat,
            lng,
            description,
            address,
          }: {
            id: string;
            title: string;
            lat: number | null;
            lng: number | null;
            description: string;
            address: string;
          }) => (
            <li key={id} className="my-4">
              <EventListItem
                id={id}
                imageUrl={DEFAULT_EVENT_IMAGE_URL}
                userLocation={userLocation}
                location={lat && lng ? { lat, lng } : null}
                title={title}
                description={description}
                address={address}
              />
            </li>
          ),
        )}
      </ul>
    </>
  );
}
