import React, { useState, useEffect } from 'react';
import { FileText, Eye, Search, Plus, X, ChevronDown, ChevronUp, Clock, User, AlertCircle, CheckCircle, Star, Edit3, Filter, Calendar, Stethoscope, Activity, Zap, Target, TrendingUp, BarChart3 } from 'lucide-react';

const EpisodeWorkspaceScreen = () => {
  const [selectedDocument, setSelectedDocument] = useState('discharge-summary');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCodes, setSelectedCodes] = useState([
    {
      id: 1,
      code: 'I21.9',
      description: 'Acute myocardial infarction, unspecified',
      type: 'diagnosis',
      category: 'Principal',
      onsetFlag: 'Y',
      confidence: 98
    },
    {
      id: 2,
      code: '38300-01',
      description: 'Percutaneous transluminal coronary angioplasty with stent insertion, single vessel',
      type: 'procedure',
      category: 'Primary',
      date: '12/07/2025',
      confidence: 95
    }
  ]);
  const [showCodeSearch, setShowCodeSearch] = useState(false);
  const [expandedDocument, setExpandedDocument] = useState(false);

  const documents = [
    {
      id: 'discharge-summary',
      title: 'Discharge Summary',
      author: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: '18/07/2025',
      status: 'reviewed',
      confidence: 98,
      keyTerms: ['STEMI', 'Angioplasty', 'Stent', 'Hypertension'],
      content: `DISCHARGE SUMMARY

Patient: John Smith (DOB: 15/03/1965)
Admission: 12/07/2025 - Discharge: 18/07/2025

PRINCIPAL DIAGNOSIS:
ST-elevation myocardial infarction (STEMI) anterior wall

SECONDARY DIAGNOSES:
- Coronary artery disease
- Essential hypertension
- Type 2 diabetes mellitus without complications

PROCEDURES PERFORMED:
- Emergency percutaneous coronary intervention (PCI)
- Coronary angioplasty with drug-eluting stent placement to LAD

CLINICAL COURSE:
Mr. Smith presented to ED with acute chest pain. ECG showed ST elevation in V2-V5 consistent with anterior STEMI. Emergency cardiac catheterization revealed 95% stenosis of proximal LAD. Successful primary PCI performed with drug-eluting stent insertion. Post-procedure course uncomplicated.

DISCHARGE MEDICATIONS:
- Aspirin 100mg daily
- Clopidogrel 75mg daily for 12 months
- Atorvastatin 40mg daily
- Metoprolol 25mg BD
- Ramipril 2.5mg daily

FOLLOW-UP:
Cardiology outpatient clinic in 6 weeks
GP follow-up in 1 week

Dr. Sarah Johnson
Consultant Cardiologist`
    },
    {
      id: 'operative-report',
      title: 'Operative Report',
      author: 'Dr. Michael Chen',
      specialty: 'Interventional Cardiology',
      date: '12/07/2025',
      status: 'pending',
      confidence: 92,
      keyTerms: ['PCI', 'LAD', 'Stent', 'Catheterization'],
      content: 'Emergency PCI procedure details...'
    },
    {
      id: 'progress-notes',
      title: 'Progress Notes',
      author: 'Ward Team',
      specialty: 'Cardiology',
      date: '12-18/07/2025',
      status: 'processing',
      confidence: 85,
      keyTerms: ['Recovery', 'Monitoring', 'Stable'],
      content: 'Daily progress notes and observations...'
    }
  ];

  const codeSearchResults = [
    {
      code: 'I25.10',
      description: 'Atherosclerotic heart disease of native coronary artery without angina pectoris',
      type: 'diagnosis',
      category: 'Additional',
      confidence: 92
    },
    {
      code: 'E11.9',
      description: 'Type 2 diabetes mellitus without complications',
      type: 'diagnosis',
      category: 'Additional',
      confidence: 88
    },
    {
      code: 'Z95.5',
      description: 'Presence of coronary angioplasty implant and graft',
      type: 'diagnosis',
      category: 'Additional',
      confidence: 85
    }
  ];

  const drgInfo = {
    drg: 'E40A',
    description: 'Circulatory Disorders except AMI w CC',
    version: 'AR-DRG 12.0',
    weight: 1.2847,
    alos: 4.8,
    actualLos: 6,
    status: 'Inlier',
    inlierRange: '2-8 days'
  };

  const addCode = (code) => {
    const newCode = {
      id: Date.now(),
      ...code,
      onsetFlag: 'Y'
    };
    setSelectedCodes([...selectedCodes, newCode]);
    setShowCodeSearch(false);
  };

  const removeCode = (codeId) => {
    setSelectedCodes(selectedCodes.filter(code => code.id !== codeId));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'reviewed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeColor = (type) => {
    return type === 'diagnosis' 
      ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      : 'bg-green-500/20 text-green-300 border-green-500/30';
  };

  const currentDocument = documents.find(doc => doc.id === selectedDocument);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50">
      {/* Content Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-600/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Episode Workspace</h2>
            <p className="text-cyan-300 text-sm">ICD-10-AM Thirteenth Edition • ACHI • Australian Coding Standards</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gray-700/50 rounded-lg px-4 py-2">
              <div className="text-xs text-gray-400">Coding Progress</div>
              <div className="text-sm font-semibold text-cyan-300">85% Complete</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg px-4 py-2">
              <div className="text-xs text-gray-400">AI Confidence</div>
              <div className="text-sm font-semibold text-green-400">96%</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-xs text-gray-400">Documents</div>
                <div className="text-sm font-semibold text-white">{documents.length}</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-green-400" />
              <div>
                <div className="text-xs text-gray-400">Codes Applied</div>
                <div className="text-sm font-semibold text-white">{selectedCodes.length}</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-xs text-gray-400">DRG</div>
                <div className="text-sm font-semibold text-white">{drgInfo.drg}</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-xs text-gray-400">Quality Score</div>
                <div className="text-sm font-semibold text-white">A+</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Document List and Content */}
        <div className="w-1/2 flex flex-col border-r border-gray-600/50">
          {/* Document Tabs */}
          <div className="bg-gray-800/30 border-b border-gray-600/50 p-2">
            <div className="flex space-x-1">
              {documents.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocument(doc.id)}
                  className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                    selectedDocument === doc.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      doc.status === 'reviewed' ? 'bg-green-400' :
                      doc.status === 'pending' ? 'bg-amber-400' :
                      'bg-blue-400'
                    }`}></div>
                    <span>{doc.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Document Header */}
          <div className="bg-gray-800/30 border-b border-gray-600/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{currentDocument.title}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Stethoscope className="w-3 h-3" />
                    <span>{currentDocument.author}</span>
                    <span>•</span>
                    <span>{currentDocument.specialty}</span>
                    <span>•</span>
                    <span>{currentDocument.date}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(currentDocument.status)}`}>
                  {currentDocument.status}
                </span>
                <div className="text-xs text-gray-400">
                  Confidence: <span className="text-green-400">{currentDocument.confidence}%</span>
                </div>
                <button
                  onClick={() => setExpandedDocument(!expandedDocument)}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  {expandedDocument ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Key Terms */}
            <div className="mt-3 flex flex-wrap gap-1">
              {currentDocument.keyTerms.map((term, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-md border border-cyan-500/30"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>

          {/* Document Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="bg-gray-900/50 rounded-lg p-4">
              <pre className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">
                {currentDocument.content}
              </pre>
            </div>

            {/* AI Suggestions */}
            <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Zap className="w-4 h-4 text-blue-400" />
                <h4 className="text-blue-300 font-medium">AI Code Suggestions</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-blue-500/20 rounded-lg p-2">
                  <div>
                    <span className="font-mono text-blue-300 text-sm">I25.10</span>
                    <p className="text-xs text-blue-200">Atherosclerotic heart disease</p>
                  </div>
                  <button className="text-blue-400 hover:text-blue-300 text-xs">
                    Add Code
                  </button>
                </div>
                <div className="flex items-center justify-between bg-blue-500/20 rounded-lg p-2">
                  <div>
                    <span className="font-mono text-blue-300 text-sm">E11.9</span>
                    <p className="text-xs text-blue-200">Type 2 diabetes mellitus</p>
                  </div>
                  <button className="text-blue-400 hover:text-blue-300 text-xs">
                    Add Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Coding Interface */}
        <div className="w-1/2 flex flex-col">
          {/* Code Search */}
          <div className="bg-gray-800/30 border-b border-gray-600/50 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <h3 className="text-lg font-semibold text-white">Code Assignment</h3>
              <button
                onClick={() => setShowCodeSearch(!showCodeSearch)}
                className="flex items-center space-x-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-3 py-1 rounded-lg text-sm transition-all duration-200"
              >
                <Plus className="w-3 h-3" />
                <span>Add Code</span>
              </button>
            </div>

            {showCodeSearch && (
              <div className="mb-4 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search ICD-10-AM / ACHI codes..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {codeSearchResults.map((code, index) => (
                    <div
                      key={index}
                      onClick={() => addCode(code)}
                      className="flex items-center justify-between bg-gray-700/50 hover:bg-gray-600/50 rounded-lg p-2 cursor-pointer transition-colors"
                    >
                      <div>
                        <span className="font-mono text-sm text-cyan-300">{code.code}</span>
                        <p className="text-xs text-gray-300">{code.description}</p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {code.confidence}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Selected Codes */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-3">
              {selectedCodes.map((code) => (
                <div
                  key={code.id}
                  className={`rounded-lg p-4 border transition-all duration-200 hover:shadow-lg ${getTypeColor(code.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-mono text-lg font-bold">
                          {code.code}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          code.category === 'Principal' || code.category === 'Primary' 
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                        }`}>
                          {code.category}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(code.type)}`}>
                          {code.type}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-200 mb-3 leading-relaxed">
                        {code.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {code.onsetFlag && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Condition Onset:</span>
                            <span className="text-green-400">{code.onsetFlag}</span>
                          </div>
                        )}
                        {code.date && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Procedure Date:</span>
                            <span className="text-white">{code.date}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-400">AI Confidence:</span>
                          <span className="text-green-400">{code.confidence}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeCode(code.id)}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {selectedCodes.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-400 mb-2">No codes assigned</h3>
                <p className="text-sm text-gray-500">Use the Add Code button to start coding this episode</p>
              </div>
            )}
          </div>

          {/* DRG Information */}
          <div className="bg-gray-800/30 border-t border-gray-600/50 p-4">
            <h4 className="text-lg font-semibold text-white mb-3">AR-DRG Classification</h4>
            
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
              <div className="text-center mb-3">
                <span className="font-mono text-2xl font-bold text-purple-300">{drgInfo.drg}</span>
                <p className="text-sm text-purple-200">{drgInfo.description}</p>
                <p className="text-xs text-gray-400">{drgInfo.version}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Relative Weight:</span>
                  <span className="text-white font-medium">{drgInfo.weight}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ALOS:</span>
                  <span className="text-white font-medium">{drgInfo.alos} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Actual LOS:</span>
                  <span className="text-white font-medium">{drgInfo.actualLos} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400 font-medium">{drgInfo.status}</span>
                </div>
              </div>
              
              <div className="mt-3 text-xs text-center text-gray-400">
                Inlier Range: {drgInfo.inlierRange}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodeWorkspaceScreen;
