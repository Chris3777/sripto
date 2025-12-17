import { useState } from 'react';
import './App.css';

function App() {
  const [uploads, setUploads] = useState({
    reference: { file: null, name: 'Character 1', enabled: true },
    scene: { file: null, name: 'Character 2', enabled: true },
    style: { file: null, name: 'Character 3', enabled: true },
    custom: { file: null, name: 'Character 4', enabled: true }
  });
  
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [prompts, setPrompts] = useState(['']);
  const [results, setResults] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileUpload = (type, file) => {
    setUploads(prev => ({
      ...prev,
      [type]: { ...prev[type], file }
    }));
  };

  const handleNameChange = (type, name) => {
    setUploads(prev => ({
      ...prev,
      [type]: { ...prev[type], name }
    }));
  };

  const handleToggle = (type) => {
    setUploads(prev => ({
      ...prev,
      [type]: { ...prev[type], enabled: !prev[type].enabled }
    }));
  };

  const handlePromptChange = (index, value) => {
    const newPrompts = [...prompts];
    newPrompts[index] = value;
    setPrompts(newPrompts);
  };

  const addPrompt = () => {
    if (prompts.length < 10) {
      setPrompts([...prompts, '']);
    }
  };

  const removePrompt = (index) => {
    const newPrompts = prompts.filter((_, i) => i !== index);
    setPrompts(newPrompts.length ? newPrompts : ['']);
  };

  const generateImages = async () => {
    setIsGenerating(true);
    
    // Simulate image generation with cinematic 4K realistic placeholder
    const newResults = [];
    const date = new Date();
    const dateStr = `${String(date.getDate()).padStart(2, '0')}${date.toLocaleString('en', { month: 'short' })}${date.getFullYear()}`;
    
    prompts.forEach((prompt, index) => {
      if (prompt.trim()) {
        // Create mock result with cinematic parameters
        const result = {
          id: `${String(index + 1).padStart(3, '0')}_${dateStr}`,
          prompt: prompt,
          imageUrl: `https://via.placeholder.com/1920x1080/1a1a1a/00ff00?text=4K+Cinematic+Frame+${index + 1}`,
          script: {
            camera: `${aspectRatio === '16:9' ? 'Widescreen' : aspectRatio === '9:16' ? 'Vertical' : 'Standard'} - 4K Cinema Camera`,
            lighting: 'Cinematic three-point setup with practical lights',
            audio: 'Ambient sound with dramatic score',
            continuity: `Scene ${index + 1} - High realism action sequence`
          },
          timestamp: new Date().toISOString()
        };
        newResults.push(result);
      }
    });
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setResults(prev => [...prev, ...newResults]);
    setIsGenerating(false);
  };

  const downloadAll = () => {
    results.forEach(result => {
      // Create download link for each result
      const link = document.createElement('a');
      link.href = result.imageUrl;
      link.download = `${result.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const exportScript = () => {
    const scriptData = results.map(r => ({
      id: r.id,
      prompt: r.prompt,
      ...r.script
    }));
    
    const blob = new Blob([JSON.stringify(scriptData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `script_${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🎬 SRIPTO</h1>
        <p>4K Cinematic Realistic Action Movie Frame Generator</p>
      </header>

      <div className="container">
        <div className="left-panel">
          <section className="upload-section">
            <h2>Character References</h2>
            {Object.entries(uploads).map(([key, data]) => (
              <div key={key} className="upload-slot">
                <div className="slot-header">
                  <input
                    type="checkbox"
                    checked={data.enabled}
                    onChange={() => handleToggle(key)}
                  />
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => handleNameChange(key, e.target.value)}
                    className="name-input"
                  />
                </div>
                <label className="file-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(key, e.target.files[0])}
                  />
                  <span>{data.file ? data.file.name : `Upload ${key} image`}</span>
                </label>
              </div>
            ))}
          </section>

          <section className="settings-section">
            <h2>Settings</h2>
            <div className="setting-item">
              <label>Aspect Ratio:</label>
              <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
                <option value="16:9">16:9 (Widescreen)</option>
                <option value="9:16">9:16 (Vertical)</option>
                <option value="1:1">1:1 (Square)</option>
                <option value="4:3">4:3 (Standard)</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </section>

          <section className="prompts-section">
            <h2>Scene Prompts</h2>
            {prompts.map((prompt, index) => (
              <div key={index} className="prompt-item">
                <textarea
                  value={prompt}
                  onChange={(e) => handlePromptChange(index, e.target.value)}
                  placeholder={`Prompt ${index + 1}: Describe the cinematic scene...`}
                  rows={3}
                />
                {prompts.length > 1 && (
                  <button onClick={() => removePrompt(index)} className="remove-btn">✕</button>
                )}
              </div>
            ))}
            {prompts.length < 10 && (
              <button onClick={addPrompt} className="add-prompt-btn">+ Add Prompt</button>
            )}
          </section>

          <button 
            onClick={generateImages} 
            className="generate-btn"
            disabled={isGenerating || !prompts.some(p => p.trim())}
          >
            {isGenerating ? 'Generating...' : '🎥 Generate All Frames'}
          </button>
        </div>

        <div className="right-panel">
          <div className="results-header">
            <h2>Generated Frames ({results.length})</h2>
            {results.length > 0 && (
              <div className="export-buttons">
                <button onClick={downloadAll} className="export-btn">⬇ Download All</button>
                <button onClick={exportScript} className="export-btn">📄 Export Script</button>
              </div>
            )}
          </div>

          <div className="results-grid">
            {results.length === 0 ? (
              <div className="empty-state">
                <p>No frames generated yet</p>
                <p className="hint">Add prompts and click Generate to create 4K cinematic frames</p>
              </div>
            ) : (
              results.map(result => (
                <div key={result.id} className="result-card">
                  <img src={result.imageUrl} alt={result.prompt} />
                  <div className="result-info">
                    <h4>{result.id}</h4>
                    <p className="result-prompt">{result.prompt}</p>
                    <div className="script-details">
                      <small><strong>Camera:</strong> {result.script.camera}</small>
                      <small><strong>Lighting:</strong> {result.script.lighting}</small>
                      <small><strong>Audio:</strong> {result.script.audio}</small>
                      <small><strong>Continuity:</strong> {result.script.continuity}</small>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
