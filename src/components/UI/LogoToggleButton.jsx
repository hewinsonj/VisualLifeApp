import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export default function LogoToggleButton() {
  const { buttonsVisible, showButtons, hideButtons } = useAppStore();

  const handleToggle = () => {
    buttonsVisible ? hideButtons() : showButtons();
  };

  return (
    <button
      onClick={handleToggle}
      className="logo-toggle-button"
    >
      <img
        src="/assets/logos/logo.png"
        alt="Logo"
        style={{
          height: '60px',
          width: '60px',
          borderRadius: '12px',
          border: 'none',
          outline: 'none',
          display: 'block'
        }}
      />
    </button>
  );
}
