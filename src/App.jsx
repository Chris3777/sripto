import { useState } from 'react';
import './App.css';

function App() {
  const [testMessage] = useState('Sripto is Live!');

  return (
    <div className="app">
      <header className="header">
        <h1>🎥 {testMessage}</h1>
        <p>Professional 4K Cinematic Storyboard Tool</p>
      </header>
      <div className="container">
        <div className="left-panel">
          <h2>Control Panel</h2>
          <p style={{color: '#fcd116'}}>Upload references, enter prompts, generate frames!</p>
        </div>
        <div className="right-panel">
          <h2>Results Grid</h2>
          <p style={{color: '#fcd116'}}>Your storyboard frames will appear here</p>
        </div>
      </div>
      <footer className="footer">
        <p>Built for creators - Automated deployment working!</p>
      </footer>
    </div>
  );
}

export default App;
