import { EditableTextarea } from "@/components/Editable";
import Modal from "@/components/tgbot/Modal";
import useAxios from "@/hooks/useAxios";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ReportButton({ eventId, className }: { eventId: string; className?: string }) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const tgAxios = useAxios();

  const onSubmit = useCallback(() => {
    // TODO: animate UI
    setLoading(true);
    tgAxios.post(`/tgbot/v1/events/${eventId}/report`, { reason }).finally(() => {
      setTimeout(() => {
        setLoading(false);
        setShowModal(false);
      }, 1000);
    });
  }, [tgAxios, eventId, reason, setShowModal]);
  const onModalClose = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);
  const onReasonChange = useCallback(
    (value: string) => {
      setReason(value);
    },
    [setReason],
  );

  return (
    <div className={className}>
      <button className="btn text-neural-content w-full" onClick={onSubmit}>
        <span>{t("event.report.show_popup_button")}</span>
        <span></span>
      </button>
      <Modal open={showModal} onClose={onModalClose}>
        <div className="my-5 pt-3">
          <div className="mb-5">
            <div className="text-lg mb-2">{t("event.report.title")}</div>
            <div className="text-sm">{t("event.report.description")}</div>
          </div>
          <EditableTextarea
            placeholder={t("event.report.reason_placeholder")}
            onChange={onReasonChange}
            value={reason}
          />
          <button className="btn w-full my-3" disabled={isLoading}>
            {t("event.report.submit_button")}
          </button>
          <div className="h-[1px]"></div>
        </div>
      </Modal>
    </div>
  );
}
