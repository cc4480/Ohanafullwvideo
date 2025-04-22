import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface BackgroundAnimationProps {
  /**
   * Intensity of the animation (0-1)
   */
  intensity?: number;
  
  /**
   * Color theme for the animations
   */
  colorTheme?: 'blue' | 'teal' | 'purple' | 'default';
  
  /**
   * Whether to include light beams
   */
  includeBeams?: boolean;
}

/**
 * Professional subtle background animation using GSAP
 * Creates elegant pulsating light effects that enhance the UI without distracting users
 */
export default function BackgroundAnimation({ 
  intensity = 0.5, 
  colorTheme = 'default',
  includeBeams = true
}: BackgroundAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const beam1Ref = useRef<HTMLDivElement>(null);
  const beam2Ref = useRef<HTMLDivElement>(null);
  
  // Scale intensity to reasonable animation values
  const scaledIntensity = Math.max(0.2, Math.min(1, intensity));
  
  // Define colors based on theme
  const getColors = () => {
    switch (colorTheme) {
      case 'blue':
        return {
          primary: 'rgba(37, 99, 235, 0.1)',
          secondary: 'rgba(59, 130, 246, 0.15)',
          tertiary: 'rgba(96, 165, 250, 0.08)'
        };
      case 'teal':
        return {
          primary: 'rgba(20, 184, 166, 0.1)',
          secondary: 'rgba(45, 212, 191, 0.15)',
          tertiary: 'rgba(94, 234, 212, 0.08)'
        };
      case 'purple':
        return {
          primary: 'rgba(147, 51, 234, 0.1)',
          secondary: 'rgba(168, 85, 247, 0.15)',
          tertiary: 'rgba(192, 132, 252, 0.08)'
        };
      default:
        return {
          primary: 'rgba(99, 102, 241, 0.1)',
          secondary: 'rgba(79, 70, 229, 0.15)',
          tertiary: 'rgba(129, 140, 248, 0.08)'
        };
    }
  };
  
  const colors = getColors();
  
  // Initialize animations
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create animation timeline for orbs
    const orbsTimeline = gsap.timeline({
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    // Animate first orb - gentle pulsing
    if (orb1Ref.current) {
      orbsTimeline.to(orb1Ref.current, {
        opacity: 0.7 * scaledIntensity,
        scale: 1.1,
        duration: 3 + (1 - scaledIntensity) * 2,
        ease: "sine.inOut"
      }, 0);
    }
    
    // Animate second orb - offset timing
    if (orb2Ref.current) {
      orbsTimeline.to(orb2Ref.current, {
        opacity: 0.65 * scaledIntensity,
        scale: 1.15,
        duration: 4 + (1 - scaledIntensity) * 2,
        ease: "sine.inOut"
      }, 0.5);
    }
    
    // Animate third orb - different size modulation
    if (orb3Ref.current) {
      orbsTimeline.to(orb3Ref.current, {
        opacity: 0.75 * scaledIntensity,
        scale: 1.08,
        duration: 3.5 + (1 - scaledIntensity) * 2,
        ease: "sine.inOut"
      }, 1);
    }
    
    // Animate light beams if enabled
    if (includeBeams) {
      const beamsTimeline = gsap.timeline({
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      if (beam1Ref.current) {
        beamsTimeline.to(beam1Ref.current, {
          opacity: 0.5 * scaledIntensity,
          width: "120%",
          duration: 5 + (1 - scaledIntensity) * 3,
          ease: "sine.inOut"
        }, 0);
      }
      
      if (beam2Ref.current) {
        beamsTimeline.to(beam2Ref.current, {
          opacity: 0.4 * scaledIntensity,
          height: "140%",
          duration: 6 + (1 - scaledIntensity) * 3,
          ease: "sine.inOut"
        }, 1);
      }
    }
    
    // Cleanup on unmount
    return () => {
      gsap.killTweensOf([orb1Ref.current, orb2Ref.current, orb3Ref.current, beam1Ref.current, beam2Ref.current]);
    };
  }, [scaledIntensity, includeBeams]);
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-[-1]"
      aria-hidden="true"
    >
      {/* Glowing orbs */}
      <div 
        ref={orb1Ref}
        className="absolute rounded-full blur-3xl will-change-transform transform-gpu"
        style={{
          background: colors.primary,
          width: '45vw',
          height: '45vw',
          left: '10%',
          top: '20%',
          opacity: 0.3,
          filter: 'blur(80px)',
          transform: 'translateZ(0)'
        }}
      />
      <div 
        ref={orb2Ref}
        className="absolute rounded-full blur-3xl will-change-transform transform-gpu"
        style={{
          background: colors.secondary,
          width: '40vw',
          height: '40vw',
          right: '5%',
          bottom: '15%',
          opacity: 0.3,
          filter: 'blur(100px)',
          transform: 'translateZ(0)'
        }}
      />
      <div 
        ref={orb3Ref}
        className="absolute rounded-full blur-3xl will-change-transform transform-gpu"
        style={{
          background: colors.tertiary,
          width: '35vw',
          height: '35vw',
          right: '30%',
          top: '15%',
          opacity: 0.25,
          filter: 'blur(90px)',
          transform: 'translateZ(0)'
        }}
      />
      
      {/* Light beams */}
      {includeBeams && (
        <>
          <div 
            ref={beam1Ref}
            className="absolute will-change-transform transform-gpu"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${colors.primary} 50%, transparent 100%)`,
              width: '100%',
              height: '10vh',
              left: '0',
              top: '30%',
              opacity: 0.15,
              filter: 'blur(40px)',
              transform: 'translateZ(0) rotate(-5deg)'
            }}
          />
          <div 
            ref={beam2Ref}
            className="absolute will-change-transform transform-gpu"
            style={{
              background: `linear-gradient(180deg, transparent 0%, ${colors.secondary} 50%, transparent 100%)`,
              width: '10vw',
              height: '100%',
              right: '25%',
              top: '0',
              opacity: 0.1,
              filter: 'blur(40px)',
              transform: 'translateZ(0) rotate(5deg)'
            }}
          />
        </>
      )}
    </div>
  );
}