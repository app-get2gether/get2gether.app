"use client";

import useSWR from "@/hooks/useSWR";
import EventListItem from "./EventListItem";
import { useTranslation } from "react-i18next";
import { DEFAULT_EVENT_IMAGE_URL } from "@/config";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDoubleRightIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { Transition } from "react-transition-group";
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

  if (error) return <div>Failed to load</div>;
  if (!createdByMeEvents) return null;

  // Transition is used in favor of CSSTransition because of the issue with initial state
  // https://github.com/reactjs/react-transition-group/issues/366
  const transitionClasses = {
    entering: "enter-active",
    entered: "enter-done",
    exiting: "exit-active",
    exited: "exit-done",
    unmounting: "",
    unmounted: "",
  };

  return (
    <>
      <Transition in={!isCollapsed} timeout={500}>
        {state => (
          <div className={twJoin("collapsed", transitionClasses[state])}>
            <div className="divider divider-end">
              <div className="flex flex-row text-sm opacity-50 cursor-pointer" onClick={onToggle}>
                <span>{t("list_events.created_by_me.title")}</span>
                <ChevronUpIcon className="w-4 h-4 translate-y-[0.15rem] ml-1 collapsed-chevron" />
              </div>
            </div>
            <div className="collapsed-content">
              {createdByMeEvents.length !== 0 ? (
                <div>
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
                  <div>
                    <Link href="/tgbot/events/create?back=true" className="btn btn-neutral w-full">
                      {t("list_events.created_by_me.create")}
                      <ChevronDoubleRightIcon className="w-6 h-6" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="h-24 text-center flex items-center justify-center">
                    {t("list_events.created_by_me.empty")}
                  </div>
                  <Link href="/tgbot/events/create?back=true" className="btn btn-neutral w-full">
                    {t("list_events.created_by_me.create")}
                    <ChevronDoubleRightIcon className="w-6 h-6" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </Transition>
      <div className="divider divider-end">
        <div className="cursor-pointer text-sm opacity-50">
          <span>{t("list_events.my_events.title")}</span>
        </div>
      </div>
    </>
  );
}
