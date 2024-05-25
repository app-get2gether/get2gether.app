"use client";

import { EditableInput, EditableTextarea } from "@/components/Editable";
import { TCreateEventStore, useCreateEventStore } from "@/store";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import ImageUplader from "@/components/ImageUploader";

export default function CreateEventPage() {
  const { t } = useTranslation();
  const { title, imageUrl, setTitle, setImageUrl } = useCreateEventStore((state: TCreateEventStore) => ({
    title: state.title,
    imageUrl: state.imageUrl,
    setTitle: state.setTitle,
    setImageUrl: state.setImageUrl,
  }));
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

  return (
    <main className="h-full">
      <div className="card bg-base-100 mx-3 mt-5">
        <figure>
          {imageUrl && (
            <div className="w-full h-48 overflow-hidden relative">
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
            className="card-title text-primary"
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
        </div>
      </div>
    </main>
  );
}
