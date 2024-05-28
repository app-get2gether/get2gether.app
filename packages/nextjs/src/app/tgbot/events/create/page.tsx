"use client";

import { EditableInput, EditableTextarea } from "@/components/Editable";
import { TCreateEventStore, useCreateEventStore } from "@/store";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ImageUplader from "@/components/ImageUploader";
import Modal from "@/components/tgbot/Modal";
import GMaps from "@/components/GMaps";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";

export default function CreateEventPage() {
  const { t } = useTranslation();
  const { title, imageUrl, location, setTitle, setImageUrl, setLocation } = useCreateEventStore(
    (state: TCreateEventStore) => ({
      title: state.title,
      location: state.location,
      imageUrl: state.imageUrl,
      setTitle: state.setTitle,
      setImageUrl: state.setImageUrl,
      setLocation: state.setLocation,
    }),
  );
  const [showLocationModal, setShowLocationModal] = useState(false);

  const textareaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const onTitleEnter = useCallback(() => {
    // TODO: only if description is empty
    textareaRef.current?.focus();
  }, [textareaRef]);

  const onSubmitTitle = useCallback((_title: string) => setTitle(_title), [setTitle]);
  const onChangeImage = useCallback(
    (file: File) => {
      setImageUrl(URL.createObjectURL(file));
    },
    [setImageUrl],
  );
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
      <div className="card bg-base-100 mx-3 my-2 shadow border border-base-300">
        <figure className={twMerge("h-52", "bg-isometric")}>
          {imageUrl && (
            <div className="w-full h-52 overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imageRef}
                src={imageUrl}
                className="object-cover object-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/3"
                alt={title}
              />
            </div>
          )}
        </figure>
        <div className="m-5">
          <EditableInput
            className="card-title textarea-lg"
            placeholder={t("create_event.set_title_placeholder")}
            onSubmit={onSubmitTitle}
            value={title}
            onEnter={onTitleEnter}
          />
          <EditableTextarea
            className="p-6 min-h-40"
            placeholder={t("create_event.set_description_placeholder")}
            ref={textareaRef}
            onSubmit={() => {}}
          />
          <ImageUplader onChange={onChangeImage} />
          <div className="text-center">
            <button className="btn btn-primary mt-5" onClick={onLocationButtonClick}>
              {t("create_event.select_location_button")}
            </button>
          </div>
          <div className="text-center mt-5">
            <input type="datetime-local" />
          </div>
        </div>
      </div>
      {typeof window !== "undefined" &&
        window.document &&
        createPortal(
          <Modal open={showLocationModal} onClose={onCloseLocationModal}>
            <div className="">
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
