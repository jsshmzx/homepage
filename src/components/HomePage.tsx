'use client';

import { useEffect, useRef } from 'react';
import type p5 from 'p5';

interface Ball {
  position: p5.Vector;
  velocity: p5.Vector;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    // Dynamically import p5 only on client side
    import('p5').then((p5Module) => {
      const P5 = p5Module.default;
      
      if (!containerRef.current) return;

      const sketch = (p: p5) => {
        const balls: Ball[] = [];
        const gravity = 0.1;

        p.setup = () => {
          p.createCanvas(p.windowWidth, p.windowHeight);
          p.textAlign(p.CENTER, p.CENTER);
          p.textFont('Arial');
          
          // Initialize balls
          const numBalls = 30;
          for (let i = 0; i < numBalls; i++) {
            const radius = 30 + p.random(40);
            balls.push({
              position: p.createVector(p.random(p.width), -radius - p.random(500)),
              velocity: p.createVector((p.random() - 0.5) * 2, p.random(2) + 1),
              radius,
              text: textChars[Math.floor(p.random(textChars.length))],
              color: colors[Math.floor(p.random(colors.length))],
            });
          }
        };

        p.draw = () => {
          p.clear();

          balls.forEach((ball, i) => {
            // Update position
            ball.position.add(ball.velocity);

            // Add gravity
            ball.velocity.y += gravity;

            // Bounce off walls
            if (ball.position.x + ball.radius > p.width || ball.position.x - ball.radius < 0) {
              ball.velocity.x *= -0.8;
              ball.position.x = p.constrain(ball.position.x, ball.radius, p.width - ball.radius);
            }

            // Bounce off floor
            if (ball.position.y + ball.radius > p.height) {
              ball.velocity.y *= -0.7;
              ball.position.y = p.height - ball.radius;
              ball.velocity.x *= 0.95; // Add friction
            }

            // Ball collision detection
            for (let j = i + 1; j < balls.length; j++) {
              const other = balls[j];
              const dx = other.position.x - ball.position.x;
              const dy = other.position.y - ball.position.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < ball.radius + other.radius) {
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);
                
                // Rotate velocities
                let vx1 = ball.velocity.x * cos + ball.velocity.y * sin;
                const vy1 = ball.velocity.y * cos - ball.velocity.x * sin;
                let vx2 = other.velocity.x * cos + other.velocity.y * sin;
                const vy2 = other.velocity.y * cos - other.velocity.x * sin;
                
                // Collision reaction
                const vxTotal = vx1 - vx2;
                vx1 = ((ball.radius - other.radius) * vx1 + 2 * other.radius * vx2) / 
                      (ball.radius + other.radius);
                vx2 = vxTotal + vx1;
                
                // Update positions to prevent overlap
                const overlap = ball.radius + other.radius - distance;
                if (overlap > 0) {
                  const moveX = (overlap / 2) * Math.cos(angle);
                  const moveY = (overlap / 2) * Math.sin(angle);
                  
                  ball.position.x -= moveX;
                  ball.position.y -= moveY;
                  other.position.x += moveX;
                  other.position.y += moveY;
                }
                
                // Update velocities
                ball.velocity.x = vx1 * cos - vy1 * sin;
                ball.velocity.y = vy1 * cos + vx1 * sin;
                other.velocity.x = vx2 * cos - vy2 * sin;
                other.velocity.y = vy2 * cos + vx2 * sin;
              }
            }

            // Draw ball
            p.push();
            p.fill(ball.color);
            p.stroke(255, 255, 255, 80);
            p.strokeWeight(2);
            p.circle(ball.position.x, ball.position.y, ball.radius * 2);
            
            // Draw text
            p.fill(255);
            p.noStroke();
            p.textSize(ball.radius * 0.8);
            p.text(ball.text, ball.position.x, ball.position.y);
            p.pop();
          });
        };

        p.windowResized = () => {
          p.resizeCanvas(p.windowWidth, p.windowHeight);
        };
      };

      p5InstanceRef.current = new P5(sketch, containerRef.current);
    });

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900">
      {/* p5.js Canvas container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 pointer-events-none">
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
