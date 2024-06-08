import { twMerge } from "tailwind-merge";
import { TCreateEventStore, useCreateEventStore } from "@/store";
import { TicketIcon } from "@heroicons/react/24/outline";
import Modal from "@/components/tgbot/Modal";
import { useCallback, useState } from "react";
import { EditableInput } from "@/components/Editable";
import { useTranslation } from "react-i18next";

export default function SetPriceButton({ className }: { className?: string }) {
  const { ticket_price, setTicketPrice } = useCreateEventStore((state: TCreateEventStore) => ({
    ticket_price: state.ticket_price,
    setTicketPrice: state.setTicketPrice,
  }));
  const [showModal, setShowModal] = useState(false);
  const [_ticket_price, _setTicketPrice] = useState(ticket_price);
  const { t } = useTranslation();

  const onModalClose = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);

  const onModalOpen = useCallback(() => {
    setShowModal(true);
  }, [setShowModal]);

  const onPriceChange = useCallback(
    (_value: string) => {
      const value = parseFloat(_value) || 0;
      _setTicketPrice(value);
    },
    [_setTicketPrice],
  );

  const onSubmit = useCallback(() => {
    setTicketPrice(_ticket_price);
    setShowModal(false);
  }, [setTicketPrice, _ticket_price]);

  return (
    <div className={twMerge("text-sm", className)}>
      <div onClick={onModalOpen} className="inline-flex cursor-pointer animated-on-press">
        <label className="mr-4 text-primary">
          <TicketIcon className="w-5 h-5 -mt-1 inline-block" />
        </label>
        <PriceBlock value={ticket_price} />
      </div>
      <Modal open={showModal} onClose={onModalClose}>
        <div>
          <div className="text">{t("create_event.set_price_title")}</div>
          <div className="text-xs opacity-50">{t("create_event.set_price_description")}</div>
          <EditableInput
            className="textarea-bordered my-3"
            placeholder={t("create_event.set_price_placeholder")}
            value={String(ticket_price)}
            onChange={onPriceChange}
            onSubmit={onSubmit}
          />
          <button className="btn btn-neutral text-neutral-content w-full mb-7" onClick={onSubmit}>
            {t("create_event.set_price_button")}
          </button>
        </div>
      </Modal>
    </div>
  );
}

function PriceBlock({ value }: { value: number }) {
  if (!value) {
    return <div className="bg-success text-base-100 px-3 rounded">Free</div>;
  }

  return (
    <div>
      <span className="text-primary ">{value}</span> <span className="opacity-50">GET</span>
    </div>
  );
}
