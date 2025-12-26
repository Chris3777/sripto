import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

// Simple SVG Icons
const Icons = {
  Send: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>,
  Image: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
  Audio: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Trash: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/></svg>,
  Close: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ChevronRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6"/></svg>,
  ChevronLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15,18 9,12 15,6"/></svg>,
  Wand: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 4V2M15 16v-2M8 9h2M20 9h2M3 21l9-9"/><circle cx="15" cy="9" r="3"/></svg>,
  Film: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/></svg>,
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Brain: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>,
};

// Hugging Face API - Simple implementation
const HF_API = {
  generateImage: async (prompt, model) => {
    const modelMap = {
      'flux': 'black-forest-labs/FLUX.1-schnell',
      'sdxl': 'stabilityai/stable-diffusion-xl-base-1.0',
    };
    const modelId = modelMap[model] || modelMap['flux'];
    
    const res = await fetch('https://api-inference.huggingface.co/models/' + modelId, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt }),
    });
    
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Image generation failed');
    }
    
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  },
  
  generateSpeech: async (text) => {
    const res = await fetch('https://api-inference.huggingface.co/models/suno/bark-small', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: text }),
    });
    
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Speech generation failed');
    }
    
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  },
  
  chat: async (userMessage) => {
    const res = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inputs: '[INST] You are VWPS AI assistant. Help create video content. ' + userMessage + ' [/INST]',
        parameters: { max_new_tokens: 512, temperature: 0.7, return_full_text: false }
      }),
    });
    
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Chat failed');
    }
    
    const result = await res.json();
    return result[0]?.generated_text || 'No response';
  },
};

// Admin config
const ADMIN_KEY = 'chris-vwps-admin-2024';
const ADMIN_EMAILS = ['chris@example.com', 'admin@sripto.com', 'chris3777@gmail.com'];

