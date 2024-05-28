import { ForwardedRef, forwardRef, useCallback } from "react";
import { twMerge } from "tailwind-merge";

/**
 * Input built based on contenteditable div
 * automatically submits on blur
 */
export function EditableInput({
  onSubmit,
  value,
  placeholder,
  className,
  onEnter,
}: {
  onSubmit: (title: string) => void;
  value?: string;
  placeholder?: string;
  className?: string;
  onEnter?: () => void;
}) {
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter") {
        e.stopPropagation();
        e.preventDefault();
        onEnter && onEnter();
        e.currentTarget.blur();
      }
      if (e.key === "Escape") {
        e.currentTarget.blur();
      }
    },
    [onEnter],
  );

  const onBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      // https://stackoverflow.com/questions/14638887/br-is-inserted-into-contenteditable-html-element-if-left-empty
      if (!e.currentTarget.innerText.trim()) {
        e.currentTarget.innerHTML = "";
      }
      e.currentTarget.dispatchEvent(new Event("keyboard:hide"));
      onSubmit(e.currentTarget.innerText);
    },
    [onSubmit],
  );
  const onFocus = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    e.currentTarget.dispatchEvent(new Event("keyboard:show"));
  }, []);

  return (
    <div
      contentEditable={true}
      className={twMerge("w-full min-w-44 block textarea textarea-ghost focused:texterea-info", className)}
      data-placeholder={placeholder}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      onFocus={onFocus}
    >
      {value}
    </div>
  );
}

/**
 * Textarea built based on contenteditable div
 */
export const EditableTextarea = forwardRef<
  HTMLDivElement,
  {
    placeholder?: string;
    className?: string;
    onBlur?: () => void;
    onSubmit: () => void;
  }
>(({ placeholder, className, onBlur, onSubmit }, ref: ForwardedRef<HTMLDivElement | null>) => {
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.currentTarget.blur();
    }
  }, []);

  const _onBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      // https://stackoverflow.com/questions/14638887/br-is-inserted-into-contenteditable-html-element-if-left-empty
      if (!e.currentTarget.innerText.trim()) {
        e.currentTarget.innerHTML = "";
      }
      const event = new Event("keyboard:hide", { bubbles: true, cancelable: true });
      e.currentTarget.dispatchEvent(event);
      onBlur && onBlur();
      onSubmit();
    },
    [onSubmit, onBlur],
  );
  const onFocus = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const event = new Event("keyboard:show", { bubbles: true, cancelable: true });
    e.currentTarget.dispatchEvent(event);
  }, []);

  return (
    <div
      ref={ref}
      contentEditable={true}
      className={twMerge("w-full min-w-44 block textarea textarea-ghost focused:texterea-info", className)}
      data-placeholder={placeholder}
      onKeyDown={onKeyDown}
      onBlur={_onBlur}
      onFocus={onFocus}
    ></div>
  );
});
EditableTextarea.displayName = "EditableTextarea";
