"use client";

import { CSSTransition } from "react-transition-group";
import { EditableInput, EditableTextarea } from "@/components/Editable";
import { TCreateEventStore, useCreateEventStore } from "@/store";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import DatetimeButton from "./_components/DatetimeButton";
import ImageBlock from "./_components/ImageBlock";
import LocationButton from "./_components/LocationButton";
import useAxios from "@/hooks/useAxios";
import moment from "moment";
import TurndownService from "turndown";
import useTelegramBackButton from "@/hooks/useTelegramBackButton";
import { uploadEventImage } from "../_utils/uploadEventImage";
import SetPriceButton from "./_components/SetPriceButton";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  useTelegramBackButton();
  const { t } = useTranslation();
  const axios = useAxios();
  const turndown = useMemo(() => new TurndownService(), []);
  const {
    title,
    description,
    imageFile,
    ticket_price,
    address,
    addressInfo,
    location,
    startAt,
    setTitle,
    setDescription,
    flush,
  } = useCreateEventStore((state: TCreateEventStore) => ({
    title: state.title,
    description: state.description,
    imageFile: state.imageFile,
    ticket_price: state.ticket_price,
    address: state.address,
    addressInfo: state.addressInfo,
    location: state.location,
    startAt: state.startAt,

    setTitle: state.setTitle,
    setDescription: state.setDescription,
    setImageFile: state.setImageFile,
    flush: state.flush,
  }));
  const [showError, setShowError] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const textareaRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const onTitleEnter = useCallback(() => {
    // TODO: only if description is empty
    textareaRef.current?.focus();
  }, [textareaRef]);

  const onSubmitTitle = useCallback((value: string) => setTitle(value), [setTitle]);
  const onSubmitDescription = useCallback(
    (innerText: string, innerHTML: string) => setDescription(innerHTML),
    [setDescription],
  );
  const onSubmit = useCallback(() => {
    setLoading(true);
    axios
      .post("/tgbot/v1/events", {
        title,
        description: description.trim() ? turndown.turndown(description.trim()) : "",
        address,
        addressInfo,
        ticket_price,
        lat: location ? location.lat : null,
        lng: location ? location.lng : null,
        startAt: startAt === "now" ? moment().valueOf() : startAt,
      })
      .then(async res => {
        return uploadEventImage(axios, imageFile, res.data.id).finally(() => {
          flush();
          router.push(`/tgbot/events/${res.data.id}`);
        });
      })
      .catch(err => {
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 2000);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    title,
    description,
    router,
    imageFile,
    ticket_price,
    address,
    addressInfo,
    location,
    startAt,
    axios,
    setShowError,
    flush,
    turndown,
  ]);

  return (
    <main>
      <CSSTransition nodeRef={errorRef} in={showError} timeout={250} mountOnEnter={true} unmountOnExit={true}>
        <div ref={errorRef} className="notification-panel">
          <div className="bg-error text-error-content w-full">{t("create_event.error_msg")}</div>
        </div>
      </CSSTransition>

      <div className="mx-3 mt-4">
        <div className="w-full">
          <ImageBlock className="w-full relative" />
        </div>
      </div>

      <div className="card mx-3 my-2 border border-base-300">
        <div className="m-5">
          <EditableInput
            className="textarea-bordered font-bold"
            placeholder={t("create_event.set_title_placeholder")}
            onSubmit={onSubmitTitle}
            value={title}
            onEnter={onTitleEnter}
          />
          <EditableTextarea
            className="my-3 min-h-28 textarea-bordered leading-normal"
            placeholder={t("create_event.set_description_placeholder")}
            ref={textareaRef}
            value={description}
            onSubmit={onSubmitDescription}
          />
          <div className="w-full mx-2 mt-10">
            <div className="my-5">
              <LocationButton />
            </div>
            <div className="my-5">
              <DatetimeButton />
            </div>
            <div className="mt-5">
              <SetPriceButton />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 mx-3">
        <button
          className="btn btn-neutral btn-neutral-content w-full block shadow-lg"
          disabled={!title.trim() || isLoading}
          onClick={onSubmit}
        >
          {t("create_event.create_button")}
        </button>
      </div>
    </main>
  );
}
