'use client';

import { useEffect, useState, useRef } from 'react';
import ScrollReveal from './ScrollReveal';

interface Stat {
  value: number;
  suffix: string;
  label: string;
  color: string;
}

const stats: Stat[] = [
  { value: 50000, suffix: '+', label: 'Happy Customers', color: 'text-blue-500' },
  { value: 10000, suffix: '+', label: 'Products Sold', color: 'text-purple-500' },
  { value: 99, suffix: '%', label: 'Satisfaction Rate', color: 'text-pink-500' },
  { value: 24, suffix: '/7', label: 'Customer Support', color: 'text-emerald-500' },
];

function AnimatedCounter({ value, suffix, color, label }: Stat) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * value);
            
            setCount(current);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(value);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={ref} className="text-center">
      <div className={`text-4xl sm:text-5xl font-bold ${color}`}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-zinc-600 mt-1">{label}</div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <AnimatedCounter {...stat} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
