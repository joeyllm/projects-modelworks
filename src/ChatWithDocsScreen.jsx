import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Phone, Video, Search, Filter, Paperclip, MoreVertical, Star, Archive, AlertCircle, CheckCircle, User, Stethoscope, Calendar, Bell, Clock, Users, TrendingUp, Zap, Target, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';

const ChatWithDocsScreen = () => {
  const [activeConversation, setActiveConversation] = useState('conv-001');
  const [newMessage, setNewMessage] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNewChat, setShowNewChat] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [aiError, setAiError] = useState('');

  const conversations = [
    {
      id: 'conv-001',
      patientName: 'John Smith',
      patientId: 'MRN-789012',
      clinician: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      status: 'active',
      priority: 'normal',
      lastMessage: 'Drug-eluting stent was placed in the LAD. Single vessel intervention.',
      lastMessageTime: '2:15 PM',
      unreadCount: 1,
      episodeDate: '12/07/2025',
      avatar: 'SJ',
      online: true,
      responseTime: 'Usually replies within 30 min'
    },
    {
      id: 'conv-002',
      patientName: 'Mary Wilson',
      patientId: 'MRN-456789',
      clinician: 'Dr. Michael Chen',
      specialty: 'Orthopedics',
      status: 'pending',
      priority: 'high',
      lastMessage: 'Need clarification on the surgical approach used for hip replacement.',
      lastMessageTime: '4 hours ago',
      unreadCount: 0,
      episodeDate: '10/07/2025',
      avatar: 'MC',
      online: false,
      responseTime: 'Usually replies within 2 hours'
    },
    {
      id: 'conv-003',
      patientName: 'Robert Davis',
      patientId: 'MRN-123456',
      clinician: 'Dr. Emma Thompson',
      specialty: 'General Surgery',
      status: 'resolved',
      priority: 'normal',
      lastMessage: 'Thanks for the clarification. Procedure was laparoscopic.',
      lastMessageTime: '1 day ago',
      unreadCount: 0,
      episodeDate: '08/07/2025',
      avatar: 'ET',
      online: false,
      responseTime: 'Usually replies within 1 hour'
    },
    {
      id: 'conv-004',
      patientName: 'Lisa Anderson',
      patientId: 'MRN-987654',
      clinician: 'Dr. James Wilson',
      specialty: 'Emergency Medicine',
      status: 'active',
      priority: 'urgent',
      lastMessage: 'Patient presented with acute symptoms requiring immediate intervention.',
      lastMessageTime: '30 min ago',
      unreadCount: 3,
      episodeDate: '22/07/2025',
      avatar: 'JW',
      online: true,
      responseTime: 'Usually replies within 15 min'
    }
  ];

  const initialMessages = {
    'conv-001': [
      {
        id: 1,
        sender: 'Dr. Sarah Johnson',
        senderType: 'clinician',
        message: 'Patient had chest pain on admission, confirmed STEMI on ECG. Emergency PCI was performed with successful revascularization.',
        timestamp: '10:30 AM',
        status: 'delivered',
        attachments: []
      },
      {
        id: 2,
        sender: 'Clinical Coder',
        senderType: 'coder',
        message: 'Thank you Dr. Johnson. I need to confirm - was this the patient\'s first myocardial infarction? This affects the coding for the principal diagnosis.',
        timestamp: '10:45 AM',
        status: 'delivered',
        attachments: []
      },
      {
        id: 3,
        sender: 'Dr. Sarah Johnson',
        senderType: 'clinician',
        message: 'Yes, this was his first MI. No previous history of coronary events. He does have a history of hypertension and type 2 diabetes.',
        timestamp: '11:15 AM',
        status: 'delivered',
        attachments: []
      },
      {
        id: 4,
        sender: 'Clinical Coder',
        senderType: 'coder',
        message: 'Perfect, that helps with the coding. One more question - what type of stent was used during the PCI? Drug-eluting or bare metal?',
        timestamp: '11:20 AM',
        status: 'delivered',
        attachments: []
      },
      {
        id: 5,
        sender: 'Dr. Sarah Johnson',
        senderType: 'clinician',
        message: 'Drug-eluting stent was placed in the LAD. Single vessel intervention.',
        timestamp: '2:15 PM',
        status: 'read',
        attachments: []
      }
    ],
    'conv-002': [
      {
        id: 1,
        sender: 'Clinical Coder',
        senderType: 'coder',
        message: 'Hi Dr. Chen, I\'m coding Mrs. Wilson\'s hip replacement episode. Could you clarify the surgical approach used?',
        timestamp: '2:30 PM',
        status: 'delivered',
        attachments: []
      },
      {
        id: 2,
        sender: 'Clinical Coder',
        senderType: 'coder',
        message: 'Specifically, was this an anterior or posterior approach? The operative notes mention both but I need to confirm the primary approach for accurate coding.',
        timestamp: '2:32 PM',
        status: 'delivered',
        attachments: []
      }
    ]
  };

  const templates = [
    { category: 'Principal Diagnosis', templates: [
      'Could you clarify if this was the primary reason for admission?',
      'Was this condition present on admission or did it develop during the stay?',
      'Is there an underlying cause for this symptom/sign that should be coded instead?'
    ]},
    { category: 'Procedures', templates: [
      'Could you specify the surgical approach used for this procedure?',
      'Were there any complications during the procedure that need coding?',
      'Was this procedure planned or performed as an emergency?',
      'How many vessels/sites were treated during this intervention?'
    ]},
    { category: 'Medications', templates: [
      'Could you confirm the exact medication names and dosages?',
      'Were these medications started during admission or continued from home?',
      'Any drug allergies or adverse reactions noted during this episode?'
    ]},
    { category: 'Clarification', templates: [
      'Could you provide additional clinical details for this case?',
      'Is there anything else clinically significant I should code for this episode?',
      'Thank you for the clarification, this helps with accurate coding.'
    ]}
  ];

  const chatStats = {
    totalConversations: conversations.length,
    activeChats: conversations.filter(c => c.status === 'active').length,
    avgResponseTime: '45 min',
    resolutionRate: '94%'
  };

  const [messagesByConv, setMessagesByConv] = useState(initialMessages);

  const currentConv = conversations.find(c => c.id === activeConversation);
  const currentMessages = messagesByConv[activeConversation] || [];

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = searchTerm === '' || 
      conv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.clinician.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || conv.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const docsContext = `
Episode summary for ${currentConv?.patientName || 'patient'} (${currentConv?.patientId || ''}):
- Specialty: ${currentConv?.specialty || ''}
- Clinician: ${currentConv?.clinician || ''}
- Last note: ${currentConv?.lastMessage || ''}
`;

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    const currentInput = newMessage;
    const currentConv = conversations.find(c => c.id === activeConversation);
    
    // ✅ This part works - adds user message immediately
    const userMessage = {
      id: Date.now(),
      sender: 'Clinical Coder',
      senderType: 'coder',
      message: currentInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
      attachments: []
    };

    setMessagesByConv(prev => ({
      ...prev,
      [activeConversation]: [...(prev[activeConversation] || []), userMessage]
    }));
    
    setNewMessage(''); // ✅ Clears input
    setIsSending(true); // ✅ Shows typing indicator

    try {
      // ✅ Makes API call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a clinician named ` + currentConv.clinician + " who specialises in " + currentConv.specialty + "."
            },
            {
              role: 'system',
              content: `You are currently treating ` + currentConv.patientName + " and you will be asked questions about them.  Answer and approach the topic in a professional manner like an average clinician."
            },
            {
              role: 'system',
              content: `You should act as if you are indeed ` + currentConv.clinician + ` and confidently answer questions relating to ` + activeConversation.specialty + "."
            },
            {
              role: 'user',
              content: currentInput
            }
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // ❌ MISSING: You never process the response!
      // You need to add this:
      
      const data = await response.json();
      
      const aiResponse = {
        id: Date.now() + 1,
        sender: currentConv?.clinician || 'Doctor',
        senderType: 'clinician',
        message: data.choices[0].message.content, // Extract AI response
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered',
        attachments: []
      };
      
      // Add AI response to messages
      setMessagesByConv(prev => ({
        ...prev,
        [activeConversation]: [...(prev[activeConversation] || []), aiResponse]
      }));
      
    } catch (error) {
      console.error('Chat Error:', error);
      
      // ❌ MISSING: Error handling - add error message to chat
      const errorResponse = {
        id: Date.now() + 2,
        sender: 'System',
        senderType: 'clinician',
        message: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'error',
        attachments: []
      };
      
      setMessagesByConv(prev => ({
        ...prev,
        [activeConversation]: [...(prev[activeConversation] || []), errorResponse]
      }));
    } finally {
      setIsSending(false); // ✅ Hides typing indicator
    }
  };

  const insertTemplate = (template) => {
    setNewMessage(template);
    setShowTemplates(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'resolved': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityIcon = (priority) => {
    if (priority === 'high' || priority === 'urgent') {
      return <AlertCircle className="h-4 w-4 text-red-400" />;
    }
    return null;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-500/5';
      case 'high': return 'border-l-orange-500 bg-orange-500/5';
      case 'normal': return 'border-l-gray-500 bg-gray-500/5';
      default: return 'border-l-gray-500 bg-gray-500/5';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-600/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Chat with Docs</h2>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-amber-300">Clinician Communication Hub</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">Real-time Coding Clarification</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {aiError && <span className="text-xs text-red-400">{aiError}</span>}
            {isSending && <span className="text-xs text-gray-400">Generating reply…</span>}
          </div>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-xs text-gray-400">Total Chats</div>
                <div className="text-sm font-semibold text-white">{chatStats.totalConversations}</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-green-400" />
              <div>
                <div className="text-xs text-gray-400">Active</div>
                <div className="text-sm font-semibold text-white">{chatStats.activeChats}</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-xs text-gray-400">Avg Response</div>
                <div className="text-sm font-semibold text-white">{chatStats.avgResponseTime}</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-xs text-gray-400">Resolution</div>
                <div className="text-sm font-semibold text-white">{chatStats.resolutionRate}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversation List */}
        <div className="w-80 bg-gray-800/30 border-r border-gray-600/50 flex flex-col">
          {/* Search and Filter */}
          <div className="p-4 border-b border-gray-600/50">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-1 text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-400"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => setActiveConversation(conv.id)}
                className={`p-4 border-b border-gray-700/50 cursor-pointer hover:bg-gray-700/30 transition-colors border-l-4 ${getPriorityColor(conv.priority)} ${
                  activeConversation === conv.id ? 'bg-amber-500/10 border-r-4 border-r-amber-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {conv.avatar}
                      </div>
                      {conv.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-white truncate">{conv.patientName}</h3>
                        {getPriorityIcon(conv.priority)}
                        {conv.unreadCount > 0 && (
                          <span className="bg-amber-500 text-white text-xs rounded-full px-2 py-1">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs text-gray-500">{conv.patientId}</span>
                        <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(conv.status)}`}>
                          {conv.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Stethoscope className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text.gray-400">{conv.clinician}</span>
                        <span className="text-xs text-gray-500">• {conv.specialty}</span>
                      </div>
                      <p className="text-sm text-gray-300 truncate mb-2">{conv.lastMessage}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{conv.episodeDate}</span>
                        </div>
                        <span className="text-xs text-gray-500">{conv.lastMessageTime}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{conv.responseTime}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentConv ? (
            <>
              {/* Chat Header */}
              <div className="bg-gray-800/30 border-b border-gray-600/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {currentConv.avatar}
                      </div>
                      {currentConv.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{currentConv.patientName}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <span>{currentConv.patientId}</span>
                        <span>•</span>
                        <span>{currentConv.clinician}</span>
                        <span>•</span>
                        <span>{currentConv.specialty}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {currentConv.online ? 'Online now' : `Last seen ${currentConv.lastMessageTime}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(currentConv.status)}`}>
                      {currentConv.status}
                    </span>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                      <Phone className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                      <Video className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentMessages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderType === 'coder' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      message.senderType === 'coder'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                        : 'bg-gray-700 text-gray-100'
                    }`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium">
                          {message.senderType === 'coder' ? 'You' : message.sender}
                        </span>
                        {message.senderType === 'clinician' && (
                          <Stethoscope className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs ${
                          message.senderType === 'coder' ? 'text-orange-100' : 'text-gray-400'
                        }`}>
                          {message.timestamp}
                        </span>
                        {message.senderType === 'coder' && (
                          <CheckCircle className={`h-3 w-3 ${
                            message.status === 'read' ? 'text-orange-200' : 'text-orange-300'
                          }`} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Templates */}
              {showTemplates && (
                <div className="border-t border-gray-600/50 p-4 bg-gray-800/30 max-h-64 overflow-y-auto">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-white">Quick Templates</h4>
                    <button
                      onClick={() => setShowTemplates(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {templates.map(category => (
                    <div key={category.category} className="mb-4">
                      <h5 className="font-medium text-sm text-gray-300 mb-2">{category.category}</h5>
                      <div className="space-y-1">
                        {category.templates.map((template, index) => (
                          <button
                            key={index}
                            onClick={() => insertTemplate(template)}
                            className="w-full text-left px-3 py-2 text-sm bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 hover:border-amber-500/50 rounded-lg transition-all duration-200 text-gray-300 hover:text-white"
                          >
                            {template}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Message Input */}
              <div className="border-t border-gray-600/50 p-4 bg-gray-800/30">
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message to the clinician..."
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white resize-none focus:ring-2 focus:ring-amber-500 focus:border-amber-400 transition-colors"
                      rows="2"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (!isSending) sendMessage();
                        }
                      }}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowTemplates(!showTemplates)}
                          className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          Templates
                        </button>
                        <button className="p-1 text-gray-400 hover:text-white transition-colors">
                          <Paperclip className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-xs text-gray-500">
                        Press Enter to send, Shift+Enter for new line
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || isSending}
                    className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500 max-w-md">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Select a Conversation</h3>
                <p className="text-gray-500 mb-6">Choose a patient episode to start chatting with clinicians for coding clarification</p>
                <button
                  onClick={() => setShowNewChat(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white px-4 py-2 rounded-lg transition-all duration-200 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Start New Chat</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 border border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Start New Chat</h3>
              <button
                onClick={() => setShowNewChat(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Patient ID</label>
                <input
                  type="text"
                  placeholder="Enter patient MRN..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Clinician</label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-400">
                  <option value="">Select clinician...</option>
                  <option value="dr-johnson">Dr. Sarah Johnson - Cardiology</option>
                  <option value="dr-chen">Dr. Michael Chen - Orthopedics</option>
                  <option value="dr-thompson">Dr. Emma Thompson - General Surgery</option>
                  <option value="dr-wilson">Dr. James Wilson - Emergency Medicine</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Initial Message</label>
                <textarea
                  placeholder="Enter your coding question..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-400 resize-none"
                  rows="3"
                />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowNewChat(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('New chat started!');
                    setShowNewChat(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white px-4 py-2 rounded-lg transition-all duration-200"
                >
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWithDocsScreen;
