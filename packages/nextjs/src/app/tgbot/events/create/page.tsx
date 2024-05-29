"use client";

import { EditableInput, EditableTextarea } from "@/components/Editable";
import { TCreateEventStore, useCreateEventStore } from "@/store";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import DatetimeButton from "./_components/DatetimeButton";
import ImageBlock from "./_components/ImageBlock";
import LocationButton from "./_components/LocationButton";

export default function CreateEventPage() {
  const { t } = useTranslation();
  const { title, description, setTitle } = useCreateEventStore((state: TCreateEventStore) => ({
    title: state.title,
    description: state.description,
    setTitle: state.setTitle,
    setImageFile: state.setImageFile,
  }));

  const textareaRef = useRef<HTMLDivElement>(null);

  const onTitleEnter = useCallback(() => {
    // TODO: only if description is empty
    textareaRef.current?.focus();
  }, [textareaRef]);

  const onSubmitTitle = useCallback((_title: string) => setTitle(_title), [setTitle]);

  return (
    <main>
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
    </main>
  );
}
