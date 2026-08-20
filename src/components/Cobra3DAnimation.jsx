import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Zap, ShieldAlert, Activity } from 'lucide-react';

export default function Cobra3DAnimation() {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = 380);
    let height = (canvas.height = 200);

    let time = 0;
    const particles = [];

    // Initialize 60 glowing energy aura particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        alpha: Math.random(),
        color: Math.random() > 0.4 ? '#00FF75' : '#00E5FF'
      });
    }

    const render = () => {
      time += 0.04;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw glowing particle aura behind cobra
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.sin(time + p.x) * 0.4 + 0.4;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
      });

      // Center coordinates for Cobra Head
      const centerX = width / 2;
      const centerY = height / 2 + 10;

      // Mouse interactive offset (slight tracking movement)
      const targetX = (mousePos.x - centerX) * 0.08;
      const targetY = (mousePos.y - centerY) * 0.08;

      const headX = centerX + Math.sin(time * 0.8) * 6 + targetX;
      const headY = centerY - 25 + Math.cos(time * 0.6) * 4 + targetY;

      // 2. Draw Pulsing Cobra Hood Background Glow
      ctx.save();
      const gradient = ctx.createRadialGradient(headX, headY, 10, headX, headY, 110);
      gradient.addColorStop(0, 'rgba(0, 255, 117, 0.45)');
      gradient.addColorStop(0.5, 'rgba(0, 229, 255, 0.2)');
      gradient.addColorStop(1, 'rgba(8, 11, 17, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(headX, headY, 110, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Draw Animated Slithering Cobra Spine / Body
      ctx.save();
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#00FF75';
      ctx.shadowColor = '#00FF75';
      ctx.shadowBlur = 18;

      ctx.beginPath();
      let lastX = headX;
      let lastY = headY;

      ctx.moveTo(lastX, lastY);

      // Body sine wave segments
      for (let i = 1; i <= 8; i++) {
        const segY = headY + i * 16;
        const wave = Math.sin(time * 1.5 + i * 0.6) * (i * 4);
        const segX = headX + wave;
        ctx.quadraticCurveTo(lastX, lastY, segX, segY);
        lastX = segX;
        lastY = segY;
      }
      ctx.stroke();
      ctx.restore();

      // 4. Draw Cobra Hood (Flaring Wings)
      ctx.save();
      const hoodSpread = Math.sin(time * 1.2) * 4 + 48; // Expanding hood animation
      ctx.fillStyle = '#061610';
      ctx.strokeStyle = '#00FF75';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00FF75';
      ctx.shadowBlur = 20;

      ctx.beginPath();
      ctx.moveTo(headX, headY - 20); // Top tip
      ctx.bezierCurveTo(
        headX - hoodSpread, headY - 10,
        headX - hoodSpread - 10, headY + 35,
        headX, headY + 50
      );
      ctx.bezierCurveTo(
        headX + hoodSpread + 10, headY + 35,
        headX + hoodSpread, headY - 10,
        headX, headY - 20
      );
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // 5. Hood Scales Pattern
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
      ctx.lineWidth = 1.5;
      for (let s = -1; s <= 1; s += 2) {
        ctx.beginPath();
        ctx.moveTo(headX, headY - 10);
        ctx.quadraticCurveTo(headX + s * (hoodSpread * 0.6), headY + 15, headX, headY + 38);
        ctx.stroke();
      }
      ctx.restore();

      // 6. Cobra Head Crown & Eyes
      ctx.save();
      ctx.fillStyle = '#0A2016';
      ctx.strokeStyle = '#00E5FF';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(headX - 16, headY - 5);
      ctx.lineTo(headX, headY - 26);
      ctx.lineTo(headX + 16, headY - 5);
      ctx.lineTo(headX + 10, headY + 15);
      ctx.lineTo(headX - 10, headY + 15);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Glowing Eyes
      const eyeGlow = Math.sin(time * 3) * 0.3 + 0.7;
      ctx.fillStyle = '#00FF75';
      ctx.shadowColor = '#00FF75';
      ctx.shadowBlur = 14 * eyeGlow;

      // Left eye
      ctx.beginPath();
      ctx.ellipse(headX - 6, headY - 10, 3, 2, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Right eye
      ctx.beginPath();
      ctx.ellipse(headX + 6, headY - 10, 3, 2, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // 7. Forked Tongue Animation
      if (Math.sin(time * 2.5) > 0.4) {
        ctx.strokeStyle = '#FF0055';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#FF0055';
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.moveTo(headX, headY + 15);
        const tongueY = headY + 28 + Math.sin(time * 8) * 3;
        ctx.lineTo(headX, tongueY);
        ctx.lineTo(headX - 4, tongueY + 6);
        ctx.moveTo(headX, tongueY);
        ctx.lineTo(headX + 4, tongueY + 6);
        ctx.stroke();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative inline-flex flex-col items-center group cursor-pointer"
    >
      {/* Outer Neon Halo Border */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#00FF75] via-[#00E5FF] to-emerald-500 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition duration-500 group-hover:scale-105"></div>
      
      {/* Container Box */}
      <div className="relative bg-[#080B11]/90 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-5 flex flex-col items-center shadow-2xl overflow-hidden">
        
        {/* Canvas 3D Animated Cobra */}
        <canvas
          ref={canvasRef}
          className="w-[320px] h-[160px] sm:w-[380px] sm:h-[180px] pointer-events-auto transition-transform duration-300 group-hover:scale-105"
        />

        {/* Live Status Badge overlay */}
        <div className="flex items-center justify-between w-full pt-2 border-t border-white/10 px-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF75] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00FF75]"></span>
            </span>
            <span className="text-[11px] font-heading font-extrabold tracking-wider text-white uppercase flex items-center gap-1">
              FITKOBRA 3D AI COBRA
            </span>
          </div>

          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#00FF75]/20 text-[#00FF75] border border-[#00FF75]/30">
            Interactive
          </span>
        </div>

      </div>
    </div>
  );
}
