import React, { useRef, useEffect } from 'react';
import { Particle } from '../types';

const Fireworks: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireworks = useRef<Particle[]>([]);
  const particles = useRef<Particle[]>([]);
  
  // Vibrant, festive color palette inspired by Indian celebrations
  const indianHues = [0, 20, 30, 45, 180, 200, 300, 330]; 
  const hue = useRef(indianHues[0]);

  const timerTick = useRef(0);
  const timerTotal = useRef(20); // Launch fireworks more frequently
  const isMouseDown = useRef(false);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasDimensions();
    
    window.addEventListener('resize', setCanvasDimensions);

    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    const calculateDistance = (p1x: number, p1y: number, p2x: number, p2y: number) => {
      const xDistance = p1x - p2x;
      const yDistance = p1y - p2y;
      return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    };

    const createFirework = (sx: number, sy: number, tx: number, ty: number): Particle => {
      const firework: Partial<Particle> = {};
      firework.x = sx;
      firework.y = sy;
      firework.sx = sx;
      firework.sy = sy;
      firework.tx = tx;
      firework.ty = ty;
      firework.distanceToTarget = calculateDistance(sx, sy, tx, ty);
      firework.distanceTraveled = 0;
      firework.coordinates = [];
      firework.coordinateCount = 3;
      while (firework.coordinateCount--) {
        firework.coordinates.push({ x: firework.x, y: firework.y });
      }
      firework.angle = Math.atan2(ty - sy, tx - sx);
      firework.speed = 2;
      firework.acceleration = 1.05;
      firework.brightness = random(50, 70);
      firework.targetRadius = 1;
      // Assign a random hue from our festive palette
      firework.hue = indianHues[Math.floor(random(0, indianHues.length))];
      return firework as Particle;
    };

    const createParticles = (x: number, y: number, particleHue: number) => {
      const particleCount = 40; // More particles for a bigger burst
      for (let i = 0; i < particleCount; i++) {
        const particle: Partial<Particle> = {};
        particle.x = x;
        particle.y = y;
        particle.coordinates = [];
        particle.coordinateCount = 5;
        while (particle.coordinateCount--) {
          particle.coordinates.push({ x: particle.x, y: particle.y });
        }
        particle.angle = random(0, Math.PI * 2);
        particle.speed = random(1, 12);
        particle.acceleration = 0.95; // friction
        particle.brightness = random(50, 80);
        particle.hue = particleHue;
        particles.current.push(particle as Particle);
      }
    };
    
    const createGlitter = (x: number, y: number, glitterHue: number) => {
      const glitterCount = 15;
      for (let i = 0; i < glitterCount; i++) {
        const particle: Partial<Particle> = {};
        particle.x = x;
        particle.y = y;
        particle.coordinates = [];
        particle.coordinateCount = 1; // Glitter doesn't have a trail
        particle.angle = random(0, Math.PI * 2);
        particle.speed = random(1, 4);
        particle.acceleration = 0.97; // Fades a bit slower
        particle.brightness = random(80, 100); // Very bright
        particle.hue = glitterHue;
        particle.type = 'glitter';
        particles.current.push(particle as Particle);
      }
    };

    const drawFirework = (firework: Particle) => {
      ctx.beginPath();
      ctx.moveTo(
        firework.coordinates[firework.coordinates.length - 1].x,
        firework.coordinates[firework.coordinates.length - 1].y
      );
      ctx.lineTo(firework.x, firework.y);
      ctx.strokeStyle = `hsl(${firework.hue}, 100%, ${firework.brightness}%)`;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(firework.tx, firework.ty, firework.targetRadius, 0, Math.PI * 2);
      ctx.stroke();
    };

    const drawParticle = (particle: Particle) => {
        ctx.beginPath();
        // Draw trail for regular particles
        if (particle.coordinateCount > 1) {
            ctx.moveTo(
                particle.coordinates[particle.coordinates.length - 1].x,
                particle.coordinates[particle.coordinates.length - 1].y
            );
            ctx.lineTo(particle.x, particle.y);
            ctx.strokeStyle = `hsla(${particle.hue}, 100%, ${particle.brightness}%, ${particle.brightness / 100})`;
            ctx.stroke();
        }
        
        // Draw a bright head for all particles, makes glitter visible
        ctx.beginPath();
        const headSize = particle.type === 'glitter' ? 1.5 : 2;
        ctx.arc(particle.x, particle.y, headSize, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${particle.hue}, 100%, ${particle.brightness}%)`;
        ctx.fill();
    };


    const updateFirework = (index: number) => {
      const firework = fireworks.current[index];
      firework.coordinates.pop();
      firework.coordinates.unshift({ x: firework.x, y: firework.y });
      
      if (firework.targetRadius < 8) {
        firework.targetRadius += 0.3;
      } else {
        firework.targetRadius = 1;
      }

      firework.speed *= firework.acceleration;

      const vx = Math.cos(firework.angle) * firework.speed;
      const vy = Math.sin(firework.angle) * firework.speed;
      firework.distanceTraveled = calculateDistance(firework.sx, firework.sy, firework.x + vx, firework.y + vy);

      if (firework.distanceTraveled >= firework.distanceToTarget) {
        // Create main burst
        createParticles(firework.tx, firework.ty, firework.hue);
        // Create shimmering glitter after-effect
        setTimeout(() => createGlitter(firework.tx, firework.ty, firework.hue), 200);
        
        fireworks.current.splice(index, 1);
      } else {
        firework.x += vx;
        firework.y += vy;
      }
    };

    const updateParticle = (index: number) => {
      const particle = particles.current[index];
      particle.coordinates.pop();
      particle.coordinates.unshift({ x: particle.x, y: particle.y });
      particle.speed *= particle.acceleration;
      particle.x += Math.cos(particle.angle) * particle.speed;
      particle.y += Math.sin(particle.angle) * particle.speed;
      particle.brightness -= 0.5; // Fade faster

      if (particle.brightness < 1) {
        particles.current.splice(index, 1);
      }
    };

    const loop = () => {
      animationFrameId = requestAnimationFrame(loop);
      hue.current = indianHues[Math.floor(random(0, indianHues.length))];

      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'; // Slightly less fade for brighter trails
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      let i = fireworks.current.length;
      while (i--) {
        drawFirework(fireworks.current[i]);
        updateFirework(i);
      }

      let j = particles.current.length;
      while (j--) {
        drawParticle(particles.current[j]);
        updateParticle(j);
      }

      if (timerTick.current >= timerTotal.current) {
        if (!isMouseDown.current) {
          fireworks.current.push(createFirework(
            canvas.width / 2,
            canvas.height,
            random(0, canvas.width),
            random(0, canvas.height / 2)
          ));
          timerTick.current = 0;
        }
      } else {
        timerTick.current++;
      }
    };
    
    const handleMouseDown = (e: MouseEvent) => {
        isMouseDown.current = true;
        mouse.current.x = e.pageX;
        mouse.current.y = e.pageY;
        fireworks.current.push(createFirework(
            canvas.width / 2,
            canvas.height,
            mouse.current.x,
            mouse.current.y
        ));
    };

    const handleMouseUp = () => {
        isMouseDown.current = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    
    loop();

    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0"></canvas>;
};

export default Fireworks;
