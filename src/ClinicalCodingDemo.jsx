import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Eye, BookOpen, MessageCircle, Download, FileText, Send, X, ChevronRight } from 'lucide-react';

// Import all screen components (you'll need to copy these from the artifacts)
import EpisodeWorkspaceScreen from './EpisodeWorkspaceScreen';
import OCRReviewScreen from './OCRReviewScreen';
import CodingReferencesScreen from './CodingReferencesScreen';
import ChatWithDocsScreen from './ChatWithDocsScreen';
import ExportAuditScreen from './ExportAuditScreen';

const ClinicalCodingDemo = ({ onBackToMenu }) => {
  const [currentScreen, setCurrentScreen] = useState('workspace');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [demoLoading, setDemoLoading] = useState(true);
  const [particles, setParticles] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: 'I can help you with ICD-10-AM coding, ACHI procedures, and Australian coding standards. Ask about specific diagnoses, procedures, or coding rules!'
    }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [aiError, setAiError] = useState('');

  // Patient data context shared across all screens
  const [patientData] = useState({
    name: 'John Smith',
    id: 'MRN-789012',
    dob: '15/03/1965',
    admission: '12/07/2025',
    discharge: '18/07/2025',
    los: 6,
    separationMode: 'Discharge to usual residence',
    fundingSource: 'Public Patient'
  });

  // Particle animation for Southern Cross theme
  useEffect(() => {
    const initialParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.15 + 0.08,
      opacity: Math.random() * 0.3 + 0.2,
      color: Math.random() > 0.5 ? 'cyan' : 'blue'
    }));
    setParticles(initialParticles);

    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y > 105 ? -5 : particle.y + particle.speed,
        x: particle.x + Math.sin(Date.now() * 0.001 + particle.id) * 0.1
      })));
    }, 50);

    // Initial loading simulation
    setTimeout(() => {
      setDemoLoading(false);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const screens = [
    { 
      id: 'workspace', 
      name: 'Episode Workspace', 
      icon: FileText, 
      description: 'Main coding interface',
      component: EpisodeWorkspaceScreen
    },
    { 
      id: 'ocr', 
      name: 'OCR Review', 
      icon: Eye, 
      description: 'Document transcription',
      component: OCRReviewScreen
    },
    { 
      id: 'references', 
      name: 'Coding References', 
      icon: BookOpen, 
      description: 'Standards & guidelines',
      component: CodingReferencesScreen
    },
    { 
      id: 'chat', 
      name: 'Chat with Docs', 
      icon: MessageCircle, 
      description: 'Clinician communication',
      component: ChatWithDocsScreen
    },
    { 
      id: 'export', 
      name: 'Export & Audit', 
      icon: Download, 
      description: 'Final submission',
      component: ExportAuditScreen
    }
  ];

  const navigateToScreen = (screenId) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreen(screenId);
      setIsTransitioning(false);
    }, 400);
  };

  const handleBackToMenu = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      onBackToMenu();
      setIsTransitioning(false);
    }, 500);
  };

  const handleChatSubmit = async () => {
    const userText = chatMessage.trim();
    if (!userText) return;
    setAiError('');
    const userMsg = { id: Date.now(), role: 'user', text: userText };
    setChatMessages(prev => [...prev, userMsg]);
    setChatMessage('');

    try {
      setIsAiTyping(true);
      const conversation = [...chatMessages, userMsg].map(m => ({
        sender: m.role === 'user' ? 'Clinical Coder' : 'AI Assistant',
        senderType: m.role === 'user' ? 'coder' : 'clinician',
        message: m.text
      }));

      const docsContext = `Patient: ${patientData.name} (${patientData.id})\nDOB: ${patientData.dob}\nEpisode LOS: ${patientData.los} days\nCurrent screen: ${currentScreenData?.name}`;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
          {
            role: 'system',
            content: 'You are an AI assistant helping hospital clinical coders communicate with clinicians.'
          },
          {
            role: 'system',
            content: 'Be concise, professional, and reference clinical facts from the provided docs context when helpful.'
          },
          {
            role: 'system',
            content: 'Follow Australian Coding Standards where relevant. If uncertain, ask a specific follow-up question.'
          },
          {
            role: 'user',
            content: userText
          }
        ],
        max_tokens: 300,
        temperature: 0.3,})
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'AI error');

      const aiText = data?.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
      setChatMessages(prev => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', text: aiText }
      ]);
    } catch (e) {
      setAiError('AI reply failed. Please try again.');
    } finally {
      setIsAiTyping(false);
    }
  };

  const getCurrentScreen = () => {
    return screens.find(screen => screen.id === currentScreen);
  };

  const currentScreenData = getCurrentScreen();
  const CurrentScreenComponent = currentScreenData.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Floating particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`absolute rounded-full ${particle.color === 'cyan' ? 'bg-cyan-400' : 'bg-blue-400'}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            filter: 'blur(0.5px)'
          }}
        />
      ))}

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25px 25px, cyan 2px, transparent 0)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Header */}
      <header className="bg-gray-800/80 backdrop-blur-md border-b border-cyan-500/50 relative z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Clinical Coding Assistant
                </h1>
                <p className="text-cyan-300 flex items-center space-x-2">
                  <span>Healthcare • AI-Powered Medical Coding</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </p>
              </div>
            </div>
            
            <button
              onClick={handleBackToMenu}
              className="flex items-center space-x-2 bg-gray-700/50 hover:bg-gray-600/50 text-white px-6 py-3 rounded-lg transition-all duration-200 backdrop-blur-sm border border-gray-600/30 hover:border-cyan-500/50 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Back to Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Patient Info Bar */}
      <div className="bg-gray-800/60 backdrop-blur-sm border-b border-gray-600/50 relative z-10">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Patient:</span>
                <span className="font-medium text-white">{patientData.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">ID:</span>
                <span className="font-mono text-cyan-300">{patientData.id}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">DOB:</span>
                <span className="text-white">{patientData.dob}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">LOS:</span>
                <span className="text-white">{patientData.los} days</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Episode:</span>
                <span className="text-green-400">Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Progress:</span>
                <span className="text-cyan-300">{Math.round(((screens.findIndex(s => s.id === currentScreen) + 1) / screens.length) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800/40 backdrop-blur-sm border-b border-gray-600/30 relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex space-x-1 overflow-x-auto">
            {screens.map((screen, index) => {
              const IconComponent = screen.icon;
              const isActive = currentScreen === screen.id;
              const isCompleted = screens.findIndex(s => s.id === currentScreen) > index;
              
              return (
                <button
                  key={screen.id}
                  onClick={() => navigateToScreen(screen.id)}
                  disabled={isTransitioning}
                  className={`flex items-center space-x-3 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                    isActive 
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300' 
                      : isCompleted
                        ? 'border-green-500/50 text-green-400 hover:bg-green-500/10'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-700/30'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isActive 
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30' 
                      : isCompleted
                        ? 'bg-green-500/20 border border-green-500/50'
                        : 'bg-gray-700'
                  }`}>
                    {isCompleted && !isActive ? (
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    ) : (
                      <IconComponent className="w-4 h-4" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{screen.name}</div>
                    <div className="text-xs opacity-70">{screen.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative z-10">
        {demoLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold text-white mb-2">Initializing Clinical Coding Assistant</h3>
              <p className="text-cyan-300 mb-4">Loading ICD-10-AM Thirteenth Edition</p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                <span>• Patient Data Loaded</span>
                <span>• AI Models Ready</span>
                <span>• Standards Updated</span>
              </div>
            </div>
          </div>
        ) : (
          <div className={`h-full transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <CurrentScreenComponent />
          </div>
        )}
      </div>

      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {chatOpen ? (
          <div className="bg-gray-800/95 backdrop-blur-md border border-cyan-500/50 rounded-lg w-80 h-96 shadow-2xl shadow-cyan-500/30">
            <div className="flex items-center justify-between p-4 border-b border-gray-600/50">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-cyan-400" />
                <h4 className="font-semibold text-white">Clinical AI Assistant</h4>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 h-64 overflow-y-auto">
              {chatMessages.map(m => (
                <div key={m.id} className={`text-sm rounded-lg p-3 mb-3 ${m.role === 'assistant' ? 'bg-gray-700/50 text-gray-300' : 'bg-cyan-600/40 text-white ml-8'}`}>
                  {m.role === 'assistant' && (
                    <strong className="text-cyan-300">AI Assistant: </strong>
                  )}
                  <span className="whitespace-pre-wrap">{m.text}</span>
                </div>
              ))}
              {isAiTyping && (
                <div className="text-xs text-gray-400">AI is typing…</div>
              )}
              {aiError && (
                <div className="text-xs text-red-400">{aiError}</div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-600/50">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask about coding standards..."
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (!isAiTyping) handleChatSubmit();
                    }
                  }}
                />
                <button
                  onClick={handleChatSubmit}
                  disabled={isAiTyping || !chatMessage.trim()}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/30"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setChatOpen(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white p-4 rounded-full shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all duration-300 transform hover:scale-110 group"
          >
            <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ClinicalCodingDemo;
