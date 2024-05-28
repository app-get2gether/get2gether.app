// Telegram MiniApp Modal inspired by ton-connect sdk Modal
// https://github.com/ton-connect/sdk/blob/main/packages/ui/src/app/components/modal/index.tsx
import { CSSTransition } from "react-transition-group";
import IconButton from "@/components/IconButton";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useCallback, useRef } from "react";
import { useTelegramViewportHack } from "@/hooks/useTelegramViewportResize";

export default function Modal({
  open,
  children,
  onClose,
}: {
  open: boolean;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const _onClose = useCallback(() => {
    onClose();
  }, [onClose]);
  const ref = useRef<HTMLDivElement>(null);
  // Prevent click outside of modal
  const disableClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  useTelegramViewportHack(ref);

  return (
    <CSSTransition nodeRef={ref} in={open} timeout={500} mountOnEnter={true} unmountOnExit={true}>
      <div ref={ref} className="tgbot-modal" onClick={_onClose}>
        <div className="tgbot-modal-content rounded-t-3xl bg-base-100 z-20" onClick={disableClick}>
          <IconButton
            className="absolute right-4 top-4 z-10 bg-neutral text-neutral-content rounded-full"
            onClick={_onClose}
          >
            <XMarkIcon className="h-4 w-4" />
          </IconButton>
          <div className="mt-10 px-5">{children}</div>
        </div>
      </div>
    </CSSTransition>
  );
}
