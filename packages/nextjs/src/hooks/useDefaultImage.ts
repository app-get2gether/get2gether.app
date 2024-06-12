import { WebAppContext } from "@/contexts";
import { useContext } from "react";

const useDefaultImage = () => {
  const webApp = useContext(WebAppContext);
  const logoFileName = webApp && webApp.colorScheme == "light" ? "logog2g.png" : "logog2g_w.png";

  return `${process.env.NEXT_PUBLIC_UI_URL}/${logoFileName}`;
};

export default useDefaultImage;
