import { useEffect, useRef } from 'react';

export default function SciFiHeader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const sphereRadius = Math.min(rect.width, rect.height) * 0.4;

    const particles: { angle: number; distance: number; size: number; speed: number }[] = [];
    for (let i = 0; i < 20; i++) {
      particles.push({
        angle: (Math.PI * 2 * i) / 20,
        distance: sphereRadius + 30,
        size: 3 + Math.random() * 3,
        speed: 0.01 + Math.random() * 0.015,
      });
    }

    const coreParticles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    for (let i = 0; i < 120; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * sphereRadius;
      coreParticles.push({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: 1.5 + Math.random() * 2.5,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);

      ctx.save();
      ctx.translate(centerX, centerY);

      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, sphereRadius);
      gradient.addColorStop(0, 'rgba(255, 165, 0, 0.4)');
      gradient.addColorStop(0.3, 'rgba(255, 140, 0, 0.3)');
      gradient.addColorStop(0.6, 'rgba(255, 120, 0, 0.2)');
      gradient.addColorStop(1, 'rgba(255, 100, 0, 0.05)');

      ctx.beginPath();
      ctx.arc(0, 0, sphereRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      coreParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        const distance = Math.sqrt(p.x * p.x + p.y * p.y);
        if (distance > sphereRadius) {
          const angle = Math.atan2(p.y, p.x);
          p.x = Math.cos(angle) * sphereRadius * 0.9;
          p.y = Math.sin(angle) * sphereRadius * 0.9;
          p.vx *= -0.5;
          p.vy *= -0.5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 200, 150, 0.7)';
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'rgba(255, 165, 0, 0.5)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      particles.forEach((p) => {
        p.angle += p.speed;
        const x = Math.cos(p.angle) * p.distance;
        const y = Math.sin(p.angle) * p.distance;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(255, 165, 0, 0.9)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      ctx.restore();

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative w-full h-64 sm:h-72 md:h-80 bg-gradient-to-b from-[#032161] via-[#032f8b] to-[#032f8b] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#032f8b] pointer-events-none z-10"></div>

      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#032161] to-transparent"></div>

      <div className="absolute top-10 left-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl sm:text-7xl md:text-8xl font-black text-white tracking-wider drop-shadow-2xl" style={{ textShadow: '0 0 30px rgba(255, 165, 0, 0.5), 0 0 60px rgba(255, 165, 0, 0.3)' }}>
            AI
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm sm:text-base font-bold px-6 py-2 rounded-full mb-3 shadow-lg shadow-orange-500/50 border-2 border-orange-400/50">
          AI高精度
        </div>
        <div
          className="text-white text-3xl sm:text-4xl md:text-5xl font-black tracking-wide"
          style={{
            textShadow: '0 0 20px rgba(255, 165, 0, 0.6), 2px 2px 4px rgba(0,0,0,0.5), -1px -1px 0 rgba(0,0,0,0.3), 1px -1px 0 rgba(0,0,0,0.3), -1px 1px 0 rgba(0,0,0,0.3), 1px 1px 0 rgba(0,0,0,0.3)',
            fontFamily: 'sans-serif',
            fontWeight: 900,
          }}
        >
          銘柄無料診断
        </div>
      </div>
    </div>
  );
}
