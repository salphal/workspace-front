import { useState } from 'react';

const defaultDomRect = new DOMRect(0, 0, 0, 0);

export interface IUseDomRectProps<T extends HTMLDivElement> {
  element?: T | null;
}

export const useDomRect = <T extends HTMLDivElement>(props: IUseDomRectProps<T> = {}) => {
  const { element } = props;

  const [rect, setRect] = useState<DOMRect>(defaultDomRect);

  const rectRef = useRef<T | null>(null);

  useEffect(() => {
    windowOnResize();
    window.addEventListener('resize', windowOnResize);
    return () => {
      window.removeEventListener('resize', windowOnResize);
    };
  }, []);

  const windowOnResize = () => {
    const dom = element || rectRef.current;
    if (dom instanceof HTMLElement) {
      const rect = dom.getBoundingClientRect();
      setRect(rect);
    }
  };

  return {
    rect,
    rectRef,
  };
};
