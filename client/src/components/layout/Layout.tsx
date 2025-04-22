import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  transparentHeader?: boolean; // Option for transparent header on certain pages
}

/**
 * Layout component that creates a consistent structure for all pages
 * with the fixed background parallax effect
 */
export default function Layout({ children, transparentHeader = false }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content that scrolls over the fixed background */}
      <main className="flex-grow relative z-10">
        {children}
      </main>
    </div>
  );
}