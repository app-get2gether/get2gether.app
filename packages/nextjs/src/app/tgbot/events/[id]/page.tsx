"use client";

import { DEFAULT_EVENT_IMAGE_URL } from "@/config";
import useSWR from "@/hooks/useSWR";
import useTelegramBackButton from "@/hooks/useTelegramBackButton";
import { MapPinIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import moment from "moment";
import ShareButton from "./_components/ShareButton";
import { useTranslation } from "react-i18next";
import { marked } from "marked";
import dompurify from "dompurify";
import ReportButton from "./_components/ReportButton";
import useUser from "@/hooks/useUser";

export default function EventPage({ params: { id } }: { params: { id: string } }) {
  const { t } = useTranslation();
  const { data, isLoading, error } = useSWR(`/tgbot/v1/events/${id}`);
  const { user } = useUser();
  useTelegramBackButton();

  if (error) return <div>Failed to load</div>;
  if (!data) return null;
  return (
    <div className="flex flex-col mt-4">
      <div className="mx-5">
        <div className="w-full avatar">
          <div className="w-full relative rounded-xl shadow-xl border border-base-300 overflow-hidden">
            <Image
              src={data.image_url || DEFAULT_EVENT_IMAGE_URL}
              alt="Event image"
              className="opacity-90"
              fill={true}
            />
          </div>
        </div>
      </div>
      <div className="card mx-5 my-3 border border-base-300 p-3 relative">
        <h1 className="card-title">{data.title}</h1>
        {data.startAt && <div className="text-xs text-primary mt-1">{moment(data.startAt).format("llll")}</div>}
        <div className="card-body my-3 p-0">
          {data.description && (
            <div
              dangerouslySetInnerHTML={{ __html: dompurify.sanitize(marked.parse(data.description) as string) }}
            ></div>
          )}
          {data.address && (
            <div className="opacity-50 text-sm mt-4 flex flex-row flex-between">
              <div className="w-5 h-5 mr-1">
                <MapPinIcon className="w-5 h-5" />
              </div>
              <div>{data.address}</div>
            </div>
          )}
          {data.lat && data.lng && (
            <div className="w-full h-48 rounded overflow-hidden">
              <iframe
                className="w-full h-full"
                src={`https://maps.google.com/maps?q=${data.lat},${data.lng}&z=14&output=embed`}
                allowFullScreen={true}
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
              />
            </div>
          )}
          {data.addressInfo && <div className="text-xs opacity-50">{data.addressInfo}</div>}
        </div>
      </div>
      <div className="mx-5">
        <button className="btn btn-success w-full">{t("event.join_button")}</button>
        <ShareButton className="my-3" eventId={id} />
        {user && user.id != data.created_by && <ReportButton className="my-3" eventId={id} />}
      </div>
    </div>
  );
}
