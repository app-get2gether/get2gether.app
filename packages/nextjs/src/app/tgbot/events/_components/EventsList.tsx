"use client";

import useSWR from "@/hooks/useSWR";
import EventListItem from "./EventListItem";
import { useTranslation } from "react-i18next";
import { DEFAULT_EVENT_IMAGE_URL } from "@/config";
import { useEffect, useState } from "react";

/*posterUrl="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"*/
export default function EventsList() {
  const [ready, setReady] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { data, isLoading, error } = useSWR(
    ready
      ? {
          path: "/tgbot/v1/events",
          params: {
            page: 0,
            lat: userLocation && userLocation.lat,
            lng: userLocation && userLocation.lng,
          },
        }
      : null,
  );
  const { t } = useTranslation();
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setReady(true);
      },
      () => {
        setReady(true);
      },
    );
  }, [setUserLocation, setReady]);

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
            members_count,
            description,
            address,
          }: {
            id: string;
            title: string;
            lat: number | null;
            lng: number | null;
            members_count: number;
            description: string;
            address: string;
          }) => (
            <li key={id} className="my-4">
              <EventListItem
                id={id}
                imageUrl={DEFAULT_EVENT_IMAGE_URL}
                userLocation={userLocation}
                location={lat && lng ? { lat, lng } : null}
                membersCount={members_count}
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
