import { ForwardedRef, MutableRefObject, forwardRef, useCallback } from "react";
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
      onSubmit(e.currentTarget.innerText);
    },
    [onSubmit],
  );

  return (
    <div
      contentEditable={true}
      className=" w-full min-w-44 block textarea textarea-lg textarea-ghost focused:texterea-info"
      data-placeholder={placeholder}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
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
    onSubmit: () => void;
  }
>(({ placeholder, className, onSubmit }, ref: ForwardedRef<HTMLDivElement | null>) => {
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.currentTarget.blur();
    }
  }, []);

  const onBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      // https://stackoverflow.com/questions/14638887/br-is-inserted-into-contenteditable-html-element-if-left-empty
      if (!e.currentTarget.innerText.trim()) {
        e.currentTarget.innerHTML = "";
        return;
      }
      onSubmit();
    },
    [onSubmit],
  );

  return (
    <div
      ref={ref}
      contentEditable={true}
      className={twMerge("w-full min-w-44 block textarea textarea-ghost focused:texterea-info", className)}
      data-placeholder={placeholder}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
    ></div>
  );
});
EditableTextarea.displayName = "EditableTextarea";
