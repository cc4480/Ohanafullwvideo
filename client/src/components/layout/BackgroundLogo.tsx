import React from 'react';

/**
 * BackgroundLogo component that creates a fixed background parallax effect
 * where the logo stays completely static while content scrolls over it
 */
export default function BackgroundLogo() {
  return (
    <div className="background-logo" aria-hidden="true" />
  );
}