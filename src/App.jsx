import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [references, setReferences] = useState([
    { id: 1, name: 'Reference 1', file: null, preview: null },
    { id: 2, name: 'Reference 2', file: null, preview: null },
    { id: 3, name: 'Reference 3', file: null, preview: null },
    { id: 4, name: 'Reference 4', file: null, preview: null }
  ]);
  
  const [prompts, setPrompts] = useState(['']);
  const [bulkText, setBulkText] = useState('');
  const [shots, setShots] = useState([]);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [resolution, setResolution] = useState('3840x2160');
  const [fps, setFps] = useState('24');
  const [activeTab, setActiveTab] = useState('single');
  
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);
  
  const handleImageUpload = (id, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferences(refs => refs.map(ref => 
          ref.id === id ? { ...ref, file, preview: reader.result } : ref
        ));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const addPrompt = () => setPrompts([...prompts, '']);
  
  const updatePrompt = (index, value) => {
    const newPrompts = [...prompts];
    newPrompts[index] = value;
    setPrompts(newPrompts);
  };
  
  const generateShots = () => {
    const newShots = prompts.filter(p => p.trim()).map((prompt, i) => ({
      id: Date.now() + i,
      number: i + 1,
      description: prompt,
      resolution,
      fps,
      duration: '00:00:05',
      camera: 'Wide angle, 35mm',
      lighting: 'Natural daylight, high contrast',
      imageUrl: `https://via.placeholder.com/400x225/333/fff?text=Frame+${i+1}`
    }));
    setShots(newShots);
    setGeneratedImages(newShots.map(s => s.imageUrl));
  };
  
  const generateBulkShots = () => {
    const lines = bulkText.split('\n').filter(line => line.trim());
    const newShots = lines.map((line, i) => ({
      id: Date.now() + i,
      number: i + 1,
      description: line,
      resolution,
      fps,
      duration: '00:00:05',
      camera: 'Wide angle, 35mm',
      lighting: 'Natural daylight, high contrast',
      imageUrl: `https://via.placeholder.com/400x225/333/fff?text=Frame+${i+1}`
    }));
    setShots(newShots);
    setGeneratedImages(newShots.map(s => s.imageUrl));
  };
  
  const deleteShot = (id) => {
    setShots(shots.filter(s => s.id !== id));
  };
  
  const exportVideo = () => {
    alert('Video export feature - Coming soon! This will compile all frames into a video.');
  };
  
  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <header className="header">
        <div className="header-content">
          <h1>SRIPTO</h1>
          <p>Professional Video Frame Generator</p>
        </div>
        <button onClick={() => setDarkMode(!darkMode)} className="dark-mode-toggle">
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </header>
      
      <div className="container">
        <section className="references-section">
          <h2>Reference Images</h2>
          <div className="references-grid">
            {references.map(ref => (
              <div key={ref.id} className="reference-card">
                <div className="reference-preview">
                  {ref.preview ? (
                    <img src={ref.preview} alt={ref.name} />
                  ) : (
                    <div className="preview-placeholder">No image</div>
                  )}
                </div>
                <input
                  type="text"
                  value={ref.name}
                  onChange={(e) => setReferences(refs => 
                    refs.map(r => r.id === ref.id ? {...r, name: e.target.value} : r)
                  )}
                  className="reference-name"
                />
                <label className="upload-btn">
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(ref.id, e)}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            ))}
          </div>
        </section>
        
        <section className="settings-section">
          <h2>Production Settings</h2>
          <div className="settings-grid">
            <div className="setting-group">
              <label>Resolution</label>
              <select value={resolution} onChange={(e) => setResolution(e.target.value)}>
                <option value="3840x2160">4K (3840x2160)</option>
                <option value="1920x1080">Full HD (1920x1080)</option>
                <option value="1280x720">HD (1280x720)</option>
              </select>
            </div>
            <div className="setting-group">
              <label>Frame Rate</label>
              <select value={fps} onChange={(e) => setFps(e.target.value)}>
                <option value="24">24 fps (Cinematic)</option>
                <option value="30">30 fps (Standard)</option>
                <option value="60">60 fps (Smooth)</option>
              </select>
            </div>
          </div>
        </section>
        
        <section className="prompts-section">
          <div className="tab-header">
            <button 
              className={`tab-btn ${activeTab === 'single' ? 'active' : ''}`}
              onClick={() => setActiveTab('single')}
            >
              Single Shots
            </button>
            <button 
              className={`tab-btn ${activeTab === 'bulk' ? 'active' : ''}`}
              onClick={() => setActiveTab('bulk')}
            >
              Bulk Creation
            </button>
          </div>
          
          {activeTab === 'single' ? (
            <div>
              <h2>Scene Descriptions</h2>
              {prompts.map((prompt, i) => (
                <div key={i} className="prompt-input">
                  <span className="prompt-label">Shot {i + 1}</span>
                  <textarea
                    value={prompt}
                    onChange={(e) => updatePrompt(i, e.target.value)}
                    placeholder="Describe the scene in detail..."
                    rows="2"
                  />
                </div>
              ))}
              <button onClick={addPrompt} className="add-btn">Add Shot</button>
              <button onClick={generateShots} className="generate-btn">Generate Shot List</button>
            </div>
          ) : (
            <div>
              <h2>Bulk Video Creation</h2>
              <p className="bulk-hint">Enter one scene per line to create multiple shots at once:</p>
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={"Wide angle of warrior on cliff at sunset\nClose-up of warrior's determined face\nBird's eye view of battlefield below\nDramatic slow-motion sword draw"}
                rows="10"
                className="bulk-textarea"
              />
              <button onClick={generateBulkShots} className="generate-btn">Generate All Shots</button>
            </div>
          )}
        </section>
        
        {generatedImages.length > 0 && (
          <section className="gallery-section">
            <h2>Generated Frames ({generatedImages.length})</h2>
            <div className="image-gallery">
              {shots.map((shot, index) => (
                <div key={shot.id} className="gallery-item">
                  <div className="gallery-image">
                    <img src={shot.imageUrl} alt={`Frame ${shot.number}`} />
                    <div className="gallery-overlay">
                      <span className="frame-number">{shot.number.toString().padStart(3, '0')}</span>
                    </div>
                  </div>
                  <div className="gallery-info">
                    <p className="gallery-desc">{shot.description.substring(0, 60)}...</p>
                    <span className="gallery-meta">{shot.resolution} | {shot.fps}fps</span>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={exportVideo} className="export-btn">Export as Video</button>
          </section>
        )}
        
        {shots.length > 0 && (
          <section className="shots-section">
            <h2>Shot List ({shots.length} shots)</h2>
            <div className="table-container">
              <table className="shots-table">
                <thead>
                  <tr>
                    <th>Shot</th>
                    <th>Description</th>
                    <th>Resolution</th>
                    <th>FPS</th>
                    <th>Duration</th>
                    <th>Camera</th>
                    <th>Lighting</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {shots.map(shot => (
                    <tr key={shot.id}>
                      <td>{shot.number.toString().padStart(3, '0')}</td>
                      <td className="description-cell">{shot.description}</td>
                      <td>{shot.resolution}</td>
                      <td>{shot.fps}</td>
                      <td>{shot.duration}</td>
                      <td>{shot.camera}</td>
                      <td>{shot.lighting}</td>
                      <td>
                        <button onClick={() => deleteShot(shot.id)} className="delete-btn">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
