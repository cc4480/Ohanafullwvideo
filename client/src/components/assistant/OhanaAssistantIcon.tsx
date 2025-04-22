import React from 'react';
import logoImg from "@assets/OIP.jfif";

// This is an additional simple version of the AI assistant icon that will ALWAYS be visible
export default function OhanaAssistantIcon() {
  const handleClick = () => {
    // Try to find and click the original AI assistant button
    const aiButton = document.querySelector('.ai-assistant-button') as HTMLButtonElement;
    if (aiButton) {
      aiButton.click();
    }
  };

  return (
    <div 
      id="ohana-chat-icon"
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '64px',
        height: '64px',
        borderRadius: '8px',
        backgroundColor: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        border: '3px solid hsl(215, 80%, 50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 999999,
        animation: 'pulse 2s ease-in-out infinite'
      }}
    >
      <img 
        src={logoImg}
        alt="Ohana Assistant"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          padding: '4px'
        }}
      />
    </div>
  );
}