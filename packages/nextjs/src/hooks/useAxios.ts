import { WebAppContext } from "@/contexts";
import axios from "axios";
import { useContext } from "react";

const useAxios = () => {
  const webApp = useContext(WebAppContext);

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "X-Telegram-Auth": `${webApp?.initData}`,
    },
  });
};

export default useAxios;
