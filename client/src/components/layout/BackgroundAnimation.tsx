import React, { useEffect, useRef, useState, useMemo } from 'react';
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
  
  /**
   * Whether to optimize for mobile devices automatically
   */
  mobileOptimized?: boolean;
}

/**
 * Professional subtle background animation using GSAP
 * Creates elegant pulsating light effects that enhance the UI without distracting users
 * Heavily optimized with hardware acceleration and mobile detection
 */
export default function BackgroundAnimation({ 
  intensity = 0.5, 
  colorTheme = 'default',
  includeBeams = true,
  mobileOptimized = true
}: BackgroundAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const beam1Ref = useRef<HTMLDivElement>(null);
  const beam2Ref = useRef<HTMLDivElement>(null);
  
  // Mobile detection for performance optimization
  const [isMobile, setIsMobile] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [hasHighPerformance, setHasHighPerformance] = useState(true);
  
  // Performance detection
  useEffect(() => {
    // Check for mobile device
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
        (window.innerWidth <= 768);
      setIsMobile(isMobileDevice);
    };
    
    // Check for reduced motion preference
    const checkReducedMotion = () => {
      setIsReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };
    
    // Attempt to detect performance capabilities using simple heuristics
    const checkPerformance = () => {
      // Use device memory API if available
      if ('deviceMemory' in navigator) {
        setHasHighPerformance((navigator as any).deviceMemory >= 4);
      } else {
        // Fallback: assume high-end if desktop, low-end if mobile
        setHasHighPerformance(!isMobile);
      }
    };
    
    checkMobile();
    checkReducedMotion();
    checkPerformance();
    
    // Setup resize listener
    const handleResize = () => {
      checkMobile();
      checkPerformance();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Listen for reduced motion preference changes
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionMediaQuery.addEventListener('change', checkReducedMotion);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      motionMediaQuery.removeEventListener('change', checkReducedMotion);
    };
  }, []);
  
  // Scale intensity based on device capabilities
  const effectiveIntensity = useMemo(() => {
    // Calculate effective intensity by scaling down based on performance criteria
    let result = Math.max(0.2, Math.min(1, intensity));
    
    // Reduce intensity on mobile devices
    if (isMobile && mobileOptimized) {
      result *= 0.7;
    }
    
    // Further reduce for low performance devices
    if (!hasHighPerformance && mobileOptimized) {
      result *= 0.6;
    }
    
    // Minimal animation for reduced motion preference
    if (isReducedMotion) {
      result *= 0.3;
    }
    
    return result;
  }, [intensity, isMobile, hasHighPerformance, isReducedMotion, mobileOptimized]);
  
  // Define colors based on theme
  const colors = useMemo(() => {
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
  }, [colorTheme]);
  
  // Initialize animations with performance optimization
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Skip complex animations altogether on low-perf mobile devices to improve FPS
    if (isMobile && !hasHighPerformance && mobileOptimized) {
      // Apply static positioning instead of animations for extreme low-end devices
      if (orb1Ref.current) gsap.set(orb1Ref.current, { opacity: 0.4 * effectiveIntensity });
      if (orb2Ref.current) gsap.set(orb2Ref.current, { opacity: 0.4 * effectiveIntensity });
      if (orb3Ref.current) gsap.set(orb3Ref.current, { opacity: 0.3 * effectiveIntensity });
      if (beam1Ref.current) gsap.set(beam1Ref.current, { opacity: 0.2 * effectiveIntensity });
      if (beam2Ref.current) gsap.set(beam2Ref.current, { opacity: 0.15 * effectiveIntensity });
      return;
    }
    
    // Create animation timeline for orbs with performance-based configuration
    const orbsTimeline = gsap.timeline({
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      paused: false,
      // Longer durations on lower performance devices = smoother rendering
      timeScale: hasHighPerformance ? 1 : 0.7
    });
    
    // Use requestAnimationFrame timing for better performance
    gsap.ticker.lagSmoothing(2000, 16); // More forgiving lag smoothing
    
    // Simplify animations on mobile
    const animationConfig = isMobile && mobileOptimized ? {
      opacity: { vary: 0.15, base: 0.4 },  // Less opacity variation
      scale: { max: 1.05 },                // Less scaling
      duration: { base: 4, vary: 1 }       // Longer, smoother animations
    } : {
      opacity: { vary: 0.3, base: 0.5 },   // Normal opacity variation
      scale: { max: 1.15 },                // Normal scaling
      duration: { base: 3, vary: 2 }       // Normal animation speed
    };
    
    // Animate first orb - gentle pulsing
    if (orb1Ref.current) {
      orbsTimeline.to(orb1Ref.current, {
        opacity: animationConfig.opacity.base * effectiveIntensity,
        scale: animationConfig.scale.max,
        duration: animationConfig.duration.base + (1 - effectiveIntensity) * animationConfig.duration.vary,
        ease: "sine.inOut",
        force3D: true // Force 3D transforms for hardware acceleration
      }, 0);
    }
    
    // Animate second orb - offset timing
    if (orb2Ref.current) {
      orbsTimeline.to(orb2Ref.current, {
        opacity: (animationConfig.opacity.base - 0.05) * effectiveIntensity,
        scale: animationConfig.scale.max,
        duration: animationConfig.duration.base + 1 + (1 - effectiveIntensity) * animationConfig.duration.vary,
        ease: "sine.inOut",
        force3D: true
      }, 0.5);
    }
    
    // Animate third orb - different size modulation
    if (orb3Ref.current) {
      orbsTimeline.to(orb3Ref.current, {
        opacity: (animationConfig.opacity.base + 0.05) * effectiveIntensity,
        scale: Math.max(1.04, animationConfig.scale.max - 0.07),
        duration: animationConfig.duration.base + 0.5 + (1 - effectiveIntensity) * animationConfig.duration.vary,
        ease: "sine.inOut",
        force3D: true
      }, 1);
    }
    
    // Animate light beams if enabled and not on low-performance mobile
    if (includeBeams && !(isMobile && !hasHighPerformance && mobileOptimized)) {
      const beamsTimeline = gsap.timeline({
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        timeScale: hasHighPerformance ? 1 : 0.7
      });
      
      // Use minimal animations for beams on mobile
      const beamConfig = isMobile && mobileOptimized ? {
        widthIncrease: "110%",
        heightIncrease: "120%",
        duration: { base: 6, vary: 2 }
      } : {
        widthIncrease: "120%",
        heightIncrease: "140%",
        duration: { base: 5, vary: 3 }
      };
      
      if (beam1Ref.current) {
        beamsTimeline.to(beam1Ref.current, {
          opacity: 0.3 * effectiveIntensity,
          width: beamConfig.widthIncrease,
          duration: beamConfig.duration.base + (1 - effectiveIntensity) * beamConfig.duration.vary,
          ease: "sine.inOut",
          force3D: true
        }, 0);
      }
      
      if (beam2Ref.current) {
        beamsTimeline.to(beam2Ref.current, {
          opacity: 0.25 * effectiveIntensity,
          height: beamConfig.heightIncrease,
          duration: beamConfig.duration.base + 1 + (1 - effectiveIntensity) * beamConfig.duration.vary,
          ease: "sine.inOut",
          force3D: true
        }, 1);
      }
    }
    
    // Cleanup on unmount
    return () => {
      gsap.killTweensOf([orb1Ref.current, orb2Ref.current, orb3Ref.current, beam1Ref.current, beam2Ref.current]);
    };
  }, [effectiveIntensity, includeBeams, isMobile, hasHighPerformance, mobileOptimized]);
  
  // Optimize blur level for mobile
  const getBlurLevel = (baseBlur: number) => {
    if (isMobile && mobileOptimized) {
      return hasHighPerformance ? baseBlur * 0.7 : baseBlur * 0.5;
    }
    return baseBlur;
  };
  
  // Reduce size for mobile
  const getSizeMultiplier = () => {
    if (isMobile && mobileOptimized) {
      return hasHighPerformance ? 0.8 : 0.7;
    }
    return 1;
  };
  
  // Performance optimized component
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-[-1]"
      aria-hidden="true"
      style={{ 
        isolation: 'isolate', // Create stacking context for better performance
        contain: 'strict',    // Contain repaints to this element
      }}
    >
      {/* Glowing orbs - optimized for different devices */}
      <div 
        ref={orb1Ref}
        className="absolute rounded-full will-change-transform transform-gpu"
        style={{
          background: colors.primary,
          width: `${45 * getSizeMultiplier()}vw`,
          height: `${45 * getSizeMultiplier()}vw`,
          left: '10%',
          top: '20%',
          opacity: 0.3,
          filter: `blur(${getBlurLevel(80)}px)`,
          transform: 'translate3d(0,0,0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d'
        }}
      />
      <div 
        ref={orb2Ref}
        className="absolute rounded-full will-change-transform transform-gpu"
        style={{
          background: colors.secondary,
          width: `${40 * getSizeMultiplier()}vw`,
          height: `${40 * getSizeMultiplier()}vw`,
          right: '5%',
          bottom: '15%',
          opacity: 0.3,
          filter: `blur(${getBlurLevel(100)}px)`,
          transform: 'translate3d(0,0,0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d'
        }}
      />
      <div 
        ref={orb3Ref}
        className="absolute rounded-full will-change-transform transform-gpu"
        style={{
          background: colors.tertiary,
          width: `${35 * getSizeMultiplier()}vw`,
          height: `${35 * getSizeMultiplier()}vw`,
          right: '30%',
          top: '15%',
          opacity: 0.25,
          filter: `blur(${getBlurLevel(90)}px)`,
          transform: 'translate3d(0,0,0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d'
        }}
      />
      
      {/* Light beams - conditionally rendered based on device capability */}
      {includeBeams && !(isMobile && !hasHighPerformance && mobileOptimized) && (
        <>
          <div 
            ref={beam1Ref}
            className="absolute will-change-transform transform-gpu"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${colors.primary} 50%, transparent 100%)`,
              width: '100%',
              height: `${10 * getSizeMultiplier()}vh`,
              left: '0',
              top: '30%',
              opacity: 0.15,
              filter: `blur(${getBlurLevel(40)}px)`,
              transform: 'translate3d(0,0,0) rotate(-5deg)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          />
          <div 
            ref={beam2Ref}
            className="absolute will-change-transform transform-gpu"
            style={{
              background: `linear-gradient(180deg, transparent 0%, ${colors.secondary} 50%, transparent 100%)`,
              width: `${10 * getSizeMultiplier()}vw`,
              height: '100%',
              right: '25%',
              top: '0',
              opacity: 0.1,
              filter: `blur(${getBlurLevel(40)}px)`,
              transform: 'translate3d(0,0,0) rotate(5deg)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          />
        </>
      )}
    </div>
  );
}