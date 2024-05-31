import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// @ts-ignore
import en from "@/locales/en/default.yml";
// @ts-ignore
import ru from "@/locales/ru/default.yml";
import moment from "moment";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      default: en,
    },
    ru: {
      default: ru,
    },
  },
  lng: "en",
  fallbackLng: "en",
  ns: ["default"],
  defaultNS: "default",
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", lng => {
  moment.locale(lng);
});

export default i18n;
