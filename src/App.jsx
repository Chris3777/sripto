import { useState, useEffect } from 'react';
import './App.css';

// AI Service Functions
const parseScenario = (prompt) => {
  const timeMatch = prompt.match(/(\d+)\s*min\s*(\d+)?s?|/(\d+):(\d+)/);
  const clipMatch = prompt.match(/(\d+)\s*sec/);
  let seconds = 180;
  if (timeMatch) {
    const [_, m, s] = timeMatch;
    seconds = (parseInt(m) || 0) * 60 + (parseInt(s) || 0);
  }
  const clipLen = clipMatch ? parseInt(clipMatch[1]) : 8;
  return {
    totalSeconds: seconds,
    clipLength: clipLen,
    sceneCount: Math.ceil(seconds / clipLen),
    theme: prompt
  };
};

const generateImage = async () => {
  await new Promise(r => setTimeout(r, 1500));
  return `https://picsum.photos/800/450?random=${Date.now()}`;
};

const THEMES = {
  original: { name: 'Original', primary: '#ffcc00', secondary: '#009639', accent: '#d62718', bg: '#0a0a0a', card: '#1a1a1a' },
  classic: { name: 'Classic', primary: '#888', secondary: '#444', accent: '#ccc', bg: '#1a1a1a', card: '#2a2a2a' },
  night: { name: 'Night', primary: '#6b8cff', secondary: '#2d4a9e', accent: '#9bb3ff', bg: '#0f1419', card: '#1a2332' },
  ocean: { name: 'Ocean', primary: '#00bcd4', secondary: '#0097a7', accent: '#80deea', bg: '#0a1929', card: '#1a2f3f' },
  sunset: { name: 'Sunset', primary: '#ff6b35', secondary: '#ff9f68', accent: '#ffa07a', bg: '#1a0f0a', card: '#2a1a14' },
  forest: { name: 'Forest', primary: '#4caf50', secondary: '#2e7d32', accent: '#81c784', bg: '#0a120a', card: '#1a2414' },
};

