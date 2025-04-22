import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  transparentHeader?: boolean; // Option for transparent header on certain pages
}

/**
 * Layout component that creates a consistent structure for all pages
 * with the fixed background parallax effect, ensuring content scrolls over the background
 */
export default function Layout({ children, transparentHeader = false }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      {/* Main content that scrolls over the fixed background */}
      <main className="flex-grow relative z-1 bg-transparent">
        {/* Content container */}
        <div className="overlay-content">
          {children}
        </div>
      </main>
    </div>
  );
}