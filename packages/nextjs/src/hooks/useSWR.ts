import { WebAppContext } from "@/contexts";
import { useContext } from "react";
import useSWR from "swr";
import _pickBy from "lodash/pickBy";
import _isNil from "lodash/isNil";

type QueryParams = Record<string, string>;
type FetchData =
  | string
  | {
      path: string;
      params: QueryParams;
    };

const useCustomSWR = (key: Parameters<typeof useSWR>[0], config?: Parameters<typeof useSWR>[2]) => {
  const webApp = useContext(WebAppContext);
  // TODO: _.pickBy not null for key as FetchData

  return useSWR(
    webApp?.initData ? key : null,
    async (data: FetchData, options: Parameters<typeof fetch>[1]) => {
      let path = "";
      if (typeof data === "string") {
        path = data;
      } else {
        const query = _pickBy(data.params, v => !_isNil(v));
        path = `${data.path}?${new URLSearchParams(query).toString()}`;
      }
      return fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
        ...options,
        headers: {
          ...options?.headers,
          "X-Telegram-Auth": `${webApp?.initData}`,
        },
      }).then(res => res.json());
    },
    config,
  );
};

export default useCustomSWR;
