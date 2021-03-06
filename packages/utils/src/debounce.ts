/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from 'react';

export function useDebounce<F extends (...args: any[]) => void>(
  func: F,
  waitMilliseconds = 50,
  options = {
    isImmediate: false,
  },
): F {
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout>>();

  // eslint-disable-next-line func-names
  return function (this: any, ...args: any[]) {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    const doLater = () => {
      timeoutIdRef.current = undefined;
      if (!options.isImmediate) {
        func.apply(this, args);
      }
    };

    const shouldCallNow = options.isImmediate && timeoutIdRef.current === undefined;

    timeoutIdRef.current = setTimeout(doLater, waitMilliseconds);

    if (shouldCallNow) {
      func.apply(this, args);
    }
  } as any;
}
