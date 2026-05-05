'use client';

import { useEffect } from 'react';

export default function GrainOverlay() {
  useEffect(() => {
    const canvas = document.getElementById('grain-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width = window.innerWidth;
    const h = canvas.height = window.innerHeight;

    const grain = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, w, h);

      const imageData = ctx.getImageData(0, 0, w, h);
      const buffer32 = new Uint32Array(imageData.data.buffer);
      const len = buffer32.length;

      for (let i = 0; i < len; i++) {
        if (Math.random() < 0.1) {
          const alpha = (Math.random() * 50) | 0;
          const color = (255 << 24) | (alpha << 16);
          buffer32[i] = color;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      requestAnimationFrame(grain);
    };

    grain();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      id="grain-canvas"
      className="fixed inset-0 pointer-events-none z-50 opacity-40"
      style={{ mixBlendMode: 'overlay' }}
    />
  );
}
