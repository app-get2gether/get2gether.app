import { EditableInput, EditableTextarea } from "@/components/Editable";
import GMaps from "@/components/GMaps";
import Modal from "@/components/tgbot/Modal";
import { TCreateEventStore, useCreateEventStore } from "@/store";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

export default function LocationButton() {
  const { t } = useTranslation();
  const { location, setLocation } = useCreateEventStore((state: TCreateEventStore) => ({
    location: state.location,
    setLocation: state.setLocation,
  }));
  const [showLocationModal, setShowLocationModal] = useState(false);

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
    <div className="inline-flex cursor-pointer animated-on-press">
      <label className="mr-4 text-primary">
        <MapPinIcon className="w-6 h-6 -mt-1 inline-block" />
      </label>
      <div>
        <button className="rounded-md truncate" onClick={onLocationButtonClick}>
          {t("create_event.select_location_button")}
        </button>
      </div>
      {typeof window !== "undefined" &&
        window.document &&
        createPortal(
          <Modal open={showLocationModal} onClose={onCloseLocationModal}>
            <div>
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
    </div>
  );
}
