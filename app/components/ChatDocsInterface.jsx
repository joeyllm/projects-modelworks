// app/components/ChatDocsInterface.jsx
"use client";
import React from "react";
import { Bot, Download, RefreshCw, X, FileText, Paperclip, Send, Search, Eye } from "lucide-react";

const CHAT_ENDPOINT = process.env.NEXT_PUBLIC_CHAT_ENDPOINT || "/api/chat";
const POST_TIMEOUT_MS = 5000;

const ChatWithDocs = ({
  isOpen = false,
  onClose = () => {},
  patients = [],
  currentScreen = "general",
}) => {
  const [messages, setMessages] = React.useState([
    {
      id: 1,
      type: "system",
      content:
        "Welcome to the Clinical Trial AI Assistant! I can help you analyze patient data, answer questions about trial protocols, and provide insights across all aspects of the SCAI-001 study.",
      timestamp: new Date(Date.now() - 5000),
    },
    {
      id: 2,
      type: "assistant",
      content:
        "I have access to your complete patient database and can help with questions about biomarkers, tumor metrics, outcomes, safety, and compliance. What would you like to explore?",
      timestamp: new Date(Date.now() - 3000),
    },
  ]);

  const [inputMessage, setInputMessage] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const messagesEndRef = React.useRef(null);
  const inputRef = React.useRef(null);

  const normalizeMessagesForApi = React.useCallback((list) => {
    return list.map((m) => ({
      id: m.id,
      role: m.type, // 'system' | 'user' | 'assistant'
      content: m.content,
      timestamp: new Date(m.timestamp).toISOString(),
      attachments: m.attachments || null,
    }));
  }, []);

  const sendHistoryToBackend = React.useCallback(
    async (historyList) => {
      const payload = {
        messages: normalizeMessagesForApi(historyList),
        meta: {
          patientsCount: Array.isArray(patients) ? patients.length : 0,
          currentScreen,
          sentAt: new Date().toISOString(),
        },
      };

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), POST_TIMEOUT_MS);

      try {
        await fetch(CHAT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
      } catch {
      } finally {
        clearTimeout(timer);
      }
    },
    [normalizeMessagesForApi, patients, currentScreen]
  );

  const suggestions = {
    general: [
      "Show me patients with the best tumor response",
      "Which biomarkers predict better outcomes?",
      "Summarize safety events this month",
      "Compare QoL scores by cancer stage",
    ],
    "patient-matching": [
      "Find patients with EGFR+ and Stage II",
      "Which locations have the most enrollments?",
      "Show eligibility violations by criteria",
      "Compare enrollment by biomarker status",
    ],
    biomarkers: [
      "What's the PD-L1 expression distribution?",
      "Correlate EGFR status with response",
      "Show ALK fusion prevalence by cancer type",
      "Which biomarkers have the strongest association?",
    ],
    "tumor-metrics": [
      "Which patients show progression?",
      "Average tumor shrinkage by stage",
      "Identify complete responders",
      "Compare target vs overall response",
    ],
    "outcomes-safety": [
      "List all severe adverse events",
      "QoL improvement by treatment duration",
      "Secondary infection patterns",
      "Protocol deviation impact analysis",
    ],
  };

  const mockResponses = [
    "Based on the current data, I've identified several key patterns in your patient cohort...",
    "Looking at the biomarker data, there's a strong correlation between EGFR mutation status and treatment response...",
    "The safety profile shows excellent tolerability with only 3 severe adverse events across 25 enrolled patients...",
    "Quality of life scores have improved by an average of 12.3 points from baseline, with 78% of patients showing improvement...",
    "I found 4 patients meeting your criteria. Here's a detailed breakdown of their characteristics...",
    "The compliance rate is excellent at 94.2%. The two protocol deviations were minor and didn't impact safety...",
    "Comparing by cancer stage, Stage II patients show the best response rates...",
    "The most common biomarker combination is EGFR+ with ALK- ...",
  ];

  React.useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInputMessage("");
    setIsTyping(true);

    sendHistoryToBackend(nextMessages).catch(() => {});

    setTimeout(() => {
      const responseMessage = {
        id: Date.now() + 1,
        type: "assistant",
        content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
        timestamp: new Date(),
        attachments:
          Math.random() > 0.7
            ? [
                { type: "chart", name: "Patient Response Analysis.png" },
                { type: "table", name: "Filtered Results.csv" },
              ]
            : undefined,
      };
      setMessages((prev) => [...prev, responseMessage]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const handleSuggestionClick = (suggestion) => setInputMessage(suggestion);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const clearChat = () => {
    const cleared = [
      {
        id: 1,
        type: "system",
        content: "Chat cleared. How can I help you with the clinical trial data?",
        timestamp: new Date(),
      },
    ];
    setMessages(cleared);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 p-4 overflow-hidden">
      {/* Main shell */}
      <div className="bg-gray-900/95 border border-cyan-500/50 rounded-lg w-full max-w-4xl h-[80vh] mx-auto flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gray-800/80 border-b border-gray-600/50 p-4 rounded-t-lg flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Clinical Trial AI Assistant</h3>
                <p className="text-cyan-300 text-sm">
                  SCAI-001 Study • {patients.length} patients • {currentScreen} context
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href="/monitor"
                target="_blank"
                className="p-2 text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                title="Open Monitor"
              >
                <Eye className="w-4 h-4" />
              </a>
              <button
                onClick={() => {
                  const chatHistory = messages
                    .filter((m) => m.type !== "system")
                    .map(
                      (m) =>
                        `[${formatTimestamp(m.timestamp)}] ${m.type.toUpperCase()}: ${m.content}`
                    )
                    .join("\n\n");
                  const blob = new Blob([chatHistory], { type: "text/plain" });
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `chat_history_${new Date().toISOString().split("T")[0]}.txt`;
                  link.click();
                  window.URL.revokeObjectURL(url);
                }}
                className="p-2 text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                title="Export chat"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={clearChat}
                className="p-2 text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                title="Clear chat"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-200"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 flex min-h-0">
          {/* Left: chat column */}
          <div className="flex-1 min-w-0 flex flex-col border-r border-gray-600/50">
            {/* Messages */}
            <div className="flex-1 min-h-0 overflow-y-auto bg-gray-900/50 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] ${
                        message.type === "user" ? "order-2" : "order-1"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-lg break-words ${
                          message.type === "user"
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                            : message.type === "system"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : "bg-gray-700/50 text-gray-200 border border-gray-600/30"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>

                        {message.attachments && (
                          <div className="mt-3 space-y-2">
                            {message.attachments.map((attachment, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2 bg-gray-800/50 rounded p-2"
                              >
                                <FileText className="w-4 h-4 text-cyan-400" />
                                <span className="text-xs text-gray-300 truncate">
                                  {attachment.name}
                                </span>
                                <button className="text-cyan-400 hover:text-cyan-300 text-xs">
                                  Download
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div
                        className={`flex items-center space-x-2 mt-1 ${
                          message.type === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(message.timestamp)}
                        </span>
                        {message.type !== "user" && (
                          <div className="flex items-center space-x-1">
                            <Bot className="w-3 h-3 text-cyan-400" />
                            <span className="text-xs text-cyan-400">AI Assistant</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-700/50 border border-gray-600/30 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full animate-bounce bg-cyan-400"></div>
                        <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:100ms] bg-cyan-400"></div>
                        <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:200ms] bg-cyan-400"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="flex-shrink-0 border-t border-gray-600/50 p-4 bg-gray-800/50">
              <div className="flex items-end space-x-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask about patient data, biomarkers, safety events, or trial protocols..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 resize-none h-14 leading-5 overflow-y-auto"
                    disabled={isTyping}
                  />
                  <button className="absolute right-2 bottom-2 text-gray-400 hover:text-cyan-400 transition-colors duration-200">
                    <Paperclip className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-lg hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center w-[60px]"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: sidebar */}
          <div className="w-80 flex-shrink-0 bg-gray-800/50 flex flex-col min-h-0">
            <div className="p-4 border-b border-gray-600/50 flex-shrink-0">
              <h4 className="text-white font-medium flex items-center space-x-2">
                <Search className="w-4 h-4 text-cyan-400" />
                <span>Quick Questions</span>
              </h4>
            </div>

            <div className="flex-1 overflow-y-auto p-4 min-h-0">
              <div className="space-y-6">
                <div>
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">
                    {currentScreen.replace("-", " ").toUpperCase()} CONTEXT
                  </div>

                  <div className="space-y-2">
                    {(suggestions[currentScreen] || suggestions.general).map(
                      (suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left p-3 bg-gray-700/50 hover:bg-gray-600/80 rounded-lg text-white text-sm transition-all duration-200 border border-transparent hover:border-cyan-500/50 cursor-pointer"
                        >
                          {suggestion}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-600/50 pt-4">
                  <h5 className="text-white font-medium mb-3 text-sm">Patient Summary</h5>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Enrolled:</span>
                      <span className="text-green-400">
                        {patients.filter((p) => p.enrollmentStatus === "Enrolled").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Screening:</span>
                      <span className="text-amber-400">
                        {patients.filter((p) => p.enrollmentStatus === "Screened").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sites Active:</span>
                      <span className="text-cyan-400">
                        {new Set(patients.map((p) => p.location)).size}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 text-sm font-medium">Pro Tip</span>
                  </div>
                  <p className="text-gray-300 text-xs">
                    Ask specific questions about patient subgroups, biomarker correlations, or safety
                    patterns for more targeted insights.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End body */}
      </div>
    </div>
  );
};

export default ChatWithDocs;
