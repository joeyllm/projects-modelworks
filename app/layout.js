import React from 'react';
import './globals.css';

function RootLayout({ children }) {
  return (
    <div className="root-layout">
      {children}
    </div>
  );
}

export default RootLayout;
