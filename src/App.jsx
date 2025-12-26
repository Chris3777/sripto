import { useState } from 'react';
import './App.css';
import JSZip from 'jszip';

function App() {
  const [projectName, setProjectName] = useState('Untitled Project');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  
  // Reference images
  const [references, setReferences] = useState({
    character: null,
    scene: null,
    style: null,
    custom: null
  });
  
  // Prompts and generated frames
  const [prompts, setPrompts] = useState('');
  const [frames, setFrames] = useState([]);
  
  // Handle reference upload
  const handleReferenceUpload = (type, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setReferences(prev => ({ ...prev, [type]: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle frame upload (generated images)
  const handleFrameUpload = (files) => {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFrame = {
          id: Date.now() + Math.random(),
          image: e.target.result,
          name: file.name,
          prompt: '',
          camera: '',
          lighting: '',
          audio: '',
          dialogue: '',
          continuity: ''
        };
        setFrames(prev => [...prev, newFrame]);
      };
      reader.readAsDataURL(file);
    });
  };
  
  // Update frame details
  const updateFrame = (id, field, value) => {
    setFrames(prev => prev.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };
  
  // Delete frame
  const deleteFrame = (id) => {
    setFrames(prev => prev.filter(f => f.id !== id));
  };
  
  // Export script
  const exportScript = () => {
    let script = `PROJECT: ${projectName}\nASPECT RATIO: ${aspectRatio}\n\n`;
    
    frames.forEach((frame, index) => {
      script += `FRAME ${String(index + 1).padStart(3, '0')}\n`;
      script += `Visual: ${frame.prompt}\n`;
      if (frame.camera) script += `Camera: ${frame.camera}\n`;
      if (frame.lighting) script += `Lighting: ${frame.lighting}\n`;
      if (frame.audio) script += `Audio: ${frame.audio}\n`;
      if (frame.dialogue) script += `Dialogue: ${frame.dialogue}\n`;
      if (frame.continuity) script += `Continuity: ${frame.continuity}\n`;
      script += `\n`;
    });
    
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}_script.txt`;
    a.click();
  };
  
  // Export all frames as ZIP
  const exportFrames = async () => {
    const zip = new JSZip();
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    
    frames.forEach((frame, index) => {
      const imgData = frame.image.split(',')[1];
      const fileName = `${String(index + 1).padStart(3, '0')}_${date}.png`;
      zip.file(fileName, imgData, { base64: true });
    });
    
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}_frames.zip`;
    a.click();
  };
  
  // Copy prompts to clipboard
  const copyPrompts = () => {
    navigator.clipboard.writeText(prompts);
    alert('Prompts copied to clipboard!');
  };
  
  return (
    <div className="sripto-app">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">Scripto</span>
          <span className="badge">Storyboard Tool</span>
        </div>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="project-name"
          placeholder="Project Name"
        />
        <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="aspect-select">
          <option value="16:9">16:9</option>
          <option value="9:16">9:16</option>
          <option value="1:1">1:1</option>
          <option value="4:3">4:3</option>
        </select>
      </header>
      
      {/* Main Content */}
      <div className="main-content">
        {/* Left Panel - Controls */}
        <div className="left-panel">
          {/* Reference Uploads */}
          <section className="section">
            <h2>📸 Reference Images</h2>
            <div className="reference-grid">
              {['character', 'scene', 'style', 'custom'].map(type => (
                <div key={type} className="reference-slot">
                  <label className="reference-label">{type.charAt(0).toUpperCase() + type.slice(1)}</label>
                  {references[type] ? (
                    <div className="reference-preview">
                      <img src={references[type]} alt={type} />
                      <button onClick={() => setReferences(prev => ({ ...prev, [type]: null }))} className="remove-btn">✕</button>
                    </div>
                  ) : (
                    <label className="upload-box">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleReferenceUpload(type, e.target.files[0])}
                        style={{ display: 'none' }}
                      />
                      <span>+ Upload</span>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </section>
          
          {/* Batch Prompts */}
          <section className="section">
            <h2>🎬 Batch Prompts</h2>
            <textarea
              value={prompts}
              onChange={(e) => setPrompts(e.target.value)}
              placeholder="Frame 1: 4K photoreal cinematic frame — limousine trunk interior, claustrophobic low light...\n\nFrame 2: ...\n\nFrame 3: ..."
              className="prompts-textarea"
              rows={10}
            />
            <button onClick={copyPrompts} className="btn btn-secondary">📋 Copy Prompts</button>
            <p className="hint">Copy these prompts → Paste into Google AI Studio or Midjourney → Generate images → Upload results below</p>
          </section>
          
          {/* Upload Generated Frames */}
          <section className="section">
            <h2>⬆️ Upload Generated Images</h2>
            <label className="upload-area">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFrameUpload(e.target.files)}
                style={{ display: 'none' }}
              />
              <div className="upload-content">
                <span className="upload-icon">📁</span>
                <span>Drop images here or click to upload</span>
              </div>
            </label>
          </section>
          
          {/* Export */}
          <section className="section">
            <h2>💾 Export</h2>
            <button onClick={exportScript} disabled={frames.length === 0} className="btn btn-primary">📄 Export Script</button>
            <button onClick={exportFrames} disabled={frames.length === 0} className="btn btn-primary">📦 Download All Frames (ZIP)</button>
          </section>
        </div>
        
        {/* Right Panel - Results Grid */}
        <div className="right-panel">
          <div className="results-header">
            <h2>🎞️ Frames ({frames.length})</h2>
          </div>
          {frames.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎬</div>
              <p>No frames yet</p>
              <p className="empty-hint">Upload generated images to organize your storyboard</p>
            </div>
          ) : (
            <div className="frames-grid">
              {frames.map((frame, index) => (
                <div key={frame.id} className="frame-card">
                  <div className="frame-header">
                    <span className="frame-number">Frame {String(index + 1).padStart(3, '0')}</span>
                    <button onClick={() => deleteFrame(frame.id)} className="delete-btn">🗑️</button>
                  </div>
                  <div className="frame-image">
                    <img src={frame.image} alt={`Frame ${index + 1}`} />
                  </div>
                  <div className="frame-details">
                    <textarea
                      placeholder="Visual description / prompt"
                      value={frame.prompt}
                      onChange={(e) => updateFrame(frame.id, 'prompt', e.target.value)}
                      rows={2}
                    />
                    <input
                      placeholder="Camera: e.g., 200mm long lens, wide angle"
                      value={frame.camera}
                      onChange={(e) => updateFrame(frame.id, 'camera', e.target.value)}
                    />
                    <input
                      placeholder="Lighting: e.g., golden hour, cool interior"
                      value={frame.lighting}
                      onChange={(e) => updateFrame(frame.id, 'lighting', e.target.value)}
                    />
                    <input
                      placeholder="Audio cues: e.g., trunk latch thud, muffled breath"
                      value={frame.audio}
                      onChange={(e) => updateFrame(frame.id, 'audio', e.target.value)}
                    />
                    <input
                      placeholder="Dialogue / voice-over"
                      value={frame.dialogue}
                      onChange={(e) => updateFrame(frame.id, 'dialogue', e.target.value)}
                    />
                    <input
                      placeholder="Continuity notes: costume, props, positions"
                      value={frame.continuity}
                      onChange={(e) => updateFrame(frame.id, 'continuity', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
