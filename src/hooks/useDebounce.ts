import { useEffect, useRef } from "react";

export default function useDebounce(effect: () => void, deps: any[], delay: number) {
  const handler = useRef<number>(null);

  useEffect(() => {
    if (handler.current) clearTimeout(handler.current);
    handler.current = window.setTimeout(effect, delay);

    return () => {
      if (handler.current) clearTimeout(handler.current);
    };
  }, [...deps, delay]);
}
