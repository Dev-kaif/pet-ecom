import { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion'; // For detecting when the element is in view

interface UseCountUpOptions {
  start?: number;
  end: number;
  duration?: number; // in milliseconds
  delay?: number; // in milliseconds
}

const useCountUp = ({ start = 0, end, duration = 2000, delay = 0 }: UseCountUpOptions) => {
  const [count, setCount] = useState(start);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 }); // Trigger when 50% of element is visible

  useEffect(() => {
    if (!isInView || count === end) return;

    let startTime: number | null = null;
    const animateCount = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        setCount(Math.min(end, start + Math.floor(progress * (end - start))));
        requestAnimationFrame(animateCount);
      } else {
        setCount(end);
      }
    };

    const timeoutId = setTimeout(() => {
      requestAnimationFrame(animateCount);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      // No need to cancel requestAnimationFrame directly, as the check `if (progress < 1)` handles it.
    };
  }, [end, duration, start, delay, isInView]);

  return { count, ref };
};

export default useCountUp;