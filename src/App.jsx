import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a1a2e',
      color: '#eee',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        VWPS - Hugging Face Edition
      </h1>
      <p style={{ color: '#888', marginBottom: '2rem' }}>
        Video Workplace Studio - Loading test
      </p>
      <button 
        onClick={() => setCount(c => c + 1)}
        style={{
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          background: '#6366f1',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Click count: {count}
      </button>
      <p style={{ marginTop: '2rem', color: '#666' }}>
        If you see this, React is working! Full app loading...
      </p>
    </div>
  );
}

export default App;
