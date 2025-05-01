/**
 * Page Transition Manager
 * Provides smooth transitions between pages for a polished user experience
 */

import { useEffect, useState } from 'react';
import { gsap } from 'gsap';

// Types of transitions available
export enum TransitionType {
  FADE = 'fade',
  SLIDE = 'slide',
  SCALE = 'scale',
  FLIP = 'flip',
  NONE = 'none'
}

// Direction of transitions
export enum TransitionDirection {
  LEFT = 'left',
  RIGHT = 'right',
  UP = 'up',
  DOWN = 'down',
  IN = 'in',
  OUT = 'out'
}

// Configuration for transitions
export interface TransitionConfig {
  type: TransitionType;
  direction?: TransitionDirection;
  duration: number; // in seconds
  ease: string;
  delay?: number;
  stagger?: number; // for staggered animations
}

// Default transition configurations
export const DEFAULT_TRANSITIONS: Record<TransitionType, TransitionConfig> = {
  [TransitionType.FADE]: {
    type: TransitionType.FADE,
    duration: 0.5,
    ease: 'power2.inOut'
  },
  [TransitionType.SLIDE]: {
    type: TransitionType.SLIDE,
    direction: TransitionDirection.LEFT,
    duration: 0.6,
    ease: 'power3.out'
  },
  [TransitionType.SCALE]: {
    type: TransitionType.SCALE,
    duration: 0.6,
    ease: 'back.out(1.7)'
  },
  [TransitionType.FLIP]: {
    type: TransitionType.FLIP,
    duration: 0.8,
    ease: 'power4.inOut'
  },
  [TransitionType.NONE]: {
    type: TransitionType.NONE,
    duration: 0,
    ease: 'none'
  }
};

// Hook for managing page transitions
export function usePageTransition(config: TransitionConfig = DEFAULT_TRANSITIONS[TransitionType.FADE]) {
  const [displayState, setDisplayState] = useState<'entering' | 'active' | 'exiting'>('entering');
  
  useEffect(() => {
    // Initial entering animation
    if (displayState === 'entering') {
      const container = document.querySelector('.page-container');
      if (!container) return;
      
      // Set initial state based on transition type
      switch (config.type) {
        case TransitionType.FADE:
          gsap.set(container, { opacity: 0 });
          gsap.to(container, {
            opacity: 1,
            duration: config.duration,
            ease: config.ease,
            delay: config.delay || 0,
            onComplete: () => setDisplayState('active')
          });
          break;
          
        case TransitionType.SLIDE:
          const xOffset = config.direction === TransitionDirection.LEFT ? '100%' : 
                        config.direction === TransitionDirection.RIGHT ? '-100%' : '0';
          const yOffset = config.direction === TransitionDirection.UP ? '100%' : 
                        config.direction === TransitionDirection.DOWN ? '-100%' : '0';
          
          gsap.set(container, { x: xOffset, y: yOffset, opacity: 0 });
          gsap.to(container, {
            x: 0,
            y: 0,
            opacity: 1,
            duration: config.duration,
            ease: config.ease,
            delay: config.delay || 0,
            onComplete: () => setDisplayState('active')
          });
          break;
          
        case TransitionType.SCALE:
          gsap.set(container, { scale: 0.8, opacity: 0 });
          gsap.to(container, {
            scale: 1,
            opacity: 1,
            duration: config.duration,
            ease: config.ease,
            delay: config.delay || 0,
            onComplete: () => setDisplayState('active')
          });
          break;
          
        case TransitionType.FLIP:
          const rotationAxis = config.direction === TransitionDirection.LEFT || 
                            config.direction === TransitionDirection.RIGHT ? 'rotationY' : 'rotationX';
          const rotationValue = config.direction === TransitionDirection.LEFT || 
                              config.direction === TransitionDirection.UP ? 90 : -90;
          
          gsap.set(container, { [rotationAxis]: rotationValue, opacity: 0 });
          gsap.to(container, {
            [rotationAxis]: 0,
            opacity: 1,
            duration: config.duration,
            ease: config.ease,
            delay: config.delay || 0,
            onComplete: () => setDisplayState('active')
          });
          break;
          
        case TransitionType.NONE:
        default:
          setDisplayState('active');
          break;
      }
    }
  }, [config, displayState]);
  
  // Handle exit animation
  const exitPage = (onComplete: () => void) => {
    setDisplayState('exiting');
    
    const container = document.querySelector('.page-container');
    if (!container) {
      onComplete();
      return;
    }
    
    switch (config.type) {
      case TransitionType.FADE:
        gsap.to(container, {
          opacity: 0,
          duration: config.duration * 0.8, // Slightly faster exit
          ease: config.ease,
          onComplete
        });
        break;
        
      case TransitionType.SLIDE:
        const xOffset = config.direction === TransitionDirection.LEFT ? '-100%' : 
                      config.direction === TransitionDirection.RIGHT ? '100%' : '0';
        const yOffset = config.direction === TransitionDirection.UP ? '-100%' : 
                      config.direction === TransitionDirection.DOWN ? '100%' : '0';
        
        gsap.to(container, {
          x: xOffset,
          y: yOffset,
          opacity: 0,
          duration: config.duration * 0.8,
          ease: config.ease,
          onComplete
        });
        break;
        
      case TransitionType.SCALE:
        gsap.to(container, {
          scale: 0.8,
          opacity: 0,
          duration: config.duration * 0.8,
          ease: config.ease,
          onComplete
        });
        break;
        
      case TransitionType.FLIP:
        const rotationAxis = config.direction === TransitionDirection.LEFT || 
                          config.direction === TransitionDirection.RIGHT ? 'rotationY' : 'rotationX';
        const rotationValue = config.direction === TransitionDirection.LEFT || 
                            config.direction === TransitionDirection.UP ? -90 : 90;
        
        gsap.to(container, {
          [rotationAxis]: rotationValue,
          opacity: 0,
          duration: config.duration * 0.8,
          ease: config.ease,
          onComplete
        });
        break;
        
      case TransitionType.NONE:
      default:
        onComplete();
        break;
    }
  };
  
  return { displayState, exitPage };
}

