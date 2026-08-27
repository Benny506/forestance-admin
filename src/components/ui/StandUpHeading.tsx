import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StandUpHeadingProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
}

export const StandUpHeading: React.FC<StandUpHeadingProps> = ({ 
  children, 
  className = "", 
  style = {},
  as: Component = "div" 
}) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (containerRef.current) {
        gsap.fromTo(
          '.stand-word',
          {
            rotateX: -90,
            opacity: 0,
          },
          {
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
            rotateX: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out'
          }
        );
      }
    }, containerRef); // Scope the animation to this component

    return () => ctx.revert();
  }, []);

  return (
    <Component ref={containerRef} className={className} style={{ perspective: '1000px', ...style }}>
      {children}
    </Component>
  );
};