function App() {
  // State
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toasts, setToasts] = useState([]);
  
  const [projectName, setProjectName] = useState('Untitled Project');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imageModel, setImageModel] = useState('flux');
  
  const [scenes, setScenes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [generating, setGenerating] = useState({});
  
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: 'Welcome to VWPS! Powered by Hugging Face AI. Ask me to help create scenes for your video.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const chatEnd = useRef(null);

  // Toast
  const toast = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);

  // Admin check
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const key = params.get('admin_key') || localStorage.getItem('vwps_admin');
      if (key === ADMIN_KEY) {
        setIsAdmin(true);
        localStorage.setItem('vwps_admin', key);
      }
    } catch (e) { console.log(e); }
  }, []);

  // Scroll chat
  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const sendMsg = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(p => [...p, { id: Date.now(), role: 'user', content: userMsg }]);
    setLoading(true);
    
    try {
      const reply = await HF_API.chat(userMsg);
      setMessages(p => [...p, { id: Date.now(), role: 'assistant', content: reply }]);
    } catch (e) {
      setMessages(p => [...p, { id: Date.now(), role: 'assistant', content: 'Error: ' + e.message }]);
    }
    setLoading(false);
  };

  // Generate image
  const genImage = async (id) => {
    const scene = scenes.find(s => s.id === id);
    if (!scene) return;
    setGenerating(p => ({ ...p, [id]: 'image' }));
    
    try {
      const prompt = 'Cinematic film still, ' + scene.description + ', professional cinematography, 8k';
      const url = await HF_API.generateImage(prompt, imageModel);
      setScenes(p => p.map(s => s.id === id ? { ...s, imageUrl: url } : s));
      toast('Image generated!', 'success');
    } catch (e) {
      toast(e.message, 'error');
    }
    setGenerating(p => ({ ...p, [id]: null }));
  };

  // Generate audio
  const genAudio = async (id) => {
    const scene = scenes.find(s => s.id === id);
    if (!scene?.narration) { toast('Add narration first', 'warning'); return; }
    setGenerating(p => ({ ...p, [id]: 'audio' }));
    
    try {
      const url = await HF_API.generateSpeech(scene.narration);
      setScenes(p => p.map(s => s.id === id ? { ...s, audioUrl: url } : s));
      toast('Audio generated!', 'success');
    } catch (e) {
      toast(e.message, 'error');
    }
    setGenerating(p => ({ ...p, [id]: null }));
  };

  // Scene management
  const addScene = () => {
    const s = { id: Date.now(), num: scenes.length + 1, title: 'Scene ' + (scenes.length + 1), description: '', narration: '', duration: 5 };
    setScenes(p => [...p, s]);
    setSelectedId(s.id);
  };

  const updateScene = (id, data) => setScenes(p => p.map(s => s.id === id ? { ...s, ...data } : s));
  const deleteScene = (id) => { setScenes(p => p.filter(s => s.id !== id)); if (selectedId === id) setSelectedId(null); };

  const selected = scenes.find(s => s.id === selectedId);

  // Render
  return (
    <div className="vwps-app">
      {/* Toasts */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={"toast toast-" + t.type}>{t.msg}</div>
        ))}
      </div>

      {/* Admin Modal */}
      {showAdmin && isAdmin && (
        <div className="modal-overlay" onClick={() => setShowAdmin(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Admin - Hugging Face Models</h2>
              <button className="icon-btn" onClick={() => setShowAdmin(false)}><Icons.Close /></button>
            </div>
            <div className="modal-body">
              <label>Image Model</label>
              <select value={imageModel} onChange={e => setImageModel(e.target.value)}>
                <option value="flux">FLUX.1-schnell</option>
                <option value="sdxl">SDXL</option>
              </select>
              <p style={{marginTop: '1rem', color: '#888'}}>Using Hugging Face free API. Models may need 20-30s to warm up.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="vwps-header">
        <div className="header-left">
          <div className="logo">
            <Icons.Film />
            <span>VWPS</span>
            <span className="badge">HuggingFace</span>
          </div>
          <input 
            type="text" 
            value={projectName} 
            onChange={e => setProjectName(e.target.value)}
            placeholder="Project Name"
            className="project-input"
          />
        </div>
        <div className="header-center">
          <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value)}>
            <option value="16:9">16:9</option>
            <option value="9:16">9:16</option>
            <option value="1:1">1:1</option>
          </select>
          <select value={imageModel} onChange={e => setImageModel(e.target.value)}>
            <option value="flux">FLUX.1</option>
            <option value="sdxl">SDXL</option>
          </select>
        </div>
        <div className="header-right">
          {isAdmin && (
            <button className={"icon-btn" + (adminMode ? " active" : "")} onClick={() => setAdminMode(!adminMode)}>
              <Icons.Shield />
            </button>
          )}
          {isAdmin && adminMode && (
            <button className="icon-btn" onClick={() => setShowAdmin(true)}>
              <Icons.Settings />
            </button>
          )}
          <button className="icon-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <Icons.ChevronRight /> : <Icons.ChevronLeft />}
          </button>
        </div>
      </header>

      {/* Main */}
      <div className="vwps-main">
        {/* Sidebar */}
        <aside className={"vwps-sidebar" + (sidebarOpen ? " open" : " closed")}>
          <div className="sidebar-header">
            <h3><Icons.Brain /> AI Assistant</h3>
          </div>
          <div className="chat-messages">
            {messages.map(m => (
              <div key={m.id} className={"chat-message " + m.role}>
                <div className="message-content">{m.content}</div>
              </div>
            ))}
            {loading && <div className="chat-message assistant"><div className="typing">...</div></div>}
            <div ref={chatEnd} />
          </div>
          <div className="chat-input">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && sendMsg()}
              placeholder="Describe a scene..."
              disabled={loading}
            />
            <button onClick={sendMsg} disabled={loading || !input.trim()} className="send-btn">
              <Icons.Send />
            </button>
          </div>
        </aside>

        {/* Canvas */}
        <main className="vwps-canvas">
          <div className="timeline">
            <div className="timeline-header">
              <h3><Icons.Film /> Scenes</h3>
              <button onClick={addScene} className="btn btn-primary">
                <Icons.Plus /> Add Scene
              </button>
            </div>
            <div className="scene-list">
              {scenes.length === 0 ? (
                <div className="empty">
                  <Icons.Film />
                  <p>No scenes yet. Add one or ask the AI!</p>
                </div>
              ) : scenes.map(s => (
                <div 
                  key={s.id} 
                  className={"scene-card" + (selectedId === s.id ? " selected" : "")}
                  onClick={() => setSelectedId(s.id)}
                >
                  <div className="scene-thumb">
                    {s.imageUrl ? <img src={s.imageUrl} alt={s.title} /> : <Icons.Image />}
                    {generating[s.id] && <div className="generating">{generating[s.id]}...</div>}
                  </div>
                  <div className="scene-info">
                    <span className="scene-num">S{s.num}</span>
                    <span className="scene-title">{s.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editor */}
          {selected && (
            <div className="editor">
              <div className="editor-header">
                <input
                  value={selected.title}
                  onChange={e => updateScene(selected.id, { title: e.target.value })}
                  className="title-input"
                  placeholder="Scene Title"
                />
                <button onClick={() => deleteScene(selected.id)} className="icon-btn danger">
                  <Icons.Trash />
                </button>
              </div>
              <div className="editor-body">
                <div className="field">
                  <label>Visual Description</label>
                  <textarea
                    value={selected.description}
                    onChange={e => updateScene(selected.id, { description: e.target.value })}
                    placeholder="Describe the visual scene..."
                    rows={3}
                  />
                  <button onClick={() => genImage(selected.id)} disabled={generating[selected.id] || !selected.description} className="btn btn-primary">
                    <Icons.Wand /> Generate Image
                  </button>
                </div>
                <div className="field">
                  <label>Narration</label>
                  <textarea
                    value={selected.narration}
                    onChange={e => updateScene(selected.id, { narration: e.target.value })}
                    placeholder="Voice-over text..."
                    rows={3}
                  />
                  <button onClick={() => genAudio(selected.id)} disabled={generating[selected.id] || !selected.narration} className="btn btn-secondary">
                    <Icons.Audio /> Generate Voice
                  </button>
                </div>
                {selected.imageUrl && <div className="preview"><img src={selected.imageUrl} alt={selected.title} /></div>}
                {selected.audioUrl && <div className="audio"><audio controls src={selected.audioUrl} /></div>}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
