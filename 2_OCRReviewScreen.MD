import React, { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Check, X, ChevronDown, ChevronUp, RefreshCw, Edit3, Save, FileText, Eye, AlertTriangle, Zap, Target, Settings, Filter } from 'lucide-react';

const OCRReviewScreen = () => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedWord, setSelectedWord] = useState(null);
  const [corrections, setCorrections] = useState({});
  const [autoAcceptThreshold, setAutoAcceptThreshold] = useState(0.85);
  const [currentDocument, setCurrentDocument] = useState('discharge-summary');
  const [showSuggestions, setShowSuggestions] = useState(true);

  const [ocrText, setOcrText] = useState(`DISCHARGE SUMMARY

Patient: John Smith
DOB: 15/03/1965
Admission Date: 12/07/2025
Discharge Date: 18/07/2025

PRINCIPAL DIAGNOSIS:
ST-elevation myocardial infarction (STEMI) anterior wall

SECONDARY DIAGNOSES:
- Coronary artery disease
- Hypertension  
- Type 2 diabetes mellitus

PROCEDURES PERFORMED:
- Emergency percutaneous coronary intervention (PCI)
- Coronary angioplasty with drug-eluting stent placement

CLINICAL COURSE:
Mr. Smith presented with acute chest pain and was diagnosed with STEMI. Emergency PCI was performed with successful revascularization. Patient recovered well and was discharged on dual antiplatelet therapy.

DISCHARGE MEDICATIONS:
- Aspirin 100mg daily
- Clopidogrel 75mg daily
- Atorvastatin 40mg daily
- Metoprolol 25mg twice daily

Dr. Sarah Johnson
Consultant Cardiologist
18/07/2025`);

  const [lowConfidenceWords] = useState([
    { word: 'infarction', position: 245, confidence: 0.72, suggestions: ['infarction', 'infection', 'inflammation'], context: 'medical' },
    { word: 'percutaneous', position: 412, confidence: 0.68, suggestions: ['percutaneous', 'percutaneus', 'percutaneious'], context: 'procedure' },
    { word: 'revascularization', position: 598, confidence: 0.75, suggestions: ['revascularization', 'revascularisation', 'revascularixation'], context: 'medical' },
    { word: 'Clopidogrel', position: 892, confidence: 0.71, suggestions: ['Clopidogrel', 'Clopidagrel', 'Clopidogrel'], context: 'medication' },
    { word: 'Atorvastatin', position: 925, confidence: 0.73, suggestions: ['Atorvastatin', 'Atorvastatln', 'Atorvostatin'], context: 'medication' }
  ]);

  const documents = [
    {
      id: 'discharge-summary',
      title: 'Discharge Summary',
      pages: 2,
      confidence: 87,
      status: 'reviewing',
      issues: 5
    },
    {
      id: 'operative-report',
      title: 'Operative Report',
      pages: 3,
      confidence: 92,
      status: 'pending',
      issues: 3
    },
    {
      id: 'progress-notes',
      title: 'Progress Notes',
      pages: 4,
      confidence: 85,
      status: 'pending',
      issues: 8
    }
  ];

  const ocrStats = {
    totalWords: 156,
    reviewedWords: 12,
    confidence: 87,
    issuesFound: 5,
    timeEstimate: '3-5 min'
  };

  const handleWordClick = (wordData) => {
    setSelectedWord(wordData);
  };

  const handleWordCorrection = (originalWord, correctedWord) => {
    setCorrections(prev => ({
      ...prev,
      [originalWord]: correctedWord
    }));
    
    // Update the OCR text with the correction
    setOcrText(prev => prev.replace(originalWord, correctedWord));
    setSelectedWord(null);
  };

  const acceptAllCorrections = () => {
    lowConfidenceWords.forEach(wordData => {
      if (wordData.confidence >= autoAcceptThreshold) {
        handleWordCorrection(wordData.word, wordData.suggestions[0]);
      }
    });
  };

  const rejectAllCorrections = () => {
    setCorrections({});
    setSelectedWord(null);
  };

  const sendToWorkspace = () => {
    alert('Approved transcription sent to Episode Workspace');
  };

  const renderHighlightedText = (text) => {
    let highlightedText = text;
    
    lowConfidenceWords.forEach(wordData => {
      const { word, confidence } = wordData;
      const correctedWord = corrections[word] || word;
      const isLowConfidence = confidence < autoAcceptThreshold;
      const isCorrected = corrections[word];
      
      let className = '';
      if (isCorrected) {
        className = 'bg-green-400/30 text-green-200 border-b-2 border-green-400 cursor-pointer px-1 rounded';
      } else if (isLowConfidence) {
        className = 'bg-yellow-400/30 text-yellow-200 border-b-2 border-yellow-400 cursor-pointer px-1 rounded hover:bg-yellow-400/40';
      }
      
      if (className) {
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        highlightedText = highlightedText.replace(regex, 
          `<span class="${className}" data-word="${word}" data-confidence="${confidence}">${correctedWord}</span>`
        );
      }
    });
    
    return highlightedText;
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.85) return 'text-green-400';
    if (confidence >= 0.7) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 0.85) return 'High';
    if (confidence >= 0.7) return 'Medium';
    return 'Low';
  };

  const getContextIcon = (context) => {
    switch (context) {
      case 'medical': return '🏥';
      case 'procedure': return '⚕️';
      case 'medication': return '💊';
      default: return '📝';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50">
      {/* Header with Controls */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-600/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">OCR Review & Correction</h2>
            <p className="text-cyan-300 text-sm">Document transcription accuracy verification</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-400">Auto-accept threshold:</span>
              <select 
                value={autoAcceptThreshold}
                onChange={(e) => setAutoAcceptThreshold(parseFloat(e.target.value))}
                className="bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400"
              >
                <option value={0.9}>90%</option>
                <option value={0.85}>85%</option>
                <option value={0.8}>80%</option>
                <option value={0.75}>75%</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={acceptAllCorrections}
                className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Accept All</span>
              </button>
              <button
                onClick={rejectAllCorrections}
                className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Reject All</span>
              </button>
              <button
                onClick={sendToWorkspace}
                className="flex items-center space-x-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200"
              >
                <FileText className="w-4 h-4" />
                <span>Send to Workspace</span>
              </button>
            </div>
          </div>
        </div>

        {/* OCR Statistics */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-xs text-gray-400">Total Words</div>
                <div className="text-sm font-semibold text-white">{ocrStats.totalWords}</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-green-400" />
              <div>
                <div className="text-xs text-gray-400">Reviewed</div>
                <div className="text-sm font-semibold text-white">{ocrStats.reviewedWords}</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-xs text-gray-400">Confidence</div>
                <div className="text-sm font-semibold text-white">{ocrStats.confidence}%</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <div>
                <div className="text-xs text-gray-400">Issues Found</div>
                <div className="text-sm font-semibold text-white">{ocrStats.issuesFound}</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-xs text-gray-400">Time Est.</div>
                <div className="text-sm font-semibold text-white">{ocrStats.timeEstimate}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Document Image */}
        <div className="w-1/2 flex flex-col border-r border-gray-600/50">
          {/* Document Selector */}
          <div className="bg-gray-800/30 border-b border-gray-600/50 p-3">
            <div className="flex space-x-1">
              {documents.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => setCurrentDocument(doc.id)}
                  className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                    currentDocument === doc.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      doc.status === 'reviewing' ? 'bg-yellow-400' : 'bg-gray-400'
                    }`}></div>
                    <span>{doc.title}</span>
                    <span className="text-xs text-gray-500">({doc.pages}p)</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Image Controls */}
          <div className="bg-gray-800/30 border-b border-gray-600/50 p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Scanned Document</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-gray-300 min-w-[3rem] text-center">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                  <RotateCw className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Document Preview */}
          <div className="flex-1 p-4 overflow-auto bg-gray-900/30">
            <div className="flex items-center justify-center h-full">
              <div 
                className="bg-white rounded-lg shadow-2xl p-8 max-w-md mx-auto transition-transform duration-200" 
                style={{ transform: `scale(${zoomLevel / 100})` }}
              >
                <div className="border-b border-gray-300 pb-4 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 text-center">DISCHARGE SUMMARY</h3>
                  <p className="text-sm text-gray-600 text-center">Royal Melbourne Hospital</p>
                </div>
                
                <div className="text-left space-y-3 text-sm text-gray-800">
                  <div><strong>Patient:</strong> John Smith</div>
                  <div><strong>DOB:</strong> 15/03/1965</div>
                  <div><strong>Admission:</strong> 12/07/2025</div>
                  <div><strong>Discharge:</strong> 18/07/2025</div>
                  
                  <div className="pt-3">
                    <div className="font-semibold">PRINCIPAL DIAGNOSIS:</div>
                    <div className="pl-2">
                      ST-elevation myocardial <span className="bg-yellow-200 px-1 rounded">infarction</span> (STEMI)
                    </div>
                  </div>
                  
                  <div className="pt-3">
                    <div className="font-semibold">PROCEDURES:</div>
                    <div className="pl-2">
                      Emergency <span className="bg-yellow-200 px-1 rounded">percutaneous</span> coronary intervention
                    </div>
                  </div>
                  
                  <div className="pt-3">
                    <div className="font-semibold">MEDICATIONS:</div>
                    <div className="pl-2 space-y-1">
                      <div>- Aspirin 100mg daily</div>
                      <div>- <span className="bg-yellow-200 px-1 rounded">Clopidogrel</span> 75mg daily</div>
                      <div>- <span className="bg-yellow-200 px-1 rounded">Atorvastatin</span> 40mg daily</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-300 text-sm text-gray-700">
                  <div>Dr. Sarah Johnson</div>
                  <div>Consultant Cardiologist</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - OCR Text */}
        <div className="w-1/2 flex flex-col">
          {/* OCR Header */}
          <div className="bg-gray-800/30 border-b border-gray-600/50 p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">OCR Text Output</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                  <span className="text-gray-400">Low confidence</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 bg-green-400 rounded"></div>
                  <span className="text-gray-400">Corrected</span>
                </div>
                <button 
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-sm"
                >
                  <Filter className="w-4 h-4" />
                  <span>Suggestions</span>
                </button>
              </div>
            </div>
          </div>

          {/* OCR Text Area */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div 
                className="text-sm font-mono leading-relaxed text-gray-300 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: renderHighlightedText(ocrText) }}
                onClick={(e) => {
                  const word = e.target.getAttribute('data-word');
                  const confidence = parseFloat(e.target.getAttribute('data-confidence'));
                  if (word && confidence) {
                    const wordData = lowConfidenceWords.find(w => w.word === word);
                    if (wordData) {
                      handleWordClick(wordData);
                    }
                  }
                }}
              />
            </div>

            {/* AI Medical Term Recognition */}
            {showSuggestions && (
              <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <h4 className="text-blue-300 font-medium">Medical Term Recognition</h4>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-blue-500/20 rounded-lg p-2">
                    <span className="text-blue-300">🏥 Medical Terms:</span>
                    <div className="text-blue-200 mt-1">infarction, STEMI, angioplasty</div>
                  </div>
                  <div className="bg-blue-500/20 rounded-lg p-2">
                    <span className="text-blue-300">💊 Medications:</span>
                    <div className="text-blue-200 mt-1">Clopidogrel, Atorvastatin</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Word Correction Panel */}
          {selectedWord && (
            <div className="bg-gray-800/50 border-t border-gray-600/50 p-4">
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getContextIcon(selectedWord.context)}</span>
                    <h4 className="font-medium text-cyan-300">Correct: "{selectedWord.word}"</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Confidence:</span>
                    <span className={`text-sm font-medium ${getConfidenceColor(selectedWord.confidence)}`}>
                      {Math.round(selectedWord.confidence * 100)}% ({getConfidenceLabel(selectedWord.confidence)})
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  {selectedWord.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleWordCorrection(selectedWord.word, suggestion)}
                      className="w-full text-left px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 hover:border-cyan-500/50 rounded-lg transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">{suggestion}</span>
                        {index === 0 && <span className="text-xs text-cyan-400">(recommended)</span>}
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedWord(null)}
                    className="px-3 py-2 text-sm bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleWordCorrection(selectedWord.word, selectedWord.word)}
                    className="px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Keep Original
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Footer */}
      <div className="bg-gray-800/30 border-t border-gray-600/50 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-300">
                {lowConfidenceWords.filter(w => w.confidence < autoAcceptThreshold).length} words need review
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">
                {Object.keys(corrections).length} corrections made
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-gray-400">Overall confidence:</span>
            <span className="text-green-400 font-medium">{ocrStats.confidence}%</span>
            <div className="w-24 bg-gray-700 rounded-full h-2">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000"
                style={{width: `${ocrStats.confidence}%`}}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OCRReviewScreen;
