"use client";

import useSWR from "@/hooks/useSWR";
import EventItem from "./EventItem";
import { useTranslation } from "react-i18next";

/*posterUrl="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"*/
export default function EventsList() {
  const { data, isLoading, error } = useSWR("/tgbot/v1/events");
  const { t } = useTranslation();

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
            description,
            address,
          }: {
            id: string;
            title: string;
            description: string;
            address: string;
          }) => (
            <li key={id} className="my-4">
              <EventItem
                posterUrl="https://avatars.githubusercontent.com/u/99787948?s=400"
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
