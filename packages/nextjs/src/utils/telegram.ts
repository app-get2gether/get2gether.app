export const parseUserData = (initData?: string) => {
  if (!initData) {
    return {};
  }
  const chunks = initData.split("&");
  const userRecord = chunks.map(chunk => chunk.split("=")).filter(([k, v]) => k == "user")[0];
  return JSON.parse(decodeURIComponent(userRecord[1]));
};
