"use client";

import useDefaultImage from "@/hooks/useDefaultImage";
import useUser from "@/hooks/useUser";
import Image from "next/image";
import BalanceBlock from "./_components/BalanceBlock";
import { TelegramIcon } from "@/components/icons";
import { EyeSlashIcon, UserIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
  const { user: me } = useUser();
  const { t } = useTranslation();

  return (
    <div className="mx-5 h-full">
      <div className="flex flex-col justify-between min-h-full">
        <div>
          <div className="m-3">
            <div>
              <div className="mt-3">
                <div className="flex flex-row gap-2">
                  <UserIcon className="w-5 h-5 mt-[.2rem]" />
                  <span>{me && me.username}</span>
                </div>
                {me && me.tg_username && (
                  <div className="flex flex-row gap-2 mt-1">
                    <TelegramIcon className="w-5 h-5 mt-[.2rem] fill-base-content" />
                    <span>{me.tg_username}</span>
                    <EyeSlashIcon className="w-4 h-4 mt-[.3rem] opacity-50" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="card mt-5"></div>
          <div className="flex flex-row justify-center mt-10">
            <BalanceBlock funds={me.balance || 0} />
          </div>
        </div>

        <div>
          <button className="btn btn-neutral w-full my-5">{t("profile.get_bonus")}</button>
        </div>
      </div>
    </div>
  );
}
