"use client";

import { TelegramIcon } from "@/components/icons";
import Modal from "@/components/tgbot/Modal";
import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import ShareIcon from "@heroicons/react/24/outline/ShareIcon";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ShareButton({ eventId, className }: { eventId: string; className?: string }) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const onClick = useCallback(() => {
    setShowModal(true);
  }, [setShowModal]);
  const onModalClose = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);
  const onCopyClick = useCallback(
    (url: string) => {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    },
    [setCopied],
  );

  const botUrl = `${process.env.NEXT_PUBLIC_BOT_URL}/events/${eventId}`;
  const shareText = encodeURIComponent("Check out this event!");
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(botUrl)}&text=${shareText}`;

  return (
    <>
      <button className="btn btn-neutral text-neural-content w-full my-3" onClick={onClick}>
        <span>{t("event.share_button")}</span>
        <span>
          <ShareIcon className="w-4 h-4 inline-block" />
        </span>
      </button>

      <Modal open={showModal} onClose={onModalClose}>
        <div className="my-5 pt-3">
          <Link href={shareUrl} className="btn btn-neutral text-neural-content w-full my-2">
            <span>{t("event.share_in_tg_button")}</span>
            {/*
            <ShareIcon className="w-4 h-4 inline-block" />
            */}
            <TelegramIcon className="w-4 h-4 inline-block fill-neutral-content" />
          </Link>
          <button className="btn btn-neutral text-neural-content w-full" onClick={() => onCopyClick(botUrl)}>
            <span>{t("event.copy_link_button")}</span>
            {copied ? (
              <CheckIcon className="w-4 h-4 inline-block" />
            ) : (
              <ClipboardIcon className="w-4 h-4 inline-block" />
            )}
          </button>
        </div>
      </Modal>
    </>
  );
}
