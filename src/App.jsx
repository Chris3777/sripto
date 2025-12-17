import { useState } from 'react';
import './App.css';

function App() {
  const [references, setReferences] = useState([
    { id: 1, name: 'Character Reference', file: null, active: true },
    { id: 2, name: 'Scene Reference', file: null, active: true },
    { id: 3, name: 'Style Reference', file: null, active: true },
    { id: 4, name: 'Custom Reference', file: null, active: true }
  ]);
  
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [prompts, setPrompts] = useState('');
  const [frames, setFrames] = useState([]);
  
  const handleFileUpload = (refId, file) => {
    setReferences(refs => refs.map(r => 
      r.id === refId ? { ...r, file } : r
    ));
  };
  
  const handleGenerate = () => {
    const promptList = prompts.split('\n').filter(p => p.trim());
    const newFrames = promptList.map((prompt, i) => ({
      id: i + 1,
      prompt,
      image: null,
      metadata: {
        camera: '',
        lighting: '',
        audio: '',
        continuity: ''
      }
    }));
    setFrames(newFrames);
  };
  
  const exportScript = () => {
    const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '');
    let script = '';
    frames.forEach((frame, i) => {
      const num = String(i + 1).padStart(3, '0');
      script += `FRAME ${num} \u2014 ${date}\n`;
      script += `Visual: ${frame.prompt}\n`;
      if (frame.metadata.camera) script += `Camera: ${frame.metadata.camera}\n`;
      if (frame.metadata.lighting) script += `Lighting: ${frame.metadata.lighting}\n`;
      if (frame.metadata.audio) script += `Audio: ${frame.metadata.audio}\n`;
      if (frame.metadata.continuity) script += `Continuity: ${frame.metadata.continuity}\n`;
      script += '\n';
    });
    return script;
  };
  
  return (
    <div className="app">
      <header className="header">
        <h1>\ud83c\udfa5 Sripto</h1>
        <p>Professional 4K Cinematic Storyboard Tool</p>
      </header>
      
      <div className="container">
        <div className="left-panel">
          <h2>Control Panel</h2>
          
          <section className="section">
            <h3>\ud83d\udcf8 Reference Images</h3>
            {references.map(ref => (
              <div key={ref.id} className="ref-card">
                <input 
                  type="checkbox" 
                  checked={ref.active}
                  onChange={(e) => setReferences(refs => refs.map(r => 
                    r.id === ref.id ? { ...r, active: e.target.checked } : r
                  ))}
                />
                <input 
                  type="text" 
                  value={ref.name}
                  onChange={(e) => setReferences(refs => refs.map(r => 
                    r.id === ref.id ? { ...r, name: e.target.value } : r
                  ))}
                  className="ref-name"
                />
                <label className="upload-btn">
                  + Upload
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(ref.id, e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                </label>
                {ref.file && <span className="file-name">\u2713 {ref.file.name}</span>}
              </div>
            ))}
          </section>
          
          <section className="section">
            <h3>\ud83c\udfac Aspect Ratio</h3>
            <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="select">
              <option>16:9</option>
              <option>9:16</option>
              <option>1:1</option>
              <option>4:3</option>
              <option>Custom</option>
            </select>
          </section>
          
          <section className="section">
            <h3>\ud83d\udcdd Prompt List</h3>
            <textarea 
              value={prompts}
              onChange={(e) => setPrompts(e.target.value)}
              placeholder="Enter detailed cinematic prompts (one per line)\n\nExample:\n4K photoreal cinematic frame \u2014 limousine trunk interior, claustrophobic low light, contrasted with golden horizon outside.\n\nCamera: Interior macro on gorilla\u2019s eyes\nLighting: Cool interior, warm exterior\nAudio: Trunk latch thud, muffled breath\nContinuity: Trunk latch CLOSED"
              className="textarea"
              rows="10"
            />
          </section>
          
          <button onClick={handleGenerate} className="generate-btn">
            \ud83c\udfa8 Generate All Images
          </button>
        </div>
        
        <div className="right-panel">
          <h2>Results Grid</h2>
          
          {frames.length === 0 ? (
            <div className="empty-state">
              <p>\ud83c\udfac Enter prompts and click Generate to create your storyboard</p>
            </div>
          ) : (
            <>
              <div className="frames-grid">
                {frames.map(frame => (
                  <div key={frame.id} className="frame-card">
                    <div className="frame-number">Frame {String(frame.id).padStart(3, '0')}</div>
                    <div className="frame-image-placeholder">
                      {frame.image ? (
                        <img src={frame.image} alt={`Frame ${frame.id}`} />
                      ) : (
                        <div className="upload-zone">
                          <label className="upload-label">
                            + Attach Generated Image
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    setFrames(frs => frs.map(f => 
                                      f.id === frame.id ? { ...f, image: ev.target.result } : f
                                    ));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              style={{ display: 'none' }}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                    <div className="frame-prompt">{frame.prompt}</div>
                  </div>
                ))}
              </div>
              
              <section className="export-section">
                <button onClick={() => {
                  const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '');
                  frames.forEach((frame) => {
                    if (frame.image) {
                      const link = document.createElement('a');
                      link.download = `${String(frame.id).padStart(3, '0')}_${date}.png`;
                      link.href = frame.image;
                      link.click();
                    }
                  });
                }} className="download-btn">
                  \ud83d\udcbe Download All Frames
                </button>
                
                <h3>\ud83d\udcdd Script Export</h3>
                <textarea 
                  value={exportScript()}
                  readOnly
                  className="script-output"
                  rows="15"
                />
              </section>
            </>
          )}
        </div>
      </div>
      
      <footer className="footer">
        <p>Built for creators who demand visual consistency and professional workflow management.</p>
      </footer>
    </div>
  );
}

export default App;
