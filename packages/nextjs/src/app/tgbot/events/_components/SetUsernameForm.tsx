import { useTranslation } from "react-i18next";

export default function SetUsernameForm() {
  const { t } = useTranslation();
  return (
    <div className="flex h-full flex-col items-center justify-center">
      {t("Set your username")}
      <input className="input" type="text" />
      <button className="button button-primary">{t("Set")}</button>
    </div>
  );
}
