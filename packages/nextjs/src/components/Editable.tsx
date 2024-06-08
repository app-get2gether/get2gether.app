import { ForwardedRef, MutableRefObject, forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

/**
 * Input built based on contenteditable div
 * automatically submits on blur
 */
export function EditableInput({
  value,
  placeholder,
  className,
  onSubmit,
  onChange,
  onEnter, // TODO change to onEnterPress
}: {
  value?: string;
  placeholder?: string;
  className?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onEnter?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerText = value || "";
  }, [value, ref]);
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
  const onInput = useCallback(
    (e: React.ChangeEvent<HTMLDivElement>) => {
      onChange && onChange(e.currentTarget.innerText);
    },
    [onChange],
  );

  const onBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      // https://stackoverflow.com/questions/14638887/br-is-inserted-into-contenteditable-html-element-if-left-empty
      if (!e.currentTarget.innerText.trim()) {
        e.currentTarget.innerHTML = "";
      }
      e.currentTarget.dispatchEvent(new Event("keyboard:hide"));
      onSubmit && onSubmit(e.currentTarget.innerText);
    },
    [onSubmit],
  );
  const onFocus = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    e.currentTarget.dispatchEvent(new Event("keyboard:show"));
  }, []);

  return (
    <div
      ref={ref}
      contentEditable={true}
      className={twMerge("w-full min-w-44 block textarea", className)}
      data-placeholder={placeholder}
      onKeyDown={onKeyDown}
      onInput={onInput}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );
}

/**
 * Textarea built based on contenteditable div
 */
export const EditableTextarea = forwardRef<
  HTMLDivElement,
  {
    value?: string;
    placeholder?: string;
    className?: string;
    onBlur?: () => void;
    onSubmit?: (innerText: string, innerHTML: string) => void;
    onChange?: (innerText: string, innerHTML: string) => void;
  }
>(({ value, placeholder, className, onBlur, onChange, onSubmit }, ref: ForwardedRef<HTMLDivElement | null>) => {
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.currentTarget.blur();
    }
  }, []);
  const [_value] = useState(value);
  useEffect(() => {
    const current = ref && (ref as MutableRefObject<HTMLDivElement>).current;
    if (!current) return;
    current.innerText = _value || "";
  }, [_value, ref]);

  const _onChange = useCallback(
    (e: React.ChangeEvent<HTMLDivElement>) => {
      // https://stackoverflow.com/questions/14638887/br-is-inserted-into-contenteditable-html-element-if-left-empty
      if (!e.currentTarget.innerText.trim()) {
        e.currentTarget.innerHTML = "";
      }
      onChange && onChange(e.currentTarget.innerText || "", e.currentTarget.innerHTML);
    },
    [onChange],
  );
  const _onBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      // https://stackoverflow.com/questions/14638887/br-is-inserted-into-contenteditable-html-element-if-left-empty
      if (!e.currentTarget.innerText.trim()) {
        e.currentTarget.innerHTML = "";
      }
      const event = new Event("keyboard:hide", { bubbles: true, cancelable: true });
      e.currentTarget.dispatchEvent(event);
      onBlur && onBlur();
      onSubmit && onSubmit(e.currentTarget.innerText, e.currentTarget.innerHTML);
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
      className={twMerge("w-full min-w-44 block textarea", className)}
      data-placeholder={placeholder}
      onKeyDown={onKeyDown}
      onBlur={_onBlur}
      onChange={_onChange}
      onFocus={onFocus}
    />
  );
});
EditableTextarea.displayName = "EditableTextarea";
