"use client";

import { EditableInput, EditableTextarea } from "@/components/Editable";
import GMaps from "@/components/GMaps";
import Modal from "@/components/tgbot/Modal";
import { TCreateEventStore, useCreateEventStore } from "@/store";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import DatetimeButton from "./_components/DatetimeButton";
import ImageBlock from "./_components/Image";

export default function CreateEventPage() {
  const { t } = useTranslation();
  const { title, description, location, setTitle, setLocation } = useCreateEventStore((state: TCreateEventStore) => ({
    title: state.title,
    description: state.description,
    location: state.location,
    setTitle: state.setTitle,

    setLocation: state.setLocation,
    setImageFile: state.setImageFile,
  }));
  const [showLocationModal, setShowLocationModal] = useState(false);

  const textareaRef = useRef<HTMLDivElement>(null);

  const onTitleEnter = useCallback(() => {
    // TODO: only if description is empty
    textareaRef.current?.focus();
  }, [textareaRef]);

  const onSubmitTitle = useCallback((_title: string) => setTitle(_title), [setTitle]);
  const onLocationButtonClick = useCallback(() => {
    setShowLocationModal(true);
  }, [setShowLocationModal]);
  const onSetLocation = useCallback(
    ({ lat, lng }: { lat: number; lng: number }) => {
      setLocation({ lat, lng });
    },
    [setLocation],
  );
  const onCloseLocationModal = useCallback(() => {
    setShowLocationModal(false);
  }, [setShowLocationModal]);

  return (
    <main>
      <div className="card bg-base-100 mx-3 my-2 shadow-lg border border-base-300">
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
          <div className="w-full mx-5">
            <div className="flex cursor-pointer">
              {/*
            <button className="btn btn-primary mt-5" onClick={onLocationButtonClick}>
              {t("create_event.select_location_button")}
            </button>
            */}
              <label className="mr-4 text-primary">
                <MapPinIcon className="w-6 h-6 inline-block" />
              </label>
              <div>
                <button className="rounded-md truncate" onClick={onLocationButtonClick}>
                  {t("create_event.select_location_button")}
                </button>
              </div>
            </div>
            <DatetimeButton />
          </div>
        </div>
      </div>
      {typeof window !== "undefined" &&
        window.document &&
        createPortal(
          <Modal open={showLocationModal} onClose={onCloseLocationModal}>
            <div>
              <div>
                <EditableInput
                  className="text-primary my-3 textarea-lg p-3"
                  placeholder={t("create_event.set_location_address")}
                  onSubmit={() => {}}
                />
                <GMaps onSetLocation={onSetLocation} lat={location && location.lat} lng={location && location.lng} />
                <EditableTextarea
                  className="px-3 py-1 my-3 min-h-20"
                  placeholder={t("create_event.set_location_notes")}
                  onSubmit={() => {}}
                />
                <button className="btn btn-primary w-full mb-7" onClick={() => setShowLocationModal(false)}>
                  {t("create_event.set_location_button")}
                </button>
              </div>
            </div>
          </Modal>,
          document.body,
        )}
    </main>
  );
}
