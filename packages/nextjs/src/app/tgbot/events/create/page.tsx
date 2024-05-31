"use client";

import { CSSTransition } from "react-transition-group";
import { EditableInput, EditableTextarea } from "@/components/Editable";
import { TCreateEventStore, useCreateEventStore } from "@/store";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import DatetimeButton from "./_components/DatetimeButton";
import ImageBlock from "./_components/ImageBlock";
import LocationButton from "./_components/LocationButton";
import useAxios from "@/hooks/useAxios";
import moment from "moment";

export default function CreateEventPage() {
  const { t } = useTranslation();
  const axios = useAxios();
  const { title, description, address, addressInfo, location, startAt, setTitle, flush } = useCreateEventStore(
    (state: TCreateEventStore) => ({
      title: state.title,
      description: state.description,
      address: state.address,
      addressInfo: state.addressInfo,
      location: state.location,
      startAt: state.startAt,

      setTitle: state.setTitle,
      setImageFile: state.setImageFile,
      flush: state.flush,
    }),
  );
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const textareaRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const onTitleEnter = useCallback(() => {
    // TODO: only if description is empty
    textareaRef.current?.focus();
  }, [textareaRef]);

  const onSubmitTitle = useCallback((_title: string) => setTitle(_title), [setTitle]);
  const onSubmit = useCallback(() => {
    axios
      .post("/tgbot/v1/events", {
        title,
        description,
        address,
        addressInfo,
        lat: location ? location.lat : null,
        lng: location ? location.lng : null,
        startAt: startAt === "now" ? moment().valueOf() : startAt,
      })
      .then(res => {
        flush();
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 2000);
      })
      .catch(err => {
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 2000);
      });
  }, [title, description, address, addressInfo, location, startAt, axios, setShowError, flush]);

  return (
    <main>
      <CSSTransition nodeRef={errorRef} in={showError} timeout={250} mountOnEnter={true} unmountOnExit={true}>
        <div ref={errorRef} className="notification-panel">
          <div className="bg-error text-error-content w-full">{t("create_event.error_msg")}</div>
        </div>
      </CSSTransition>
      <CSSTransition nodeRef={successRef} in={showSuccess} timeout={250} mountOnEnter={true} unmountOnExit={true}>
        <div ref={successRef} className="notification-panel">
          <div ref={successRef} className="bg-success text-success-content">
            {t("create_event.success_msg")}
          </div>
        </div>
      </CSSTransition>
      <div className="card bg-base-200 mx-3 my-2 shadow-lg border border-base-300">
        <ImageBlock />
        <div className="m-5">
          <EditableInput
            className="card-title textarea-lg text-xl py-3 font-normal"
            placeholder={t("create_event.set_title_placeholder")}
            onSubmit={onSubmitTitle}
            value={title}
            onEnter={onTitleEnter}
          />
          <EditableTextarea
            className="px-6 py-3 min-h-28 leading-normal"
            placeholder={t("create_event.set_description_placeholder")}
            ref={textareaRef}
            value={description}
            onSubmit={() => {}}
          />
          <div className="w-full mx-5 mt-5">
            <div>
              <LocationButton />
            </div>
            <div>
              <DatetimeButton />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 mx-3">
        <button className="btn btn-success w-full block shadow-lg" disabled={!title.trim()} onClick={onSubmit}>
          {t("create_event.create_button")}
        </button>
      </div>
    </main>
  );
}
