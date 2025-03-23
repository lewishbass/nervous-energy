import React, { useEffect, useRef, useState } from 'react';

interface CircleAnimationProps {
  radiusRange?: [number, max: number]; // Min and max radius for circles
  className?: string; // Additional class names
  style?: React.CSSProperties; // Additional styles
  seed?: number; // Seed for random generation
  strokeWidth?: number;
}

interface Circle {
  x: number;
  y: number;
  radius: number;
  color: string;
  animationDuration: number;
  animationDelay: number;
  opacity: number;
}

const CircleAnimation: React.FC<CircleAnimationProps> = ({
  radiusRange = [10, 140],
  className = '',
  style = {},
  seed = 42,
  strokeWidth = 8,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [circles, setCircles] = useState<Circle[]>([]);
  const throttleTimeout = useRef<NodeJS.Timeout | null>(null);

  // Pseudo-random number generator with seed
  const seededRandom = (min: number, max: number, seedValue: number) => {
    const s = Math.sin(seedValue) * 10000;
    return min + (Math.abs(s) % 1) * (max - min);
  };

  // Generate non-overlapping circles
  const generateCircles = () => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const [minRadius, maxRadius] = radiusRange;
    const maxAttempts = 50000;
    const maxCircles = 5000; // Limit the number of circles for performance
    const newCircles: Circle[] = [];
    // load existing circles that are in the container

    let attempt = 0;
    let seedOffset = 0;
    circles.forEach(circle => {
      if (circle.x + circle.radius >= 0 && circle.x - circle.radius <= width && circle.y + circle.radius >= 0 && circle.y - circle.radius <= height) newCircles.push(circle);
      attempt += maxAttempts / maxCircles
      seedOffset += 10;
    });


    // Try to place circles until we've either filled the space or reached max attempts
    while (attempt < maxAttempts && newCircles.length < maxCircles) {
      seedOffset += 10;
      attempt++;
      let x = seededRandom(0, width, seed + seedOffset + 1);
      let y = seededRandom(0, height, seed + seedOffset + 2);

      // check if point is inside any existing circle
      // find the two closest circle edges
      let closestCircle = null;
      let secondClosestCircle = null;
      let closestDistance = Infinity;
      let secondClosestDistance = Infinity;
      for (const circle of newCircles) {
        const distance = Math.hypot(circle.x - x, circle.y - y) - circle.radius;
        if (distance < radiusRange[0]) {
          closestDistance = -1;
          break;
        }
        if (distance < closestDistance) {
          secondClosestCircle = closestCircle;
          secondClosestDistance = closestDistance;
          closestCircle = circle;
          closestDistance = distance;
        } else if (distance < secondClosestDistance) {
          secondClosestCircle = circle;
          secondClosestDistance = distance;
        }
      }

      let radius = closestDistance;

      if (closestDistance < radiusRange[0]) continue;
      else if (closestDistance > radiusRange[1]) radius = seededRandom(minRadius, maxRadius, seed + seedOffset + 3);
      if (secondClosestDistance > radiusRange[1]) radius = radius;
      else if(closestCircle && secondClosestCircle){ 
        //move circle so its touching closest and second closest
        let x1 = closestCircle.x, y1 = closestCircle.y, r1 = closestCircle.radius;
        let x2 = secondClosestCircle.x, y2 = secondClosestCircle.y, r2 = secondClosestCircle.radius;
        let r = radius;
        // Equations of circles:
        // (x - x1)^2 + (y - y1)^2 = (r + r1)^2  (1)
        // (x - x2)^2 + (y - y2)^2 = (r + r2)^2  (2)
        // Subtract (2) from (1):
        // (x - x1)^2 - (x - x2)^2 + (y - y1)^2 - (y - y2)^2 = (r^2 + 2rr1 + r1^2) - (r^2 + 2rr2 + r2^2)
        // (x^2 - 2xx1 + x1^2) - (x^2 - 2xx2 + x2^2) + (y^2 - 2yy1 + y1^2) - (y^2 - 2yy2 + y2^2) = (r^2 + 2rr1 + r1^2) - (r^2 + 2rr2 + r2^2)
        // -2xx1 + x1^2 + 2xx2 - x2^2 - 2yy1 + y1^2 + 2yy2 - y2^2 = 2rr1 + r1^2 - 2rr2 - r2^2
        // 2x(x2 - x1) + 2y(y2 - y1) = 2r(r1 - r2) + (r1^2 - r2^2) - (x1^2 - x2^2) - (y1^2 - y2^2)
        // x(x2 - x1) + y(y2 - y1) = r(r1 - r2) + 0.5 * ((r1^2 - r2^2) - (x1^2 - x2^2) - (y1^2 - y2^2))
        // Let A = (x2 - x1), B = (y2 - y1), C = r(r1 - r2) + 0.5 * ((r1^2 - r2^2) - (x1^2 - x2^2) - (y1^2 - y2^2))
        // Ax + By = C => x = (C - By) / A

        // Substitute x in (1):
        // ((C - By) / A - x1)^2 + (y - y1)^2 = (r + r1)^2
        // ((C - By - Ax1) / A)^2 + (y - y1)^2 = (r + r1)^2
        // (C - By - Ax1)^2 / A^2 + (y - y1)^2 = (r + r1)^2
        // (C - By - Ax1)^2 + A^2(y - y1)^2 = A^2(r + r1)^2
        // (C - Ax1 - By)^2 + A^2(y^2 - 2yy1 + y1^2) = A^2(r + r1)^2
        // (C - Ax1)^2 - 2(C - Ax1)By + B^2y^2 + A^2y^2 - 2A^2yy1 + A^2y1^2 = A^2(r + r1)^2
        // (B^2 + A^2)y^2 - 2((C - Ax1)B + A^2y1)y + (C - Ax1)^2 + A^2y1^2 - A^2(r + r1)^2 = 0
        // Let E = (B^2 + A^2), F = -2((C - Ax1)B + A^2y1), G = (C - Ax1)^2 + A^2y1^2 - A^2(r + r1)^2
        // Ey^2 + Fy + G = 0
        // y = (-F +- sqrt(F^2 - 4EG)) / 2E

        const A = x2 - x1;
        const B = y2 - y1;
        const C = r * (r1 - r2) + 0.5 * ((r1 * r1 - r2 * r2) - (x1 * x1 - x2 * x2) - (y1 * y1 - y2 * y2));
        const E = B * B + A * A;
        const F = -2 * ((C - A * x1) * B + A * A * y1);
        const G = (C - A * x1) * (C - A * x1) + A * A * y1 * y1 - A * A * (r + r1) * (r + r1);

        const discriminant = F * F - 4 * E * G;

        if (discriminant >= 0) {
          const y_plus = (-F + Math.sqrt(discriminant)) / (2 * E);
          const y_minus = (-F - Math.sqrt(discriminant)) / (2 * E);

          const x_plus = (C - B * y_plus) / A;
          const x_minus = (C - B * y_minus) / A;

          // Pick a solution that does not intersect with existing circles or lie outside range
          let intersect1 = false;
          let intersect2 = false;
          for (const circle of newCircles) {
            if (Math.hypot(circle.x - x_minus, circle.y - y_minus) < circle.radius + radius) intersect1 = true;
            if (Math.hypot(circle.x - x_plus, circle.y - y_plus) < circle.radius + radius) intersect2 = true;
            if(intersect1 && intersect2) break;
          }
          if(!intersect1 && y_minus >= 0 && y_minus <= height && x_minus >= 0 && x_minus <= width) {
            x = x_minus;
            y = y_minus;
          }
          else if (!intersect2 && y_plus >= 0 && y_plus <= height && x_plus >= 0 && x_plus <= width) {
            x = x_plus;
            y = y_plus;
          }
          else continue; // Skip this circle if no real solution exists

          //color = "#0F0"
        } else {
          continue; // Skip this circle if no real solution exists
        }
        //check if new circle is intersecting with any existing circle
        
            
      }

      let color = `rgba(255, 255, 255, ${seededRandom(0.5, 1, seed + seedOffset + 8)*((radius/radiusRange[1])**0.65)})`;

      // Create a new circle with animation properties
      newCircles.push({
        x,
        y,
        radius: radius - strokeWidth,
        color,
        animationDuration: seededRandom(2, 3, seed + seedOffset + 6),
        animationDelay: seededRandom(0, 1, seed + seedOffset + 7),
        opacity: seededRandom(0.1, 0.3, seed + seedOffset + 8),
      });


    }
    setCircles(newCircles);
  };

  // Handle window resize and initial generation
  useEffect(() => {

    generateCircles();
  }, [radiusRange, seed]);

  useEffect(() => {
    // No need to redeclare useRef here
    
    const handleResize = () => {
      clearTimeout(throttleTimeout.current!);
      throttleTimeout.current = setTimeout(() => {
        generateCircles();
      }
      , 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (throttleTimeout.current) clearTimeout(throttleTimeout.current);
    };
  }, [radiusRange, seed, circles]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={style}
    >
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0"
        preserveAspectRatio="none"
        //style={{animation: `fade-in 5s ease 0.2s forwards`}}
      >
        <defs>
          <style>
            {`
          @keyframes dash {
            to {
          stroke-dashoffset: 0;
            }
          }
        `}
          </style>
        </defs>
        {circles.map((circle, index) => (
          <circle
            key={index}
            cx={circle.x}
            cy={circle.y}
            r={circle.radius}
            fill={'none'}
            opacity={0}
            stroke={circle.color}
            strokeWidth={strokeWidth}
            //strokeDasharray={`${1 / 32 * Math.PI * circle.radius} ${3 / 32 * Math.PI * circle.radius}`}
            //strokeDashoffset={`${4 * Math.PI * circle.radius}`}
            
            style={{
              animation: `fade-in ${5 + 30 / circle.radius ** 0.5}s ease 0.2s forwards`,
              animationDelay: `${30 / circle.radius**0.5}s`,
              strokeLinejoin: "round",
              strokeLinecap: "round"

        }}
          />
        ))}
      </svg>
    </div>
  );
};

export default CircleAnimation;
