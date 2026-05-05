'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}

export default function MagneticButton({ children, className = '', onClick, href }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 400 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * 0.2;
    const deltaY = (e.clientY - centerY) * 0.2;
    
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const ButtonWrapper = href ? 'a' : 'button';
  const wrapperProps = href ? { href, target: '_self' } : { onClick };

  return (
    <motion.div
      ref={ref}
      style={{
        x: xSpring,
        y: ySpring,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={className}
      whileTap={{ scale: 0.95 }}
    >
      <ButtonWrapper
        {...wrapperProps}
        className={className}
        style={{ display: 'contents' }}
      >
        {children}
      </ButtonWrapper>
      
      {/* Magnetic glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl -z-10"
        style={{
          backgroundColor: isHovered ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
          scale: useTransform(xSpring, [-10, 0, 10], [0.8, 1, 0.8]),
          opacity: useTransform(xSpring, [-10, 0, 10], [0.5, 0, 0.5]),
        }}
      />
    </motion.div>
  );
}
