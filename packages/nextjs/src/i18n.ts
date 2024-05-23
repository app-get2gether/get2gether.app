import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import yaml from "js-yaml";

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "en",
    ns: ["default"],
    defaultNS: "default",
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.yml",
      parse: (data: string) => yaml.load(data),
    },
    interpolation: {
      escapeValue: false,
    },
  });
export default i18n;
