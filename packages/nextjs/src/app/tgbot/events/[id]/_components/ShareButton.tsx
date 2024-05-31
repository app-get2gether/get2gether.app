import Modal from "@/components/tgbot/Modal";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import ShareIcon from "@heroicons/react/24/outline/ShareIcon";
import Link from "next/link";
import { useCallback, useState } from "react";

export default function ShareButton({ eventId, className }: { eventId: string; className?: string }) {
  const [showModal, setShowModal] = useState(false);
  const onClick = useCallback(() => {
    setShowModal(true);
  }, [setShowModal]);
  const onModalClose = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);

  const botUrl = encodeURIComponent(`${process.env.NEXT_PUBLIC_BOT_URL}/events/${eventId}`);
  const shareText = encodeURIComponent("Check out this event!");
  const shareUrl = `https://t.me/share/url?url=${botUrl}&text=${shareText}`;

  return (
    <>
      <button className="btn btn-neutral text-neural-content w-full my-3" onClick={onClick}>
        <span>Share</span>
        <span>
          <ShareIcon className="w-4 h-4 inline-block" />
        </span>
      </button>

      <Modal open={showModal} onClose={onModalClose}>
        <div className="my-5 pt-3">
          <Link href={shareUrl} className="btn btn-neutral text-neural-content w-full my-2">
            <span>Send in Telegram</span>
            <ShareIcon className="w-4 h-4 inline-block" />
          </Link>
          <button className="btn btn-neutral text-neural-content w-full">
            <span>Copy invite Link</span>
            <ClipboardIcon className="w-4 h-4 inline-block" />
          </button>
        </div>
      </Modal>
    </>
  );
}
