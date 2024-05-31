"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import EventsList from "../_components/EventsList";
import { useTranslation } from "react-i18next";
import { MapIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { useCallback, useState } from "react";
import Modal from "@/components/tgbot/Modal";
import { useRouter } from "next/navigation";

export default function EventsPage() {
  const { t } = useTranslation();
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const router = useRouter();

  const onFilterClick = useCallback(() => {
    setShowFiltersModal(true);
  }, [setShowFiltersModal]);

  const onFiltersModalClose = useCallback(() => {
    setShowFiltersModal(false);
  }, [setShowFiltersModal]);

  const onMyEventsClick = useCallback(() => {
    router.push("/tgbot/events/create");
  }, [router]);

  return (
    <main className="mx-3">
      <div className="my-3">
        <label className="input input-bordered flex items-center gap-2">
          <input type="text" placeholder="Search events" className="grow" />
          <MagnifyingGlassIcon className="w-6 h-6 opacity-70" />
        </label>
      </div>
      <div className="flex flex-row justify-between">
        <div>
          <div className="badge badge-outline cursor-pointer" onClick={onMyEventsClick}>
            {t("list_events.mine")}
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <MapIcon className="w-6 h-6" />
          <FunnelIcon className="w-6 h-6" onClick={onFilterClick} />
        </div>
      </div>
      <div>
        <EventsList />
      </div>
      <Modal open={showFiltersModal} onClose={onFiltersModalClose}>
        <div>Setup filters</div>
      </Modal>
    </main>
  );
}
