// src/hooks/useCounter.ts
import { useState, useEffect, useRef } from 'react';

interface UseCounterOptions {
  duration?: number; // Animation duration in milliseconds
  delay?: number;     // Delay before starting the animation in milliseconds
}

// targetNumber is the numerical value to count to
// suffix is the string to append after the number (e.g., "+", "K+", etc.)
const useCounter = (targetNumber: number, suffix: string = '', options?: UseCounterOptions) => {
  const { duration = 2000, delay = 0 } = options || {};
  const [count, setCount] = useState<number>(0); // Explicitly type as number
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Ensure targetNumber is a valid number
    if (isNaN(targetNumber)) {
      setCount(0); // Fallback if target is not a valid number
      return;
    }

    setCount(0); // Reset count on target change

    const animate = (currentTime: DOMHighResTimeStamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const progress = (currentTime - startTimeRef.current) / duration;

      if (progress < 1) {
        // Calculate the current value based on progress
        const easedProgress = easeOutQuad(progress); // Apply easing for smoother animation
        const currentValue = Math.floor(easedProgress * targetNumber); // Use targetNumber as number
        setCount(currentValue);
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete, set to target number
        setCount(targetNumber);
        animationFrameRef.current = null;
      }
    };

    const startAnimation = () => {
      startTimeRef.current = null; // Reset start time for new animation
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const delayTimeout = setTimeout(startAnimation, delay);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearTimeout(delayTimeout);
    };
  }, [targetNumber, duration, delay]); // Dependencies for useEffect

  // Easing function for smoother animation (Quad Easing Out)
  const easeOutQuad = (t: number) => t * (2 - t);

  // Return the formatted count string
  return `${Math.floor(count)}${suffix}`;
};

export default useCounter;