// Component transition hook (for animating components within pages)
export function useComponentTransition(element: React.RefObject<HTMLElement>, config: TransitionConfig = DEFAULT_TRANSITIONS[TransitionType.FADE]) {
  useEffect(() => {
    if (!element.current) return;
    
    // Set initial state
    switch (config.type) {
      case TransitionType.FADE:
        gsap.set(element.current, { opacity: 0 });
        gsap.to(element.current, {
          opacity: 1,
          duration: config.duration,
          ease: config.ease,
          delay: config.delay || 0
        });
        break;
        
      case TransitionType.SLIDE:
        const xOffset = config.direction === TransitionDirection.LEFT ? '50px' : 
                      config.direction === TransitionDirection.RIGHT ? '-50px' : '0';
        const yOffset = config.direction === TransitionDirection.UP ? '50px' : 
                      config.direction === TransitionDirection.DOWN ? '-50px' : '0';
        
        gsap.set(element.current, { x: xOffset, y: yOffset, opacity: 0 });
        gsap.to(element.current, {
          x: 0,
          y: 0,
          opacity: 1,
          duration: config.duration,
          ease: config.ease,
          delay: config.delay || 0
        });
        break;
        
      case TransitionType.SCALE:
        gsap.set(element.current, { scale: 0.9, opacity: 0 });
        gsap.to(element.current, {
          scale: 1,
          opacity: 1,
          duration: config.duration,
          ease: config.ease,
          delay: config.delay || 0
        });
        break;
        
      // Other transitions...
      
      default:
        break;
    }
  }, [element, config]);
}

// Group/list animation hook
export function useStaggeredTransition(selector: string, config: TransitionConfig & { stagger: number }) {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;
    
    // Set initial state
    switch (config.type) {
      case TransitionType.FADE:
        gsap.set(elements, { opacity: 0 });
        gsap.to(elements, {
          opacity: 1,
          duration: config.duration,
          ease: config.ease,
          delay: config.delay || 0,
          stagger: config.stagger
        });
        break;
        
      case TransitionType.SLIDE:
        const xOffset = config.direction === TransitionDirection.LEFT ? '50px' : 
                      config.direction === TransitionDirection.RIGHT ? '-50px' : '0';
        const yOffset = config.direction === TransitionDirection.UP ? '50px' : 
                      config.direction === TransitionDirection.DOWN ? '-50px' : '0';
        
        gsap.set(elements, { x: xOffset, y: yOffset, opacity: 0 });
        gsap.to(elements, {
          x: 0,
          y: 0,
          opacity: 1,
          duration: config.duration,
          ease: config.ease,
          delay: config.delay || 0,
          stagger: config.stagger
        });
        break;
        
      // Other transitions...
      
      default:
        break;
    }
  }, [selector, config]);
}

// Function to apply transition class to pages
export function getTransitionClass(type: TransitionType): string {
  switch (type) {
    case TransitionType.FADE:
      return 'transition-opacity';
    case TransitionType.SLIDE:
      return 'transition-transform transition-opacity';
    case TransitionType.SCALE:
      return 'transition-transform transition-opacity';
    case TransitionType.FLIP:
      return 'transition-transform transition-opacity preserve-3d';
    default:
      return '';
  }
}
