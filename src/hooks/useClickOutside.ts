// hooks/useClickOutside.ts
import { useEffect, RefObject } from "react";

type Event = MouseEvent | TouchEvent;

export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref?.current;
      // Nếu click vào bên trong element hoặc các element con thì không làm gì cả
      if (!el || el.contains((event?.target as Node) || null)) {
        return;
      }
      handler(event); // Ngược lại thì gọi handler
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]); // Chỉ chạy lại effect nếu ref hoặc handler thay đổi
};
