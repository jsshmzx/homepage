'use client';

import { useEffect, useRef } from 'react';
import type p5 from 'p5';

interface Particle {
  position: p5.Vector;
  velocity: p5.Vector;
  acceleration: p5.Vector;
  lifespan: number;
  hue: number;
  size: number;
}

export default function P5Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    // Dynamically import p5 only on client side
    import('p5').then((p5Module) => {
      const P5 = p5Module.default;
      
      if (!containerRef.current) return;

      const sketch = (p: p5) => {
        const particles: Particle[] = [];
        const maxParticles = 200;
        let time = 0;

        p.setup = () => {
          p.createCanvas(p.windowWidth, p.windowHeight);
          p.colorMode(p.HSB, 360, 100, 100, 100);
          p.noStroke();
        };

        p.draw = () => {
          // Create a fading trail effect
          p.background(0, 0, 0, 10);
          time += 0.01;

          // Add new particles near mouse
          if (p.mouseIsPressed || particles.length < 50) {
            const x = p.mouseIsPressed ? p.mouseX : p.width / 2;
            const y = p.mouseIsPressed ? p.mouseY : p.height / 2;
            
            for (let i = 0; i < 3; i++) {
              if (particles.length < maxParticles) {
                const angle = p.random(p.TWO_PI);
                const speed = p.random(1, 5);
                const hue = (p.frameCount * 2 + p.random(-20, 20)) % 360;
                
                particles.push({
                  position: p.createVector(x, y),
                  velocity: p.createVector(
                    p.cos(angle) * speed,
                    p.sin(angle) * speed
                  ),
                  acceleration: p.createVector(0, 0),
                  lifespan: 100,
                  hue: hue,
                  size: p.random(5, 15),
                });
              }
            }
          }

          // Update and draw particles
          for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            
            // Apply attraction to mouse
            if (p.mouseIsPressed) {
              const mouse = p.createVector(p.mouseX, p.mouseY);
              const force = p.createVector(
                mouse.x - particle.position.x,
                mouse.y - particle.position.y
              );
              const distance = force.mag();
              
              if (distance > 0 && distance < 200) {
                force.normalize();
                force.mult(0.1);
                particle.acceleration.add(force);
              }
            }

            // Add some noise-based movement
            const noiseX = p.noise(particle.position.x * 0.01, particle.position.y * 0.01, time) - 0.5;
            const noiseY = p.noise(particle.position.x * 0.01 + 100, particle.position.y * 0.01, time) - 0.5;
            particle.acceleration.add(p.createVector(noiseX * 0.5, noiseY * 0.5));

            // Update physics
            particle.velocity.add(particle.acceleration);
            particle.velocity.limit(8);
            particle.position.add(particle.velocity);
            particle.acceleration.mult(0);
            particle.lifespan -= 1;

            // Wrap around edges
            if (particle.position.x < 0) particle.position.x = p.width;
            if (particle.position.x > p.width) particle.position.x = 0;
            if (particle.position.y < 0) particle.position.y = p.height;
            if (particle.position.y > p.height) particle.position.y = 0;

            // Draw particle
            const alpha = p.map(particle.lifespan, 0, 100, 0, 100);
            p.fill(particle.hue, 80, 100, alpha);
            p.circle(particle.position.x, particle.position.y, particle.size);

            // Draw glow effect
            p.fill(particle.hue, 60, 100, alpha * 0.3);
            p.circle(particle.position.x, particle.position.y, particle.size * 1.5);

            // Remove dead particles
            if (particle.lifespan <= 0) {
              particles.splice(i, 1);
            }
          }

          // Draw connecting lines between nearby particles (optimized with squared distance)
          const maxConnectionDistance = 100;
          const maxConnectionDistanceSq = maxConnectionDistance * maxConnectionDistance;
          
          for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
              const dx = particles[j].position.x - particles[i].position.x;
              const dy = particles[j].position.y - particles[i].position.y;
              const distanceSq = dx * dx + dy * dy;
              
              if (distanceSq < maxConnectionDistanceSq) {
                const distance = Math.sqrt(distanceSq);
                const alpha = p.map(distance, 0, maxConnectionDistance, 30, 0);
                p.stroke(particles[i].hue, 60, 100, alpha);
                p.strokeWeight(1);
                p.line(
                  particles[i].position.x,
                  particles[i].position.y,
                  particles[j].position.x,
                  particles[j].position.y
                );
              }
            }
          }
          p.noStroke();

          // Draw info text
          p.fill(0, 0, 100, 80);
          p.textSize(16);
          p.textAlign(p.LEFT, p.TOP);
          p.text('Click and drag to create particles', 20, 20);
          p.text(`Particles: ${particles.length}`, 20, 45);
          p.text('Press any key to clear', 20, 70);
        };

        p.windowResized = () => {
          p.resizeCanvas(p.windowWidth, p.windowHeight);
        };

        p.keyPressed = () => {
          // Clear all particles when any key is pressed
          particles.length = 0;
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
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Overlay with title */}
      <div className="absolute top-0 left-0 right-0 p-8 text-center pointer-events-none">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          P5.js Creative Canvas
        </h1>
        <p className="text-xl text-white/80 drop-shadow-md">
          Interactive Generative Art
        </p>
      </div>
    </div>
  );
}
