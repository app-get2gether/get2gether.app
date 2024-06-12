import Modal from "@/components/tgbot/Modal";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export default function JoinButton({ eventId, className }: { eventId: string; className?: string }) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const { data, error } = useSWR(`/tgbot/v1/events/${eventId}`);

  const onModalClose = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);

  if (error) return <div>Failed to load</div>;

  return (
    <div className={className}>
      <button className="btn btn-neutral text-neutral-content w-full">{t("event.join_button")}</button>

      <Modal open={showModal} onClose={onModalClose}>
        <div className="my-5 pt-3">
          <PriceBlock />
        </div>
      </Modal>
    </div>
  );
}

function PriceBlock({}) {
  return null;
}
