'use client';

import { useEffect, useRef } from 'react';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  text: string;
  color: string;
}

// Text from "江苏省海门中学" and "Haimen Middle School, Jiangsu Province"
const textChars = [
  '江', '苏', '省', '海', '门', '中', '学',
  'H', 'a', 'i', 'm', 'e', 'n',
  'M', 'i', 'd', 'd', 'l', 'e',
  'S', 'c', 'h', 'o', 'o', 'l',
  'J', 'i', 'a', 'n', 'g', 's', 'u',
  'P', 'r', 'o', 'v', 'i', 'n', 'c', 'e'
];

const colors = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // green
  '#06b6d4', // cyan
];

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize balls
    const numBalls = 30;
    ballsRef.current = Array.from({ length: numBalls }, () => {
      const radius = 30 + Math.random() * 40;
      return {
        x: Math.random() * canvas.width,
        y: -radius - Math.random() * 500, // Start above screen
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 2 + 1,
        radius,
        text: textChars[Math.floor(Math.random() * textChars.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ballsRef.current.forEach((ball) => {
        // Update position
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Add gravity
        ball.vy += 0.1;

        // Bounce off walls
        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
          ball.vx *= -0.8;
          ball.x = Math.max(ball.radius, Math.min(canvas.width - ball.radius, ball.x));
        }

        // Bounce off floor
        if (ball.y + ball.radius > canvas.height) {
          ball.vy *= -0.7;
          ball.y = canvas.height - ball.radius;
          ball.vx *= 0.95; // Add friction
        }

        // Ball collision detection
        ballsRef.current.forEach((otherBall) => {
          if (ball === otherBall) return;
          
          const dx = otherBall.x - ball.x;
          const dy = otherBall.y - ball.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < ball.radius + otherBall.radius) {
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);
            
            // Rotate velocities
            let vx1 = ball.vx * cos + ball.vy * sin;
            const vy1 = ball.vy * cos - ball.vx * sin;
            let vx2 = otherBall.vx * cos + otherBall.vy * sin;
            const vy2 = otherBall.vy * cos - otherBall.vx * sin;
            
            // Collision reaction
            const vxTotal = vx1 - vx2;
            vx1 = ((ball.radius - otherBall.radius) * vx1 + 2 * otherBall.radius * vx2) / 
                  (ball.radius + otherBall.radius);
            vx2 = vxTotal + vx1;
            
            // Update positions to prevent overlap
            const overlap = ball.radius + otherBall.radius - distance;
            if (overlap > 0) {
              const angle = Math.atan2(dy, dx);
              const moveX = (overlap / 2) * Math.cos(angle);
              const moveY = (overlap / 2) * Math.sin(angle);
              
              ball.x -= moveX;
              ball.y -= moveY;
              otherBall.x += moveX;
              otherBall.y += moveY;
            }
            
            // Update velocities
            ball.vx = vx1 * cos - vy1 * sin;
            ball.vy = vy1 * cos + vx1 * sin;
            otherBall.vx = vx2 * cos - vy2 * sin;
            otherBall.vy = vy2 * cos + vx2 * sin;
          }
        });

        // Draw ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw text
        ctx.fillStyle = 'white';
        ctx.font = `bold ${ball.radius * 0.8}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ball.text, ball.x, ball.y);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900">
      {/* Canvas for balls */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white">
              江苏省海门中学
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-4">
              Haimen Middle School
            </p>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400">
              Jiangsu Province
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
