import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

// Icon components using SVG for consistency
const Icons = {
  Send: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>,
  Image: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
  Video: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M10 9l5 3-5 3V9z"/></svg>,
  Audio: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>,
  Upload: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Trash: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Copy: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Reset: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  User: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  History: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
  Play: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5,3 19,12 5,21"/></svg>,
  Pause: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  Wand: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M17.8 6.2L19 5M3 21l9-9M12.2 6.2L11 5"/></svg>,
  Menu: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Close: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ChevronDown: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6,9 12,15 18,9"/></svg>,
  ChevronRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6"/></svg>,
  Sparkles: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1zM19 10l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5L17 12l1.5-.5.5-1.5z"/></svg>,
  Film: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>,
  Folder: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  Save: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>,
  Zap: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/></svg>,
  Eye: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20,6 9,17 4,12"/></svg>,
  AlertCircle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Bot: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>,
  Layers: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12,2 2,7 12,12 22,7"/><polyline points="2,17 12,22 22,17"/><polyline points="2,12 12,17 22,12"/></svg>,
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Crown: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>,
};

// Admin Configuration
const ADMIN_CONFIG = {
  // Admin emails (add your email here)
  emails: ['chris@example.com', 'admin@sripto.com', 'chris3777@gmail.com'],
  // Secret admin key (can be set via URL param ?admin_key=xxx or localStorage)
  secretKey: 'chris-vwps-admin-2024',
};

