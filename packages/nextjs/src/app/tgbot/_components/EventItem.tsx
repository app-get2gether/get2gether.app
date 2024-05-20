import Image from "next/image";

export default function EventItem({
  posterUrl,
  title,
  description,
}: {
  posterUrl: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex">
      <div className="avatar mr-4">
        <div className="w-24 rounded">
          <Image src={posterUrl} alt="" width={96} height={96} />
        </div>
      </div>
      <div>
        <div className="text-lg">{title}</div>
        <div>{description}</div>
      </div>
    </div>
  );
}
