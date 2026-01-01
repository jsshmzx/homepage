'use client';

import { useEffect, useRef } from 'react';
import type p5 from 'p5';

// Extended p5 interface to include touch event handlers
interface P5WithTouchEvents extends p5 {
  touchStarted?: () => boolean | void;
  touchMoved?: () => boolean | void;
  touchEnded?: () => boolean | void;
}

interface Ball {
  position: p5.Vector;
  velocity: p5.Vector;
  radius: number;
  text: string;
  color: string;
  isDragging?: boolean;
  dragOffset?: p5.Vector;
  previousPosition?: p5.Vector;
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
        const baseGravity = 0.1;
        let gravityX = 0;
        let gravityY = baseGravity;
        const collisionDamping = 0.3;
        const throwVelocityMultiplier = 1.5;
        let draggedBall: Ball | null = null;

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
              text: textChars[p.floor(p.random(textChars.length))],
              color: colors[p.floor(p.random(colors.length))],
              isDragging: false,
            });
          }

          // Request device motion permission for iOS 13+
          // Type assertion for iOS-specific DeviceMotionEvent
          interface DeviceMotionEventWithPermission {
            requestPermission?: () => Promise<'granted' | 'denied'>;
          }
          
          if (typeof (DeviceMotionEvent as unknown as DeviceMotionEventWithPermission)?.requestPermission === 'function') {
            // iOS 13+ requires permission
            ((DeviceMotionEvent as unknown as DeviceMotionEventWithPermission).requestPermission as () => Promise<'granted' | 'denied'>)()
              .then((response: 'granted' | 'denied') => {
                if (response === 'granted') {
                  setupDeviceMotion();
                }
              })
              .catch(console.error);
          } else if (window.DeviceMotionEvent) {
            // Non-iOS devices or older iOS versions
            setupDeviceMotion();
          }
        };

        // Setup device motion event listener
        const setupDeviceMotion = () => {
          window.addEventListener('deviceorientation', (event) => {
            if (event.beta !== null && event.gamma !== null) {
              // beta: tilt front-to-back (-180 to 180)
              // gamma: tilt left-to-right (-90 to 90)
              
              // Convert orientation to gravity
              // Scale the values appropriately
              gravityX = (event.gamma / 90) * baseGravity * 10; // Left-right tilt
              gravityY = (event.beta / 90) * baseGravity * 10;  // Front-back tilt
              
              // Clamp gravity values to reasonable range
              gravityX = p.constrain(gravityX, -baseGravity * 15, baseGravity * 15);
              gravityY = p.constrain(gravityY, -baseGravity * 15, baseGravity * 15);
            }
          });
        };

        // Mouse/Touch press handler
        p.mousePressed = () => {
          const mousePos = p.createVector(p.mouseX, p.mouseY);
          
          // Check if clicking on a ball (check in reverse order so top balls are selected first)
          for (let i = balls.length - 1; i >= 0; i--) {
            const ball = balls[i];
            const distance = p.dist(mousePos.x, mousePos.y, ball.position.x, ball.position.y);
            
            if (distance < ball.radius) {
              draggedBall = ball;
              ball.isDragging = true;
              ball.dragOffset = p.createVector(
                ball.position.x - mousePos.x,
                ball.position.y - mousePos.y
              );
              ball.previousPosition = ball.position.copy();
              ball.velocity.set(0, 0);
              return false; // Prevent default behavior when interacting with ball
            }
          }
          // Don't prevent default if not clicking on a ball
        };

        // Mouse/Touch drag handler
        p.mouseDragged = () => {
          if (draggedBall) {
            const mousePos = p.createVector(p.mouseX, p.mouseY);
            draggedBall.previousPosition = draggedBall.position.copy();
            if (draggedBall.dragOffset) {
              draggedBall.position.x = mousePos.x + draggedBall.dragOffset.x;
              draggedBall.position.y = mousePos.y + draggedBall.dragOffset.y;
            }
            return false; // Prevent default behavior when dragging
          }
          // Don't prevent default if not dragging
        };

        // Mouse/Touch release handler
        p.mouseReleased = () => {
          if (draggedBall) {
            // Calculate velocity based on drag movement
            if (draggedBall.previousPosition) {
              draggedBall.velocity.x = (draggedBall.position.x - draggedBall.previousPosition.x) * throwVelocityMultiplier;
              draggedBall.velocity.y = (draggedBall.position.y - draggedBall.previousPosition.y) * throwVelocityMultiplier;
            }
            draggedBall.isDragging = false;
            draggedBall = null;
            return false; // Prevent default behavior when releasing dragged ball
          }
          // Don't prevent default if not releasing a dragged ball
        };

        // Touch handlers for mobile support
        const p5WithTouch = p as P5WithTouchEvents;
        p5WithTouch.touchStarted = p.mousePressed;
        p5WithTouch.touchMoved = p.mouseDragged;
        p5WithTouch.touchEnded = p.mouseReleased;

        p.draw = () => {
          p.clear();

          balls.forEach((ball, i) => {
            // Skip physics updates for dragged balls
            if (!ball.isDragging) {
              // Update position
              ball.position.add(ball.velocity);

              // Add gravity (use device orientation if available)
              ball.velocity.x += gravityX;
              ball.velocity.y += gravityY;

              // Bounce off walls (left and right)
              if (ball.position.x + ball.radius > p.width || ball.position.x - ball.radius < 0) {
                ball.velocity.x *= -0.8;
                ball.position.x = p.constrain(ball.position.x, ball.radius, p.width - ball.radius);
              }

              // Bounce off floor and ceiling
              if (ball.position.y + ball.radius > p.height || ball.position.y - ball.radius < 0) {
                ball.velocity.y *= -0.7;
                ball.position.y = p.constrain(ball.position.y, ball.radius, p.height - ball.radius);
                
                // Add friction when hitting horizontal surfaces
                if (ball.position.y + ball.radius > p.height || ball.position.y - ball.radius < 0) {
                  ball.velocity.x *= 0.95;
                }
              }
            }

            // Ball collision detection - only if not dragging
            if (!ball.isDragging) {
              for (let j = i + 1; j < balls.length; j++) {
                const other = balls[j];
                // Skip collision if other ball is being dragged
                if (other.isDragging) continue;
                
                const dx = other.position.x - ball.position.x;
                const dy = other.position.y - ball.position.y;
                const distance = p.dist(ball.position.x, ball.position.y, other.position.x, other.position.y);
                
                if (distance < ball.radius + other.radius) {
                  const angle = p.atan2(dy, dx);
                  const sin = p.sin(angle);
                  const cos = p.cos(angle);
                  
                  // Rotate velocities
                  let vx1 = ball.velocity.x * cos + ball.velocity.y * sin;
                  const vy1 = ball.velocity.y * cos - ball.velocity.x * sin;
                  let vx2 = other.velocity.x * cos + other.velocity.y * sin;
                  const vy2 = other.velocity.y * cos - other.velocity.x * sin;
                  
                  // Collision reaction with reduced force
                  const vxTotal = vx1 - vx2;
                  vx1 = ((ball.radius - other.radius) * vx1 + 2 * other.radius * vx2) / 
                        (ball.radius + other.radius);
                  vx2 = vxTotal + vx1;
                  
                  // Apply damping to reduce collision force
                  vx1 *= collisionDamping;
                  vx2 *= collisionDamping;
                  
                  // Update positions to prevent overlap
                  const overlap = ball.radius + other.radius - distance;
                  if (overlap > 0) {
                    const moveX = (overlap / 2) * p.cos(angle);
                    const moveY = (overlap / 2) * p.sin(angle);
                    
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
            }

            // Draw ball
            p.push();
            p.fill(ball.color);
            // Highlight dragged ball with stronger stroke
            if (ball.isDragging) {
              p.stroke(255, 255, 255, 200);
              p.strokeWeight(4);
            } else {
              p.stroke(255, 255, 255, 80);
              p.strokeWeight(2);
            }
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
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900">
      {/* p5.js Canvas container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Hero Section */}
      <section className="relative z-10 h-full flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center pointer-events-none">
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
