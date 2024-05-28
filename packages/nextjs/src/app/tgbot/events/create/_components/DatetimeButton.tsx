import moment, { Moment } from "moment";
import i18n from "@/i18n";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { useCallback, useRef } from "react";
import { TCreateEventStore, useCreateEventStore } from "@/store";
import { useTranslation } from "react-i18next";

const formatDatetime = (timestamp: number) => {
  return moment(timestamp).locale(i18n.language).format("llll");
};

// if in 30 minutes then it means it's now
const isNow = (date: Moment) => {
  const MINUTES = 30;
  const diff = Math.abs(moment().valueOf() - date.valueOf());
  return diff < 1000 * 60 * MINUTES ? true : false;
};

export default function DatetimeButton() {
  const { t } = useTranslation();
  const { startAt, setStartAt } = useCreateEventStore((state: TCreateEventStore) => ({
    startAt: state.startAt,
    setStartAt: state.setStartAt,
  }));

  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const onClick = useCallback(() => {
    if (!inputRef.current) return;
    inputRef.current.showPicker();
    // iOS
    inputRef.current.focus();
  }, [inputRef]);
  const onDatetimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!ref.current) return;
      const new_date = e.target.value.trim() ? moment(e.target.value) : moment();
      if (isNow(new_date)) {
        setStartAt("now");
        return;
      }
      // TODO: test and add error boundary
      if (new_date < moment(new Date())) {
        throw new Error("Invalid date");
      }
      setStartAt(new_date.valueOf());
    },
    [ref, setStartAt],
  );

  return (
    <div className="mx-auto mt-5 flex cursor-pointer group/datetime" onClick={onClick}>
      <label className="mr-4 text-primary">
        <CalendarIcon className="w-6 h-6 -mt-1 inline-block transition-transform duration-[125ms] ease-in-out group-hover/datetime:scale-105 group-active/datetime:scale-95" />
      </label>
      <div className="relative">
        <div className="z-1 relative select-none" ref={ref}>
          {startAt == "now" ? t("create_event.set_datetime.now") : formatDatetime(startAt || moment().valueOf())}
        </div>
        <input
          ref={inputRef}
          type="datetime-local"
          onChange={onDatetimeChange}
          className="absolute top-0 left-0 w-full z-0 opacity-0"
          min={new Date().toString()}
        />
      </div>
    </div>
  );
}
