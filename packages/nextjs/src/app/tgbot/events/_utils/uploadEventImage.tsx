import { Axios } from "axios";
import md5 from "crypto-js/md5";

export async function uploadEventImage(axios: Axios, file: File | null, eventId: string) {
  if (!file) return;

  let fileNamePart = file.name;
  let ext = "";
  const m = file.name.match(/^(.*)\.(\w+)$/);
  if (m) {
    fileNamePart = m[1];
    ext = m[2];
  }

  let fileName = md5(fileNamePart).toString();
  if (ext) {
    fileName += `.${ext}`;
  }

  let res;
  res = await axios.get(`/tgbot/v1/events/${eventId}/get_upload_url?file_name=${fileName}`);

  const uploadUrl = res.data;
  res = await axios.put(uploadUrl, file);

  const imageUrl = `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/events/${eventId}/${fileName}`;
  await axios.put(`/tgbot/v1/events/${eventId}`, { image_url: imageUrl });
}
