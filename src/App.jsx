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

  const [prompts, setPrompts] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [shots, setShots] = useState([]);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [resolution, setResolution] = useState('3840x2160');
  const [fps, setFps] = useState('24');
  const [activeTab, setActiveTab] = useState('single');
  const [aiPrompt, setAiPrompt] = useState('');

  useEffect(() => {
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleImageUpload = (refId, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferences(
          references.map(r => r.id === refId ? {...r, file, preview: reader.result} : r)
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const addShot = () => {
    setShots([...shots, {
      id: Date.now() + shots.length,
      number: shots.length + 1,
      description: '',
      resolution,
      fps,
      duration: '00:00:05',
      camera: 'Wide angle, 35mm',
      lighting: 'Natural daylight, high contrast'
    }]);
  };

  const updateShot = (id, field, value) => {
    setShots(shots.map(s => s.id === id ? {...s, [field]: value} : s));
  };

  const deleteShot = (id) => {
    setShots(shots.filter(s => s.id !== id));
  };

  const generateBulkShots = () => {
    if (bulkText.trim() === '') return;
    
    const lines = bulkText.split('\n').filter(line => line.trim());
    const newShots = lines.map((line, i) => ({
      id: Date.now() + i,
      number: i + 1,
      description: line.trim(),
      resolution,
      fps,
      duration: '00:00:05',
      camera: 'Wide angle, 35mm',
      lighting: 'Natural daylight, high contrast',
      imageUrl: `https://picsum.photos/seed/bulk${Date.now()}${i}/400/225`
    }));
    
    setShots(newShots);
    setGeneratedImages(newShots.map(s => s.imageUrl));
  };

  const generateShotList = () => {
    const updatedShots = shots.map((s, i) => ({
      ...s,
      imageUrl: `https://picsum.photos/seed/frame${Date.now()}${i}/400/225`
    }));
    setShots(updatedShots);
    setGeneratedImages(updatedShots.map(s => s.imageUrl));
  };

  const generateFromAI = () => {
    if (aiPrompt.trim() === '') return;
    
    const scenes = aiPrompt.split('\n\n').filter(s => s.trim());
    const newShots = scenes.map((scene, i) => ({
      id: Date.now() + i,
      number: i + 1,
      description: scene.trim(),
      resolution,
      fps,
      duration: '00:00:05',
      camera: 'Wide angle, 35mm',
      lighting: 'Natural daylight, high contrast',
      imageUrl: `https://picsum.photos/seed/ai${Date.now()}${i}/400/225`
    }));
    
    setShots(newShots);
    setGeneratedImages(newShots.map(s => s.imageUrl));
    setActiveTab('single');
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
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
        <section className="ai-creator-section">
          <h2>✨ AI STORY CREATOR</h2>
          <div className="ai-creator-content">
            <textarea
              className="ai-prompt-input"
              placeholder="Describe your story or character...\n\nExample:\n• A Caribbean adventure with humanoid animals\n• Each character has unique Rasta-inspired clothing\n• Cinematic 4K quality with dramatic lighting\n\nEnter multiple scenes separated by blank lines for automatic shot generation."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              rows={10}
            />
            <div className="ai-creator-actions">
              <button onClick={generateFromAI} className="btn-primary btn-large">
                ✨ Generate Story Frames
              </button>
              <div className="ai-stats">
                <span className="stat-badge">{shots.length} shots created</span>
              </div>
            </div>
          </div>
        </section>

        <section className="references-section">
          <h2>🖼️ REFERENCE IMAGES</h2>
          <div className="references-grid">
            {references.map((ref) => (
              <div key={ref.id} className="reference-card">
                <div className="reference-preview">
                  {ref.preview ? (
                    <img src={ref.preview} alt={ref.name} />
                  ) : (
                    <div className="no-image">No image</div>
                  )}
                </div>
                <input 
                  type="text" 
                  value={ref.name} 
                  onChange={(e) => {
                    setReferences(
                      references.map(r => r.id === ref.id ? {...r, name: e.target.value} : r)
                    );
                  }}
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
          <h2>⚙️ PRODUCTION SETTINGS</h2>
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

        <section className="shots-section">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'single' ? 'active' : ''}`}
              onClick={() => setActiveTab('single')}
            >
              Single Shots
            </button>
            <button 
              className={`tab ${activeTab === 'bulk' ? 'active' : ''}`}
              onClick={() => setActiveTab('bulk')}
            >
              Bulk Creation
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'single' ? (
              <div className="single-shots">
                <h2>📝 SCENE DESCRIPTIONS</h2>
                {shots.map((shot) => (
                  <div key={shot.id} className="shot-item">
                    <h3>Shot {shot.number}</h3>
                    <textarea
                      value={shot.description}
                      onChange={(e) => updateShot(shot.id, 'description', e.target.value)}
                      placeholder="Describe the scene in detail..."
                    />
                  </div>
                ))}
                <div className="shot-actions">
                  <button onClick={addShot} className="btn-secondary">
                    + Add Shot
                  </button>
                  <button onClick={generateShotList} className="btn-primary">
                    Generate Shot List
                  </button>
                </div>
              </div>
            ) : (
              <div className="bulk-creation">
                <h2>📋 BULK SCENE CREATION</h2>
                <p className="bulk-instructions">
                  Enter one scene description per line. Each line will become a separate shot.
                </p>
                <textarea
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder="Scene 1: Wide shot of Caribbean beach at sunrise\nScene 2: Close-up of character's face\nScene 3: Action sequence with dramatic lighting\n..."
                  rows={12}
                  className="bulk-textarea"
                />
                <button onClick={generateBulkShots} className="btn-primary btn-large">
                  Generate All Shots
                </button>
              </div>
            )}
          </div>
        </section>

        {generatedImages.length > 0 && (
          <section className="gallery-section">
            <div className="gallery-header">
              <h2>🎬 GENERATED FRAMES ({generatedImages.length})</h2>
              <button className="btn-export">📥 Export as Video</button>
            </div>
            <div className="frames-grid">
              {shots.map((shot, i) => (
                <div key={shot.id} className="frame-card">
                  <div className="frame-image">
                    <img src={shot.imageUrl} alt={`Frame ${i + 1}`} />
                    <div className="frame-number">{String(i + 1).padStart(3, '0')}</div>
                  </div>
                  <div className="frame-info">
                    <p className="frame-description">{shot.description}</p>
                    <div className="frame-meta">
                      <span>{shot.resolution}</span>
                      <span>|</span>
                      <span>{shot.fps} fps</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {shots.length > 0 && (
          <section className="table-section">
            <h2>📊 SHOT LIST ({shots.length} SHOTS)</h2>
            <div className="table-wrapper">
              <table className="shot-table">
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
                  {shots.map((shot, i) => (
                    <tr key={shot.id}>
                      <td>{String(i + 1).padStart(3, '0')}</td>
                      <td className="description-cell">{shot.description}</td>
                      <td>{shot.resolution}</td>
                      <td>{shot.fps}</td>
                      <td>{shot.duration}</td>
                      <td>{shot.camera}</td>
                      <td>{shot.lighting}</td>
                      <td>
                        <button onClick={() => deleteShot(shot.id)} className="btn-delete">
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