function App() {
  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  // Auth State
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  
  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePanel, setActivePanel] = useState('assistant');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  // Project State
  const [projectName, setProjectName] = useState('Untitled Project');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [aiModel, setAiModel] = useState('gpt-image-1');
  
  // Scenes & Script
  const [script, setScript] = useState('');
  const [scenes, setScenes] = useState([]);
  const [selectedSceneId, setSelectedSceneId] = useState(null);
  
  // AI Assistant State
  const [chatMessages, setChatMessages] = useState([
    { 
      id: 1, 
      role: 'assistant', 
      content: "Welcome to VWPS! I'm Chris, your AI video production assistant. I can help you:\n\nâ¢ **Write scripts** - Tell me your idea and I'll create a full scenario\nâ¢ **Generate images** - I'll create visuals for each scene\nâ¢ **Plan shots** - I'll suggest camera angles and compositions\nâ¢ **Create videos** - Turn your images into animated clips\n\nWhat would you like to create today?",
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [assistantMode, setAssistantMode] = useState('auto');
  
  // Generation State
  const [generating, setGenerating] = useState({});
  const [generationProgress, setGenerationProgress] = useState(0);
  
  // History
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Preview
  const [previewScene, setPreviewScene] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  
  // Refs
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Check admin status on load
  useEffect(() => {
    checkAdminStatus();
  }, []);

  // Admin detection logic
  const checkAdminStatus = () => {
    // Check localStorage for admin key
    const storedAdminKey = localStorage.getItem('vwps_admin_key');
    
    // Check URL params for admin key
    const urlParams = new URLSearchParams(window.location.search);
    const urlAdminKey = urlParams.get('admin_key');
    
    // If URL has admin key, store it
    if (urlAdminKey === ADMIN_CONFIG.secretKey) {
      localStorage.setItem('vwps_admin_key', urlAdminKey);
      setIsAdmin(true);
      setAdminMode(true);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }
    
    // Check stored key
    if (storedAdminKey === ADMIN_CONFIG.secretKey) {
      setIsAdmin(true);
      const savedAdminMode = localStorage.getItem('vwps_admin_mode') === 'true';
      setAdminMode(savedAdminMode);
      return;
    }
    
    // Check user email
    const savedUser = localStorage.getItem('vwps_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (ADMIN_CONFIG.emails.includes(userData.email?.toLowerCase())) {
        setIsAdmin(true);
        const savedAdminMode = localStorage.getItem('vwps_admin_mode') === 'true';
        setAdminMode(savedAdminMode);
      }
    }
  };

  // Toggle admin mode
  const toggleAdminMode = () => {
    const newMode = !adminMode;
    setAdminMode(newMode);
    localStorage.setItem('vwps_admin_mode', newMode.toString());
    showToast(newMode ? 'Admin mode enabled - All limits bypassed' : 'Admin mode disabled', 'info');
  };

  // Set admin key manually (for initial setup)
  const setAdminKey = (key) => {
    if (key === ADMIN_CONFIG.secretKey) {
      localStorage.setItem('vwps_admin_key', key);
      setIsAdmin(true);
      setAdminMode(true);
      showToast('Admin access granted!', 'success');
      return true;
    }
    showToast('Invalid admin key', 'error');
    return false;
  };

  // Clear admin access
  const clearAdminAccess = () => {
    localStorage.removeItem('vwps_admin_key');
    localStorage.removeItem('vwps_admin_mode');
    setIsAdmin(false);
    setAdminMode(false);
    showToast('Admin access cleared', 'info');
  };

  // Check if action is allowed (for future rate limiting)
  const canPerformAction = (actionType) => {
    // Admins bypass all limits
    if (adminMode) return true;
    
    // Future: Add rate limiting logic for non-admins
    // For now, allow all actions
    return true;
  };

  // Initialize and load saved data
  useEffect(() => {
    const savedUser = localStorage.getItem('vwps_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      // Re-check admin status with user data
      if (ADMIN_CONFIG.emails.includes(userData.email?.toLowerCase())) {
        setIsAdmin(true);
      }
    }
    
    const savedHistory = localStorage.getItem('vwps_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
    
    const savedProject = localStorage.getItem('vwps_current_project');
    if (savedProject) {
      const project = JSON.parse(savedProject);
      setProjectName(project.name || 'Untitled Project');
      setScenes(project.scenes || []);
      setScript(project.script || '');
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (scenes.length > 0 || script) {
      localStorage.setItem('vwps_current_project', JSON.stringify({
        name: projectName,
        scenes,
        script,
        updatedAt: new Date().toISOString()
      }));
    }
  }, [scenes, script, projectName]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const handleLogin = async () => {
    setAuthLoading(true);
    try {
      const isSignedIn = await window.puter?.auth?.isSignedIn();
      if (!isSignedIn) {
        await window.puter?.auth?.signIn();
      }
      const puterUser = await window.puter?.auth?.getUser();
      if (puterUser) {
        const userData = { 
          id: puterUser.uuid, 
          name: puterUser.username,
          email: puterUser.email 
        };
        setUser(userData);
        localStorage.setItem('vwps_user', JSON.stringify(userData));
        
        // Check if user is admin
        if (ADMIN_CONFIG.emails.includes(userData.email?.toLowerCase())) {
          setIsAdmin(true);
          showToast('Welcome back, Admin!', 'success');
        } else {
          showToast('Welcome back, ' + userData.name + '!', 'success');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      const localUser = { id: 'local-' + Date.now(), name: 'Guest User', email: '' };
      setUser(localUser);
      localStorage.setItem('vwps_user', JSON.stringify(localUser));
      showToast('Continuing as guest', 'info');
    }
    setAuthLoading(false);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('vwps_user');
    // Don't clear admin if set via key
    if (!localStorage.getItem('vwps_admin_key')) {
      setIsAdmin(false);
      setAdminMode(false);
    }
    showToast('Logged out successfully', 'info');
  };

  const getAspectConfig = () => {
    const configs = {
      '16:9': { width: 1280, height: 720, label: 'Landscape (16:9)' },
      '9:16': { width: 720, height: 1280, label: 'Portrait (9:16)' },
      '1:1': { width: 1024, height: 1024, label: 'Square (1:1)' },
      '4:3': { width: 1024, height: 768, label: 'Standard (4:3)' }
    };
    return configs[aspectRatio] || configs['16:9'];
  };
  // Smart AI Assistant - processes user requests and takes actions
  const processAssistantCommand = async (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Detect intent
    const intents = {
      generateScript: /(?:write|create|generate|make).*(?:script|story|scenario|scene)/i,
      generateImages: /(?:generate|create|make).*(?:image|visual|picture|frame)/i,
      generateVideo: /(?:generate|create|make|convert).*(?:video|animation|clip)/i,
      generateAudio: /(?:generate|create|make|add).*(?:audio|narration|voiceover|voice)/i,
      parseScript: /(?:parse|break|split|divide).*(?:script|text|story)/i,
      exportProject: /(?:export|download|save).*(?:project|all|everything)/i,
      newProject: /(?:new|fresh|start|reset).*(?:project)/i,
      help: /(?:help|how|what can|tutorial)/i
    };

    let detectedIntent = null;
    for (const [intent, pattern] of Object.entries(intents)) {
      if (pattern.test(lowerMessage)) {
        detectedIntent = intent;
        break;
      }
    }

    return detectedIntent;
  };

  // AI Chat Handler with Smart Actions
  const sendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    
    const userMessage = chatInput.trim();
    const userMsgId = Date.now();
    
    setChatInput('');
    setChatMessages(prev => [...prev, { 
      id: userMsgId, 
      role: 'user', 
      content: userMessage,
      timestamp: new Date()
    }]);
    setChatLoading(true);

    try {
      // Detect user intent for smart actions
      const intent = await processAssistantCommand(userMessage);
      
      // Build context-aware system prompt
      const systemPrompt = `You are Chris, an expert AI video production assistant for VWPS (Video Workplace Studio). You help users create professional videos through:

CAPABILITIES:
1. Script Writing - Create compelling narratives, commercials, stories
2. Scene Planning - Break scripts into visual scenes with shot descriptions
3. Visual Direction - Suggest camera angles, lighting, composition
4. Production Guidance - Guide through the video creation workflow

CURRENT PROJECT STATE:
- Project: ${projectName}
- Scenes: ${scenes.length} scenes created
- Aspect Ratio: ${aspectRatio}
- Mode: ${assistantMode === 'auto' ? 'Automatic (you drive the process)' : 'Manual (user controls)'}

RESPONSE GUIDELINES:
- Be concise but helpful
- When creating scripts, format them as numbered scenes
- Each scene should have: visual description, action, dialogue (if any), mood
- Proactively suggest next steps
- Use markdown for formatting

DETECTED INTENT: ${intent || 'general conversation'}

If the user wants to generate content and you're in auto mode, describe what you'll create and format scenes as:

**Scene 1: [Title]**
Visual: [Detailed visual description for AI image generation]
Action: [What happens]
Duration: [Suggested seconds]
Audio: [Narration or sound]`;

      const response = await window.puter.ai.chat([
        { role: 'system', content: systemPrompt },
        ...chatMessages.slice(-10).map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage }
      ], { model: 'gpt-4o-mini' });

      const assistantContent = response.message?.content || response.toString();
      
      setChatMessages(prev => [...prev, { 
        id: Date.now(), 
        role: 'assistant', 
        content: assistantContent,
        timestamp: new Date(),
        intent
      }]);

      // Auto-actions in auto mode
      if (assistantMode === 'auto' && intent) {
        await handleAutoAction(intent, assistantContent, userMessage);
      }

    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev, { 
        id: Date.now(), 
        role: 'assistant', 
        content: 'I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true
      }]);
    }
    
    setChatLoading(false);
  };

  // Handle automatic actions based on intent
  const handleAutoAction = async (intent, response, originalMessage) => {
    switch (intent) {
      case 'generateScript':
        // Extract scenes from the response
        const sceneMatches = response.match(/\*\*Scene \d+[^*]*\*\*[\s\S]*?(?=\*\*Scene|$)/g);
        if (sceneMatches && sceneMatches.length > 0) {
          const newScenes = sceneMatches.map((sceneText, index) => {
            const visualMatch = sceneText.match(/Visual:\s*([^\n]+)/i);
            const actionMatch = sceneText.match(/Action:\s*([^\n]+)/i);
            const durationMatch = sceneText.match(/Duration:\s*(\d+)/i);
            const audioMatch = sceneText.match(/Audio:\s*([^\n]+)/i);
            
            return {
              id: Date.now() + index,
              number: index + 1,
              title: sceneText.match(/\*\*Scene \d+:\s*([^*]+)\*\*/)?.[1]?.trim() || `Scene ${index + 1}`,
              description: visualMatch?.[1]?.trim() || sceneText.substring(0, 200),
              action: actionMatch?.[1]?.trim() || '',
              duration: parseInt(durationMatch?.[1]) || 5,
              narration: audioMatch?.[1]?.trim() || '',
              imageUrl: null,
              videoUrl: null,
              audioUrl: null,
              status: 'ready'
            };
          });
          
          setScenes(newScenes);
          showToast(`Created ${newScenes.length} scenes from script`, 'success');
          
          // Auto-generate images if in full auto mode
          setTimeout(() => {
            setChatMessages(prev => [...prev, {
              id: Date.now(),
              role: 'assistant',
              content: `I've created ${newScenes.length} scenes. Would you like me to generate images for all scenes now?`,
              timestamp: new Date(),
              actions: [
                { label: 'Generate All Images', action: 'generateAllImages' },
                { label: 'Review First', action: 'review' }
              ]
            }]);
          }, 500);
        }
        break;
        
      case 'parseScript':
        parseScriptToScenes();
        break;
    }
  };

  // Parse script text into scenes
  const parseScriptToScenes = () => {
    if (!script.trim()) {
      showToast('Please enter a script first', 'warning');
      return;
    }
    
    const parts = script.split(/\n\n+|(?=\d+\.\s)|(?=Scene\s*\d+)/i).filter(p => p.trim());
    
    const newScenes = parts.map((text, index) => ({
      id: Date.now() + index,
      number: index + 1,
      title: `Scene ${index + 1}`,
      description: text.trim(),
      action: '',
      duration: 5,
      narration: text.trim(),
      imageUrl: null,
      videoUrl: null,
      audioUrl: null,
      status: 'ready'
    }));
    
    setScenes(newScenes);
    showToast(`Parsed ${newScenes.length} scenes`, 'success');
  };

  // Generate image for a scene using Puter.js
  const generateSceneImage = async (sceneId) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene) return;

    setGenerating(prev => ({ ...prev, [sceneId]: 'image' }));
    
    try {
      const enhancedPrompt = `Cinematic film still, ${scene.description}, professional cinematography, ${aspectRatio} aspect ratio, 8k ultra detailed, dramatic lighting, movie quality`;
      
      const imageElement = await window.puter.ai.txt2img(enhancedPrompt, {
        model: aiModel,
        quality: 'high'
      });

      setScenes(prev => prev.map(s => 
        s.id === sceneId 
          ? { ...s, imageUrl: imageElement.src, status: 'image-ready' }
          : s
      ));
      
      showToast(`Image generated for Scene ${scene.number}`, 'success');
    } catch (error) {
      console.error('Image generation error:', error);
      showToast('Image generation failed', 'error');
    }
    
    setGenerating(prev => ({ ...prev, [sceneId]: null }));
  };

  // Generate all scene images
  const generateAllImages = async () => {
    const scenesToGenerate = scenes.filter(s => !s.imageUrl);
    if (scenesToGenerate.length === 0) {
      showToast('All scenes already have images', 'info');
      return;
    }

    setGenerationProgress(0);
    
    for (let i = 0; i < scenesToGenerate.length; i++) {
      await generateSceneImage(scenesToGenerate[i].id);
      setGenerationProgress(Math.round(((i + 1) / scenesToGenerate.length) * 100));
    }
    
    setGenerationProgress(0);
    showToast('All images generated!', 'success');
  };

  // Generate audio narration for a scene
  const generateSceneAudio = async (sceneId) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene || !scene.narration) {
      showToast('Scene needs narration text', 'warning');
      return;
    }

    setGenerating(prev => ({ ...prev, [sceneId]: 'audio' }));
    
    try {
      const audio = await window.puter.ai.txt2speech(scene.narration, {
        voice: 'alloy',
        provider: 'openai'
      });

      setScenes(prev => prev.map(s => 
        s.id === sceneId 
          ? { ...s, audioUrl: audio.src, status: 'audio-ready' }
          : s
      ));
      
      showToast(`Audio generated for Scene ${scene.number}`, 'success');
    } catch (error) {
      console.error('Audio generation error:', error);
      showToast('Audio generation failed', 'error');
    }
    
    setGenerating(prev => ({ ...prev, [sceneId]: null }));
  };

  // Generate video for a scene
  const generateSceneVideo = async (sceneId) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene) return;

    setGenerating(prev => ({ ...prev, [sceneId]: 'video' }));
    showToast('Starting video generation (this may take a minute)...', 'info');
    
    try {
      const sizeMap = {
        '16:9': '1280x720',
        '9:16': '720x1280',
        '1:1': '1024x1024',
        '4:3': '1024x768'
      };
      
      const video = await window.puter.ai.txt2vid(scene.description, {
        model: 'sora-2',
        seconds: Math.min(scene.duration, 8),
        size: sizeMap[aspectRatio] || '1280x720'
      });

      setScenes(prev => prev.map(s => 
        s.id === sceneId 
          ? { ...s, videoUrl: video.src, status: 'video-ready' }
          : s
      ));
      
      setVideoPreview(video.src);
      showToast(`Video generated for Scene ${scene.number}`, 'success');
    } catch (error) {
      console.error('Video generation error:', error);
      showToast('Video generation failed', 'error');
    }
    
    setGenerating(prev => ({ ...prev, [sceneId]: null }));
  };
  // Scene CRUD operations
  const addScene = () => {
    const newScene = {
      id: Date.now(),
      number: scenes.length + 1,
      title: `Scene ${scenes.length + 1}`,
      description: '',
      action: '',
      duration: 5,
      narration: '',
      imageUrl: null,
      videoUrl: null,
      audioUrl: null,
      status: 'ready'
    };
    setScenes(prev => [...prev, newScene]);
    setSelectedSceneId(newScene.id);
    showToast('Scene added', 'success');
  };

  const updateScene = (id, updates) => {
    setScenes(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteScene = (id) => {
    setScenes(prev => {
      const filtered = prev.filter(s => s.id !== id);
      return filtered.map((s, i) => ({ ...s, number: i + 1 }));
    });
    if (selectedSceneId === id) setSelectedSceneId(null);
    showToast('Scene deleted', 'info');
  };

  const duplicateScene = (id) => {
    const scene = scenes.find(s => s.id === id);
    if (!scene) return;
    
    const newScene = {
      ...scene,
      id: Date.now(),
      number: scenes.length + 1,
      title: scene.title + ' (Copy)',
      imageUrl: null,
      videoUrl: null,
      audioUrl: null,
      status: 'ready'
    };
    setScenes(prev => [...prev, newScene]);
    showToast('Scene duplicated', 'success');
  };

  const resetScene = (id) => {
    setScenes(prev => prev.map(s => 
      s.id === id 
        ? { ...s, imageUrl: null, videoUrl: null, audioUrl: null, status: 'ready' }
        : s
    ));
    showToast('Scene reset', 'info');
  };

  const moveScene = (id, direction) => {
    const index = scenes.findIndex(s => s.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= scenes.length) return;
    
    const newScenes = [...scenes];
    [newScenes[index], newScenes[newIndex]] = [newScenes[newIndex], newScenes[index]];
    setScenes(newScenes.map((s, i) => ({ ...s, number: i + 1 })));
  };

  // Upload reference image
  const handleImageUpload = (e, sceneId) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      if (sceneId) {
        updateScene(sceneId, { imageUrl: reader.result, status: 'image-ready' });
        showToast('Image uploaded', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Export functions
  const downloadImage = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadScript = () => {
    const content = scenes.map(s => 
      `=== Scene ${s.number}: ${s.title} ===\n\nVisual Description:\n${s.description}\n\nAction:\n${s.action || 'N/A'}\n\nNarration:\n${s.narration || 'N/A'}\n\nDuration: ${s.duration}s\n`
    ).join('\n' + '='.repeat(50) + '\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    downloadImage(url, `${projectName.replace(/\s+/g, '_')}_script.txt`);
    URL.revokeObjectURL(url);
    showToast('Script downloaded', 'success');
  };

  const downloadAllImages = async () => {
    const scenesWithImages = scenes.filter(s => s.imageUrl);
    if (scenesWithImages.length === 0) {
      showToast('No images to download', 'warning');
      return;
    }
    
    scenesWithImages.forEach((scene, index) => {
      setTimeout(() => {
        downloadImage(scene.imageUrl, `scene_${scene.number}_${scene.title.replace(/\s+/g, '_')}.png`);
      }, index * 300);
    });
    showToast(`Downloading ${scenesWithImages.length} images`, 'success');
  };

  const exportProject = () => {
    const projectData = {
      name: projectName,
      aspectRatio,
      scenes: scenes.map(s => ({
        ...s,
        imageUrl: s.imageUrl ? '[IMAGE DATA]' : null,
        videoUrl: s.videoUrl ? '[VIDEO DATA]' : null,
        audioUrl: s.audioUrl ? '[AUDIO DATA]' : null
      })),
      script,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    downloadImage(url, `${projectName.replace(/\s+/g, '_')}_project.json`);
    URL.revokeObjectURL(url);
    showToast('Project exported', 'success');
  };

  // History management
  const saveToHistory = () => {
    const historyItem = {
      id: Date.now(),
      name: projectName,
      scenes: scenes.length,
      thumbnail: scenes[0]?.imageUrl || null,
      savedAt: new Date().toISOString()
    };
    
    const newHistory = [historyItem, ...history.slice(0, 19)];
    setHistory(newHistory);
    localStorage.setItem('vwps_history', JSON.stringify(newHistory));
    showToast('Project saved to history', 'success');
  };

  const loadFromHistory = (historyItem) => {
    const savedProjects = JSON.parse(localStorage.getItem('vwps_projects') || '{}');
    const project = savedProjects[historyItem.id];
    if (project) {
      setProjectName(project.name);
      setScenes(project.scenes);
      setScript(project.script || '');
      showToast('Project loaded', 'success');
    }
    setShowHistory(false);
  };

  const deleteFromHistory = (id) => {
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    localStorage.setItem('vwps_history', JSON.stringify(newHistory));
  };

  // New project
  const newProject = () => {
    if (scenes.length > 0) {
      saveToHistory();
    }
    setProjectName('Untitled Project');
    setScenes([]);
    setScript('');
    setSelectedSceneId(null);
    setVideoPreview(null);
    showToast('New project created', 'success');
  };

  // Handle chat action buttons
  const handleChatAction = (action) => {
    switch (action) {
      case 'generateAllImages':
        generateAllImages();
        break;
      case 'review':
        setActivePanel('scenes');
        break;
    }
  };

  // Quick prompts for the assistant
  const quickPrompts = [
    { label: 'Write a Script', prompt: 'Write a 30-second commercial script about ' },
    { label: 'Product Demo', prompt: 'Create a product demonstration video script for ' },
    { label: 'Story', prompt: 'Write a short cinematic story about ' },
    { label: 'Tutorial', prompt: 'Create a tutorial video script explaining how to ' },
    { label: 'Social Media', prompt: 'Write a viral social media video script about ' }
  ];
  // Selected scene for detail view
  const selectedScene = scenes.find(s => s.id === selectedSceneId);

  return (
    <div className="vwps-app">
      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span className="toast-icon">
              {toast.type === 'success' && <Icons.Check />}
              {toast.type === 'error' && <Icons.AlertCircle />}
              {toast.type === 'warning' && <Icons.AlertCircle />}
              {toast.type === 'info' && <Icons.AlertCircle />}
            </span>
            <span className="toast-message">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Admin Badge */}
      {adminMode && (
        <div className="admin-badge" onClick={() => setShowAdminPanel(true)}>
          <Icons.Crown />
          <span>Admin</span>
        </div>
      )}

      {/* Admin Panel Modal */}
      {showAdminPanel && isAdmin && (
        <div className="modal-overlay" onClick={() => setShowAdminPanel(false)}>
          <div className="modal admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><Icons.Shield /> Admin Panel</h3>
              <button className="close-btn" onClick={() => setShowAdminPanel(false)}>
                <Icons.Close />
              </button>
            </div>
            <div className="modal-content">
              <div className="admin-section">
                <h4>Admin Mode</h4>
                <p>When enabled, all limits, watermarks, and restrictions are bypassed.</p>
                <div className="admin-toggle">
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={adminMode} 
                      onChange={toggleAdminMode}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className={`toggle-label ${adminMode ? 'active' : ''}`}>
                    {adminMode ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              
              <div className="admin-section">
                <h4>Admin Status</h4>
                <div className="admin-info">
                  <p><strong>User:</strong> {user?.name || 'Guest'}</p>
                  <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
                  <p><strong>Admin Access:</strong> {isAdmin ? 'Granted' : 'Denied'}</p>
                </div>
              </div>
              
              <div className="admin-section">
                <h4>Quick Actions</h4>
                <div className="admin-actions">
                  <button className="btn btn-secondary" onClick={() => { localStorage.clear(); window.location.reload(); }}>
                    <Icons.Trash /> Clear All Data
                  </button>
                  <button className="btn btn-secondary" onClick={clearAdminAccess}>
                    <Icons.Close /> Revoke Admin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="vwps-header">
        <div className="header-left">
          <button className="menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Icons.Menu />
          </button>
          <div className="logo">
            <Icons.Film />
            <span>VWPS</span>
          </div>
          <div className="project-info">
            <input
              type="text"
              className="project-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project Name"
            />
          </div>
        </div>
        
        <div className="header-center">
          <div className="aspect-selector">
            <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
              <option value="16:9">16:9 Landscape</option>
              <option value="9:16">9:16 Portrait</option>
              <option value="1:1">1:1 Square</option>
              <option value="4:3">4:3 Standard</option>
            </select>
          </div>
          <div className="model-selector">
            <select value={aiModel} onChange={(e) => setAiModel(e.target.value)}>
              <option value="gpt-image-1">GPT Image</option>
              <option value="dall-e-3">DALL-E 3</option>
              <option value="flux-1.1-pro">Flux Pro</option>
            </select>
          </div>
        </div>

        <div className="header-right">
          {/* Admin Toggle (only visible to admins) */}
          {isAdmin && (
            <button 
              className={`icon-btn admin-toggle-btn ${adminMode ? 'active' : ''}`}
              onClick={toggleAdminMode}
              title={adminMode ? 'Admin Mode ON' : 'Admin Mode OFF'}
            >
              <Icons.Shield />
            </button>
          )}
          
          <button className="icon-btn" onClick={saveToHistory} title="Save Project">
            <Icons.Save />
          </button>
          <button className="icon-btn" onClick={() => setShowHistory(true)} title="History">
            <Icons.History />
          </button>
          <button className="icon-btn" onClick={newProject} title="New Project">
            <Icons.Plus />
          </button>
          {user ? (
            <div className="user-menu">
              <button className="user-btn" onClick={handleLogout}>
                <Icons.User />
                <span>{user.name}</span>
                {isAdmin && <span className="user-admin-badge">Admin</span>}
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={handleLogin}>
              <Icons.User />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Layout */}
      <div className="vwps-main">
        {/* Left Sidebar - Navigation */}
        <aside className={`vwps-sidebar ${sidebarOpen ? 'open' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activePanel === 'assistant' ? 'active' : ''}`}
              onClick={() => { setActivePanel('assistant'); setMobileMenuOpen(false); }}
            >
              <Icons.Bot />
              <span>AI Assistant</span>
            </button>
            <button 
              className={`nav-item ${activePanel === 'script' ? 'active' : ''}`}
              onClick={() => { setActivePanel('script'); setMobileMenuOpen(false); }}
            >
              <Icons.Layers />
              <span>Script</span>
            </button>
            <button 
              className={`nav-item ${activePanel === 'scenes' ? 'active' : ''}`}
              onClick={() => { setActivePanel('scenes'); setMobileMenuOpen(false); }}
            >
              <Icons.Film />
              <span>Scenes</span>
              {scenes.length > 0 && <span className="badge">{scenes.length}</span>}
            </button>
            <button 
              className={`nav-item ${activePanel === 'export' ? 'active' : ''}`}
              onClick={() => { setActivePanel('export'); setMobileMenuOpen(false); }}
            >
              <Icons.Download />
              <span>Export</span>
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="mode-toggle">
              <span>Mode:</span>
              <button 
                className={`mode-btn ${assistantMode === 'auto' ? 'active' : ''}`}
                onClick={() => setAssistantMode('auto')}
              >
                Auto
              </button>
              <button 
                className={`mode-btn ${assistantMode === 'manual' ? 'active' : ''}`}
                onClick={() => setAssistantMode('manual')}
              >
                Manual
              </button>
            </div>
            
            {/* Admin indicator in sidebar */}
            {isAdmin && (
              <div className="sidebar-admin-indicator" onClick={() => setShowAdminPanel(true)}>
                <Icons.Crown />
                <span>{adminMode ? 'Admin Active' : 'Admin Available'}</span>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="vwps-content">
          {/* AI Assistant Panel */}
          {activePanel === 'assistant' && (
            <div className="panel assistant-panel">
              <div className="panel-header">
                <div className="assistant-header">
                  <div className="assistant-avatar">
                    <Icons.Bot />
                  </div>
                  <div className="assistant-info">
                    <h2>Chris - VWPS Assistant</h2>
                    <span className="assistant-status">
                      <span className="status-dot"></span>
                      {chatLoading ? 'Thinking...' : 'Online'}
                      {adminMode && <span className="admin-status-badge">Admin Mode</span>}
                    </span>
                  </div>
                </div>
              </div>

              <div className="chat-messages">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`chat-message ${msg.role}`}>
                    {msg.role === 'assistant' && (
                      <div className="message-avatar">
                        <Icons.Bot />
                      </div>
                    )}
                    <div className="message-content">
                      <div className="message-text" dangerouslySetInnerHTML={{ 
                        __html: msg.content
                          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n/g, '<br/>')
                          .replace(/â¢ /g, '&bull; ')
                      }} />
                      {msg.actions && (
                        <div className="message-actions">
                          {msg.actions.map((action, i) => (
                            <button 
                              key={i}
                              className="action-btn"
                              onClick={() => handleChatAction(action.action)}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                      <span className="message-time">
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="chat-message assistant">
                    <div className="message-avatar"><Icons.Bot /></div>
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span><span></span><span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="quick-prompts">
                {quickPrompts.map((qp, i) => (
                  <button 
                    key={i} 
                    className="quick-prompt"
                    onClick={() => setChatInput(qp.prompt)}
                  >
                    <Icons.Sparkles />
                    {qp.label}
                  </button>
                ))}
              </div>

              <div className="chat-input-area">
                <textarea
                  className="chat-input"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Tell Chris what you want to create..."
                  rows={3}
                />
                <button 
                  className="send-btn"
                  onClick={sendMessage}
                  disabled={!chatInput.trim() || chatLoading}
                >
                  <Icons.Send />
                </button>
              </div>
            </div>
          )}
          {/* Script Panel */}
          {activePanel === 'script' && (
            <div className="panel script-panel">
              <div className="panel-header">
                <h2><Icons.Layers /> Script Editor</h2>
                <div className="panel-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={parseScriptToScenes}
                    disabled={!script.trim()}
                  >
                    <Icons.Wand />
                    Parse to Scenes
                  </button>
                </div>
              </div>
              <div className="script-editor">
                <textarea
                  className="script-textarea"
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder="Paste or write your script here...\n\nTip: Use numbered scenes (1. Scene one, 2. Scene two) or separate with blank lines for automatic parsing.\n\nOr ask the AI Assistant to write one for you!"
                />
              </div>
              <div className="script-tips">
                <h4>Tips:</h4>
                <ul>
                  <li>Number your scenes: "1. Opening shot of..."</li>
                  <li>Include visual descriptions for better AI images</li>
                  <li>Add narration text for voiceover generation</li>
                </ul>
              </div>
            </div>
          )}

          {/* Scenes Panel */}
          {activePanel === 'scenes' && (
            <div className="panel scenes-panel">
              <div className="panel-header">
                <h2><Icons.Film /> Scenes ({scenes.length})</h2>
                <div className="panel-actions">
                  <button className="btn btn-secondary" onClick={addScene}>
                    <Icons.Plus /> Add Scene
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={generateAllImages}
                    disabled={scenes.length === 0 || generationProgress > 0}
                  >
                    <Icons.Wand />
                    {generationProgress > 0 ? `Generating ${generationProgress}%` : 'Generate All Images'}
                  </button>
                </div>
              </div>

              {scenes.length === 0 ? (
                <div className="empty-state">
                  <Icons.Film />
                  <h3>No scenes yet</h3>
                  <p>Use the Script panel to parse text into scenes, or ask the AI Assistant to create them for you.</p>
                  <button className="btn btn-primary" onClick={() => setActivePanel('assistant')}>
                    <Icons.Bot /> Ask AI Assistant
                  </button>
                </div>
              ) : (
                <div className="scenes-grid">
                  {scenes.map((scene) => (
                    <div 
                      key={scene.id} 
                      className={`scene-card ${selectedSceneId === scene.id ? 'selected' : ''}`}
                      onClick={() => setSelectedSceneId(scene.id)}
                    >
                      <div className="scene-card-header">
                        <span className="scene-number">{scene.number}</span>
                        <input
                          type="text"
                          className="scene-title"
                          value={scene.title}
                          onChange={(e) => updateScene(scene.id, { title: e.target.value })}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="scene-card-actions">
                          <button onClick={(e) => { e.stopPropagation(); moveScene(scene.id, 'up'); }} title="Move Up">â</button>
                          <button onClick={(e) => { e.stopPropagation(); moveScene(scene.id, 'down'); }} title="Move Down">â</button>
                          <button onClick={(e) => { e.stopPropagation(); duplicateScene(scene.id); }} title="Duplicate">
                            <Icons.Copy />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); resetScene(scene.id); }} title="Reset">
                            <Icons.Reset />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); deleteScene(scene.id); }} className="delete" title="Delete">
                            <Icons.Trash />
                          </button>
                        </div>
                      </div>

                      <div className="scene-preview">
                        {generating[scene.id] === 'image' ? (
                          <div className="generating-overlay">
                            <div className="spinner"></div>
                            <span>Generating image...</span>
                          </div>
                        ) : scene.imageUrl ? (
                          <>
                            <img src={scene.imageUrl} alt={scene.title} />
                            <div className="preview-overlay">
                              <button onClick={(e) => { e.stopPropagation(); setPreviewScene(scene); }} title="Preview">
                                <Icons.Eye />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); downloadImage(scene.imageUrl, `scene_${scene.number}.png`); }} title="Download">
                                <Icons.Download />
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="empty-preview">
                            <Icons.Image />
                            <span>No image</span>
                          </div>
                        )}
                      </div>

                      <div className="scene-content">
                        <textarea
                          className="scene-description"
                          value={scene.description}
                          onChange={(e) => updateScene(scene.id, { description: e.target.value })}
                          placeholder="Visual description..."
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      <div className="scene-footer">
                        <div className="duration-input">
                          <Icons.Clock />
                          <input
                            type="number"
                            min="1"
                            max="30"
                            value={scene.duration}
                            onChange={(e) => updateScene(scene.id, { duration: parseInt(e.target.value) || 5 })}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span>sec</span>
                        </div>
                        <div className="scene-gen-buttons">
                          <button 
                            className="gen-btn"
                            onClick={(e) => { e.stopPropagation(); generateSceneImage(scene.id); }}
                            disabled={generating[scene.id]}
                            title="Generate Image"
                          >
                            <Icons.Image />
                          </button>
                          <button 
                            className="gen-btn"
                            onClick={(e) => { e.stopPropagation(); generateSceneAudio(scene.id); }}
                            disabled={generating[scene.id] || !scene.narration}
                            title="Generate Audio"
                          >
                            <Icons.Audio />
                          </button>
                          <button 
                            className="gen-btn"
                            onClick={(e) => { e.stopPropagation(); generateSceneVideo(scene.id); }}
                            disabled={generating[scene.id]}
                            title="Generate Video"
                          >
                            <Icons.Video />
                          </button>
                          <label className="gen-btn upload-btn" title="Upload Image">
                            <Icons.Upload />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, scene.id)}
                              onClick={(e) => e.stopPropagation()}
                              style={{ display: 'none' }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Narration Section */}
                      <div className="scene-narration">
                        <textarea
                          className="narration-input"
                          value={scene.narration}
                          onChange={(e) => updateScene(scene.id, { narration: e.target.value })}
                          placeholder="Narration / Voiceover text..."
                          onClick={(e) => e.stopPropagation()}
                        />
                        {scene.audioUrl && (
                          <audio controls src={scene.audioUrl} onClick={(e) => e.stopPropagation()} />
                        )}
                      </div>

                      {/* Status indicators */}
                      <div className="scene-status">
                        <span className={`status-item ${scene.imageUrl ? 'ready' : ''}`} title="Image">
                          <Icons.Image />
                        </span>
                        <span className={`status-item ${scene.audioUrl ? 'ready' : ''}`} title="Audio">
                          <Icons.Audio />
                        </span>
                        <span className={`status-item ${scene.videoUrl ? 'ready' : ''}`} title="Video">
                          <Icons.Video />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Export Panel */}
          {activePanel === 'export' && (
            <div className="panel export-panel">
              <div className="panel-header">
                <h2><Icons.Download /> Export</h2>
              </div>
              
              <div className="export-options">
                <div className="export-card">
                  <Icons.Layers />
                  <h3>Script</h3>
                  <p>Download your script as a text file</p>
                  <button className="btn btn-primary" onClick={downloadScript} disabled={scenes.length === 0}>
                    <Icons.Download /> Download Script
                  </button>
                </div>

                <div className="export-card">
                  <Icons.Image />
                  <h3>All Images</h3>
                  <p>Download all generated scene images</p>
                  <button className="btn btn-primary" onClick={downloadAllImages} disabled={!scenes.some(s => s.imageUrl)}>
                    <Icons.Download /> Download Images
                  </button>
                </div>

                <div className="export-card">
                  <Icons.Folder />
                  <h3>Project File</h3>
                  <p>Export project data as JSON</p>
                  <button className="btn btn-primary" onClick={exportProject} disabled={scenes.length === 0}>
                    <Icons.Download /> Export Project
                  </button>
                </div>

                {videoPreview && (
                  <div className="export-card featured">
                    <Icons.Video />
                    <h3>Generated Video</h3>
                    <video controls src={videoPreview} />
                    <a href={videoPreview} download="vwps-video.mp4" className="btn btn-primary">
                      <Icons.Download /> Download Video
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Preview Modal */}
        {previewScene && (
          <div className="modal-overlay" onClick={() => setPreviewScene(null)}>
            <div className="modal preview-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Scene {previewScene.number}: {previewScene.title}</h3>
                <button className="close-btn" onClick={() => setPreviewScene(null)}>
                  <Icons.Close />
                </button>
              </div>
              <div className="modal-content">
                {previewScene.imageUrl && (
                  <img src={previewScene.imageUrl} alt={previewScene.title} className="preview-image" />
                )}
                <div className="preview-details">
                  <p><strong>Description:</strong> {previewScene.description}</p>
                  {previewScene.narration && <p><strong>Narration:</strong> {previewScene.narration}</p>}
                  <p><strong>Duration:</strong> {previewScene.duration}s</p>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => downloadImage(previewScene.imageUrl, `scene_${previewScene.number}.png`)}>
                  <Icons.Download /> Download
                </button>
                <button className="btn btn-primary" onClick={() => { generateSceneVideo(previewScene.id); setPreviewScene(null); }}>
                  <Icons.Video /> Generate Video
                </button>
              </div>
            </div>
          </div>
        )}

        {/* History Modal */}
        {showHistory && (
          <div className="modal-overlay" onClick={() => setShowHistory(false)}>
            <div className="modal history-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3><Icons.History /> Project History</h3>
                <button className="close-btn" onClick={() => setShowHistory(false)}>
                  <Icons.Close />
                </button>
              </div>
              <div className="modal-content">
                {history.length === 0 ? (
                  <div className="empty-state">
                    <Icons.Folder />
                    <p>No saved projects yet</p>
                  </div>
                ) : (
                  <div className="history-list">
                    {history.map((item) => (
                      <div key={item.id} className="history-item">
                        <div className="history-thumb">
                          {item.thumbnail ? (
                            <img src={item.thumbnail} alt={item.name} />
                          ) : (
                            <Icons.Film />
                          )}
                        </div>
                        <div className="history-info">
                          <h4>{item.name}</h4>
                          <span>{item.scenes} scenes â¢ {new Date(item.savedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="history-actions">
                          <button className="btn btn-primary" onClick={() => loadFromHistory(item)}>Load</button>
                          <button className="btn btn-secondary" onClick={() => deleteFromHistory(item.id)}>
                            <Icons.Trash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleImageUpload(e, selectedSceneId)}
        style={{ display: 'none' }}
      />
    </div>
  );
}

export default App;