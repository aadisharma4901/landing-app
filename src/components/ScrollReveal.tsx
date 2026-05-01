'use client';

import { useEffect, useRef, useState } from 'react';
import React from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function ScrollReveal({ 
  children, 
  delay = 0, 
  className = '' 
}: ScrollRevealProps): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isRevealed) {
          setTimeout(() => setIsRevealed(true), delay);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [isRevealed, delay]);

  return (
    <div 
      ref={ref} 
      className={`reveal-on-scroll ${isRevealed ? 'revealed' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
