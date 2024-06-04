import { MutableRefObject, RefObject, useCallback, useEffect } from "react";

// Fix bug on iOS with showing virtual keyboard
// the layout is not updated properly
// reposition ref.current element based on window scroll position
// on getting keyboard:show/keyboard:hide events
//
// @argument ref - ref to the element that scrollable
export const useTelegramViewportHack = (ref: RefObject<HTMLElement>) => {
  const onWindowScroll = useCallback(() => {
    if (window.scrollY === 0) return;
    const shift = document.documentElement.scrollTop;
    document.documentElement.scrollTo(0, 0);
    if (!ref.current || shift === 0) return;
    ref.current.scrollTo(0, shift + ref.current.scrollTop);
    ref.current.style.top = `${shift + ref.current.scrollTop}px`;
  }, [ref]);

  const onKeyboardToggle = useCallback(
    (e: Event) => {
      e.stopPropagation();
      e.preventDefault();
      window.removeEventListener("scroll", onWindowScroll);
      window.addEventListener("scroll", onWindowScroll);
    },
    [onWindowScroll],
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    node.addEventListener("keyboard:show", onKeyboardToggle);
    node.addEventListener("keyboard:hide", onKeyboardToggle);
    return () => {
      node.removeEventListener("keyboard:show", onKeyboardToggle);
      node.removeEventListener("keyboard:hide", onKeyboardToggle);
      window.removeEventListener("scroll", onWindowScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onKeyboardToggle, onWindowScroll, ref]);
};
