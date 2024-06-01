import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function useTelegramBackButton() {
  // React context isn't used because of the issue with the storybook-react-context-addon
  // https://github.com/tyom/storybook-addons/issues/44
  const webApp = typeof window !== "undefined" && window.Telegram?.WebApp;
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!webApp) return;
    const back = searchParams.get("back");
    if (!back) return;

    function onBackButtonClick() {
      if (!webApp) return;
      router.back();
    }

    webApp.BackButton.onClick(onBackButtonClick);
    webApp.BackButton.show();
    return () => {
      webApp.BackButton.offClick(onBackButtonClick);
      webApp.BackButton.hide();
    };
  }, [router, searchParams, webApp]);
}
