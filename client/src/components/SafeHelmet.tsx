import React from 'react';
import { Helmet } from 'react-helmet';

// Component to safely wrap Helmet and prevent errors
export default function SafeHelmet({ children }: { children: React.ReactNode }) {
  // Create a safe wrapper that ensures all content is valid
  try {
    return <Helmet>{children}</Helmet>;
  } catch (error) {
    console.error('Error in Helmet component:', error);
    // Return an empty Helmet to avoid crashing
    return <Helmet />;
  }
}