

import { useState, useLayoutEffect, RefObject } from 'react';

type ElementDimensions = {
  width: number;
  height: number;
};

const useElementDimensions = (
  elementRef: RefObject<HTMLElement | null>,
  hookName = 'useElementDimensions'
): ElementDimensions => {
  const [dimensions, setDimensions] = useState<ElementDimensions>({
    width: 0,
    height: 0,
  });

  useLayoutEffect(() => {
    const updateDimensions = () => {
      if (elementRef.current) {
        setDimensions({
          width: elementRef.current.offsetWidth,
          height: elementRef.current.offsetHeight,
        });
        
        // Optional debug logging with custom hook name
        if (process.env.NODE_ENV === 'development') {
          console.log(`${hookName}:`, {
            width: elementRef.current.offsetWidth,
            height: elementRef.current.offsetHeight,
          });
        }
      }
    };

    // Initial measurement
    updateDimensions();

    // Handle responsive changes
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (elementRef.current) {
      resizeObserver.observe(elementRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [elementRef, hookName]);

  return dimensions;
};

export default useElementDimensions;