export interface Particle {
  x: number;
  y: number;
  sx: number; // start x
  sy: number; // start y
  tx: number; // target x
  ty: number; // target y
  distanceToTarget: number;
  distanceTraveled: number;
  coordinates: { x: number; y: number }[];
  coordinateCount: number;
  angle: number;
  speed: number;
  acceleration: number;
  brightness: number;
  targetRadius: number;
  hue: number;
  type?: 'glitter';
}