function App() {
  const [theme, setTheme] = useState('original');
  const [projectName, setProjectName] = useState('Untitled Project');
  const [scenarioPrompt, setScenarioPrompt] = useState('');
  const [style, setStyle] = useState('cinematic');
  const [quality, setQuality] = useState('1080p');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [scenarioData, setScenarioData] = useState(null);
  const [references, setReferences] = useState([
    { id: 1, type: 'character', title: 'Character', image: null, prompt: '' },
    { id: 2, type: 'scene', title: 'Scene', image: null, prompt: '' },
    { id: 3, type: 'style', title: 'Style', image: null, prompt: '' },
    { id: 4, type: 'custom', title: 'Custom', image: null, prompt: '' }
  ]);
  const [scenes, setScenes] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, msg: '' });
  const [showMenu, setShowMenu] = useState({ style: false, quality: false, theme: false });

  useEffect(() => {
    const t = THEMES[theme];
    document.documentElement.style.setProperty('--color-primary', t.primary);
    document.documentElement.style.setProperty('--color-secondary', t.secondary);
    document.documentElement.style.setProperty('--color-accent', t.accent);
    document.documentElement.style.setProperty('--color-bg', t.bg);
    document.documentElement.style.setProperty('--color-card', t.card);
  }, [theme]);

  const generateScenario = async () => {
    if (!scenarioPrompt.trim()) return;
    setGenerating(true);
    setProgress({ current: 1, total: 4, msg: 'Analyzing scenario...' });
    const data = parseScenario(scenarioPrompt);
    setScenarioData(data);
    
    setProgress({ current: 2, total: 4, msg: 'Creating references...' });
    const newRefs = await Promise.all(references.map(async (r) => ({
      ...r,
      image: await generateImage(),
      prompt: `${data.theme} - ${r.type} reference`
    })));
    setReferences(newRefs);
    
    setProgress({ current: 3, total: 4, msg: `Generating ${data.sceneCount} scenes...` });
    const newScenes = [];
    for (let i = 1; i <= data.sceneCount; i++) {
      const scene = {
        id: Date.now() + i,
        number: i,
        title: `Scene ${i}`,
        prompt: `4K ${style} shot ${i}/${data.sceneCount}: ${data.theme}`,
        image: null
      };
      newScenes.push(scene);
    }
    setScenes(newScenes);
    
    setProgress({ current: 4, total: 4, msg: 'Generating images...' });
    for (const scene of newScenes) {
      const img = await generateImage();
      setScenes(prev => prev.map(s => s.id === scene.id ? { ...s, image: img } : s));
    }
    
    setGenerating(false);
  };

  const generateVariant = async (sceneId) => {
    setScenes(prev => prev.map(s => s.id === sceneId ? { ...s, generating: true } : s));
    const img = await generateImage();
    setScenes(prev => prev.map(s => s.id === sceneId ? { ...s, image: img, generating: false } : s));
  };

  const updateScene = (id, field, value) => {
    setScenes(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const copyPrompt = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied!');
  };

  const updateRef = (id, updates) => {
    setReferences(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const handleRefUpload = (id, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => updateRef(id, { image: e.target.result });
    reader.readAsDataURL(file);
  };

  const generateVideo = async () => {
    setGenerating(true);
    setProgress({ current: 0, total: scenes.length, msg: 'Creating video...' });
    await new Promise(r => setTimeout(r, 3000));
    alert('Video generated! (Mock - integrate real API)');
    setGenerating(false);
  };

  return (
    <div className={`scripto-app theme-${theme}`}>
      <header className="menu-bar">
        <div className="logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">Scripto</span>
          <span className="badge">AI Studio</span>
        </div>
        <input value={projectName} onChange={(e) => setProjectName(e.target.value)} className="project-name" />
        
        <div className="menu-controls">
          <div className="menu-item">
            <button onClick={() => setShowMenu({ ...showMenu, style: !showMenu.style })} className="menu-btn">
              Style: {style} ▼
            </button>
            {showMenu.style && (
              <div className="dropdown">
                {['cinematic', 'anime', 'realistic', 'abstract', 'documentary'].map(s => (
                  <div key={s} onClick={() => { setStyle(s); setShowMenu({ ...showMenu, style: false }); }}>{s}</div>
                ))}
              </div>
            )}
          </div>
          
          <div className="menu-item">
            <button onClick={() => setShowMenu({ ...showMenu, quality: !showMenu.quality })} className="menu-btn">
              {quality} ▼
            </button>
            {showMenu.quality && (
              <div className="dropdown">
                {['4K', '1080p', '720p', 'SD'].map(q => (
                  <div key={q} onClick={() => { setQuality(q); setShowMenu({ ...showMenu, quality: false }); }}>{q}</div>
                ))}
              </div>
            )}
          </div>
          
          <div className="menu-item">
            <button onClick={() => setShowMenu({ ...showMenu, theme: !showMenu.theme })} className="menu-btn">
              Theme ▼
            </button>
            {showMenu.theme && (
              <div className="dropdown">
                {Object.keys(THEMES).map(t => (
                  <div key={t} onClick={() => { setTheme(t); setShowMenu({ ...showMenu, theme: false }); }}>{THEMES[t].name}</div>
                ))}
              </div>
            )}
          </div>
          
          <button onClick={generateVideo} disabled={scenes.length === 0 || generating} className="btn-generate-all">
            🎥 Generate Video
          </button>
        </div>
      </header>

      <div className="main-container">
        <section className="scenario-section">
          <h2>📝 Scenario Prompt</h2>
          <textarea
            value={scenarioPrompt}
            onChange={(e) => setScenarioPrompt(e.target.value)}
            placeholder="Example: 4K video about a lion in London, 3min20s for 8sec clips"
            className="scenario-input"
            rows={3}
          />
          <button onClick={generateScenario} disabled={!scenarioPrompt.trim() || generating} className="btn-primary">
            {generating ? 'Generating...' : '✨ Generate Scenario'}
          </button>
          {scenarioData && (
            <div className="scenario-info">
              <span>📊 {scenarioData.sceneCount} scenes</span>
              <span>⏱️ {Math.floor(scenarioData.totalSeconds / 60)}:{(scenarioData.totalSeconds % 60).toString().padStart(2, '0')}</span>
              <span>🎞️ {scenarioData.clipLength}s/clip</span>
            </div>
          )}
          {generating && <div className="progress-bar"><div className="progress-fill" style={{ width: `${(progress.current / progress.total) * 100}%` }}></div><span>{progress.msg}</span></div>}
        </section>

        <section className="references-section">
          <h2>🖼️ Reference Images</h2>
          <div className="reference-grid">
            {references.map(ref => (
              <div key={ref.id} className="reference-card">
                <input value={ref.title} onChange={(e) => updateRef(ref.id, { title: e.target.value })} className="ref-title" />
                <div className="ref-image-box">
                  {ref.image ? (
                    <><img src={ref.image} alt={ref.title} /><button onClick={() => updateRef(ref.id, { image: null })} className="remove-btn">✕</button></>
                  ) : (
                    <label className="upload-label">
                      <input type="file" accept="image/*" onChange={(e) => handleRefUpload(ref.id, e.target.files[0])} style={{ display: 'none' }} />
                      + Upload
                    </label>
                  )}
                </div>
                <textarea value={ref.prompt} onChange={(e) => updateRef(ref.id, { prompt: e.target.value })} placeholder="Prompt description" rows={2} />
              </div>
            ))}
          </div>
        </section>

        <section className="scenes-section">
          <h2>🎞️ Scenes ({scenes.length})</h2>
          {scenes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎬</div>
              <p>No scenes yet</p>
              <p className="hint">Generate a scenario to create scenes automatically</p>
            </div>
          ) : (
            <div className="scenes-grid">
              {scenes.map(scene => (
                <div key={scene.id} className="scene-card">
                  <div className="scene-header">
                    <span className="scene-num">Scene {scene.number}</span>
                    <button onClick={() => generateVariant(scene.id)} disabled={scene.generating} className="btn-variant">
                      {scene.generating ? '⏳' : '🔄'} Variant
                    </button>
                  </div>
                  {scene.image && <img src={scene.image} alt={scene.title} className="scene-img" />}
                  <div className="scene-prompt-box">
                    <textarea
                      value={scene.prompt}
                      onChange={(e) => updateScene(scene.id, 'prompt', e.target.value)}
                      rows={3}
                      className="scene-prompt"
                    />
                    <button onClick={() => copyPrompt(scene.prompt)} className="btn-copy">📋 Copy</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
