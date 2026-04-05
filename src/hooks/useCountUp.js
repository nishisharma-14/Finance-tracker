import { useState, useEffect } from 'react';

export function useCountUp(endValue, duration = 1500) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutExpo for dramatic slowdown at the end
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setValue(endValue * ease);
      
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };
    
    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    };
  }, [endValue, duration]);

  return value;
}
