// Telegram MiniApp Modal inspired by ton-connect sdk Modal
// https://github.com/ton-connect/sdk/blob/main/packages/ui/src/app/components/modal/index.tsx
import { Transition } from "react-transition-group";
import IconButton from "@/components/IconButton";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useCallback, useRef } from "react";
import { useTelegramViewportHack } from "@/hooks/useTelegramViewportResize";
import { createPortal } from "react-dom";
import { twJoin } from "tailwind-merge";

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

  if (typeof window === "undefined") return null;
  if (!window.document) return null;

  // Transition is used in favor of CSSTransition because of the issue with initial state
  // https://github.com/reactjs/react-transition-group/issues/366
  const transitionClasses = {
    entering: "enter-active",
    entered: "enter-done",
    exiting: "exit-active",
    exited: "exit-done",
    unmounting: "",
    unmounted: "",
  };

  return createPortal(
    <Transition in={open} timeout={500}>
      {state => (
        <div className={twJoin("tgbot-modal", transitionClasses[state])}>
          <div className="tgbot-modal-wrapper" onClick={_onClose}>
            <div className="tgbot-modal-content rounded-t-3xl bg-base-100 z-20" onClick={disableClick}>
              <IconButton className="absolute right-4 top-4 z-10 bg-base-300 rounded-full" onClick={_onClose}>
                <XMarkIcon className="h-4 w-4" />
              </IconButton>
              <div className="mt-10 px-5" ref={ref}>
                {children}
              </div>
            </div>
            {/* Hack to keep padding for the modal */}
            <div className="h-10 w-full">&nbsp;</div>
          </div>
          {/* Hack to hide bottom elements, iOS */}
          <div className="absolute bg-base-100 h-10 w-full bottom-0 z-10" />
        </div>
      )}
    </Transition>,
    document.body,
  );
}
