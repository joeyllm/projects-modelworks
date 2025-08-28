import React from 'react';

function TestApp() {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#1e293b', 
      color: 'white', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🏥 Clinical Coding Assistant - Test Page</h1>
      <p>If you can see this, React is working correctly!</p>
      <div style={{ 
        backgroundColor: '#334155', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h2>✅ React is Running Successfully</h2>
        <p>This is a test page to verify that:</p>
        <ul>
          <li>✅ React is working</li>
          <li>✅ Development server is running</li>
          <li>✅ JavaScript is loading</li>
          <li>✅ CSS is working</li>
        </ul>
      </div>
      <button 
        onClick={() => alert('React is working!')}
        style={{
          backgroundColor: '#06b6d4',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Test React Functionality
      </button>
    </div>
  );
}

export default TestApp;
