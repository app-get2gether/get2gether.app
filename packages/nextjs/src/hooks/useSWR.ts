import { WebAppContext } from "@/contexts";
import { useContext } from "react";
import useSWR from "swr";

const useCustomSWR = (key: Parameters<typeof useSWR>[0], config?: Parameters<typeof useSWR>[2]) => {
  const webApp = useContext(WebAppContext);

  return useSWR(
    webApp?.initData ? key : null,
    async (path: string, options: Parameters<typeof fetch>[1]) => {
      return fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: `Telegram ${webApp?.initData}`,
        },
      }).then(res => res.json());
    },
    config,
  );
};

export default useCustomSWR;
