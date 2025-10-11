import { useCallback, useEffect, useRef, useState } from 'react';

interface UseSidebarResizeProps {
  minWidth?: number;
  maxWidth?: number;
  initialWidthValue?: number | string;
}

const useSidebarResize = ({
  minWidth = 256,
  maxWidth = 600,
  initialWidthValue = parseInt(localStorage.getItem('SidebarWidth') ?? '256', 10) || minWidth
}: UseSidebarResizeProps = {}) => {
  const [width, setWidth] = useState(initialWidthValue);
  const isResizing = useRef(false);
  const frame = useRef<number | null>(null);

  const handleResize = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const newWidth = Math.min(Math.max(e.clientX, minWidth), maxWidth);
      localStorage.setItem('SidebarWidth', newWidth.toString());
      setWidth(newWidth);
    });
  }, [minWidth, maxWidth]);

  const stopResize = useCallback(() => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleResize);
    document.removeEventListener("mouseup", stopResize);
  }, [handleResize]);

  const startResize = useCallback(() => {
    isResizing.current = true;
    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", stopResize);
  }, [handleResize, stopResize]);

  useEffect(() => {
    return () => stopResize();
  }, [stopResize]);

  return { width, startResize };
};

export default useSidebarResize;