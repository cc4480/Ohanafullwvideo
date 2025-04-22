import React from 'react';
import logoImg from "@assets/OIP.jfif";

// This is an additional simple version of the AI assistant icon that will ALWAYS be visible
export default function OhanaAssistantIcon() {
  // State to track if this component should be displayed
  const [shouldShow, setShouldShow] = React.useState(false);
  
  // Function to toggle the main AI chat component 
  const handleClick = () => {
    // Find and click the main AI assistant button
    const mainButton = document.querySelector('button[aria-label="Chat with Ohana Assistant"]') as HTMLButtonElement;
    if (mainButton) {
      mainButton.click();
    }
  };
  
  // Check for mobile screens
  React.useEffect(() => {
    const checkMobile = () => {
      setShouldShow(window.innerWidth < 768);
    };
    
    // Set immediately
    checkMobile();
    
    // Listen for resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Don't render on desktop as the main AI component handles it
  if (!shouldShow) return null;
  
  return (
    <div 
      id="ohana-chat-icon"
      className="ai-assistant-button mobile-optimized"
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px', 
        width: '56px',
        height: '56px',
        borderRadius: '8px',
        backgroundColor: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        border: '3px solid hsl(195, 100%, 29%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 9999999,
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      <img 
        src={logoImg}
        alt="Ohana Assistant"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          padding: '4px',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      />
    </div>
  );
}