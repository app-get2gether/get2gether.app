"use client";

import useSWR from "@/hooks/useSWR";
import EventListItem from "./EventListItem";
import { useTranslation } from "react-i18next";
import { DEFAULT_EVENT_IMAGE_URL } from "@/config";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDoubleRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { CSSTransition, Transition } from "react-transition-group";
import { twJoin } from "tailwind-merge";

/*posterUrl="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"*/
export default function MyEventsList() {
  const { data: createdByMeEvents, isLoading, error } = useSWR("/tgbot/v1/events/created_by_me");
  const { t } = useTranslation();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isCollapsed, setCollapsed] = useState(false);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
    });
  }, [setUserLocation]);
  useEffect(() => {
    const _isCollapsed = localStorage.getItem("isCreatedByMeEventsCollapsed") === "true";
    setCollapsed(_isCollapsed);
  }, [setCollapsed]);
  const onToggle = useCallback(() => {
    setCollapsed(ref => !ref);
    localStorage.setItem("isCreatedByMeEventsCollapsed", String(!isCollapsed));
  }, [setCollapsed, isCollapsed]);

  const classes = {
    entering: "rotate-0",
    entered: "rotate-0",
    exiting: "rotate-0",
    exited: "rotate-0",
  };

  if (error) return <div>Failed to load</div>;
  if (!createdByMeEvents) return null;

  return (
    <>
      <div className="divider divider-start">
        <Transition in={isCollapsed} timeout={300}>
          {(state: string) => (
            <div className={twJoin("cursor-pointer flex flex-row text-xs opacity-50")} onClick={onToggle}>
              <ChevronDownIcon className="w-3 h-3 mr-1" />
              <span>Created by you</span>
            </div>
          )}
        </Transition>
      </div>
      {createdByMeEvents.length !== 0 ? (
        <ul>
          {createdByMeEvents.map(
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
      ) : (
        <div className="">
          <div className="h-24 text-center flex items-center justify-center">
            {t("list_events.created_by_me.empty")}
          </div>
          <Link href="/tgbot/events/create" className="btn btn-neutral w-full">
            {t("list_events.created_by_me.create")}
            <ChevronDoubleRightIcon className="w-6 h-6" />
          </Link>
        </div>
      )}
      <div className="divider divider-start">
        <div className="cursor-pointer text-xs opacity-50">
          <span>My events</span>
        </div>
      </div>
    </>
  );
}
