import { useEffect, RefObject } from 'react';

export function useClickAway(ref: RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener('mouseup', listener);
    document.addEventListener('touchend', listener);

    return () => {
      document.removeEventListener('mouseup', listener);
      document.removeEventListener('touchend', listener);
    };
  }, [ref, handler]);
}