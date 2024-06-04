import { EditableTextarea } from "@/components/Editable";
import Modal from "@/components/tgbot/Modal";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ReportButton({ eventId, className }: { eventId: string; className?: string }) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const onClick = useCallback(() => {
    setShowModal(true);
  }, []);
  const onModalClose = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);

  return (
    <div className={className}>
      <button className="btn text-neural-content w-full" onClick={onClick}>
        <span>{t("event.report.show_popup_button")}</span>
        <span></span>
      </button>
      <Modal open={showModal} onClose={onModalClose}>
        <div className="my-5 pt-3">
          <div className="mb-5">
            <div className="text-lg mb-2">{t("event.report.title")}</div>
            <div className="text-sm">{t("event.report.description")}</div>
          </div>
          <EditableTextarea placeholder={t("event.report.reason_placeholder")} onSubmit={() => {}} />
          <button className="btn w-full my-3">{t("event.report.submit_button")}</button>
          <div className="h-[1px]"></div>
        </div>
      </Modal>
    </div>
  );
}
