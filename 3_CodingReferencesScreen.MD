import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Star, History, ExternalLink, ChevronRight, ChevronDown, Tag, Clock, Bookmark, Filter, Eye, Copy, Share, Download, Zap, Target, AlertCircle, CheckCircle } from 'lucide-react';

const CodingReferencesScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedReference, setSelectedReference] = useState(null);
  const [bookmarks, setBookmarks] = useState(['ACS 0001', 'ACS 0013', 'FAQ 142']);
  const [recentViews, setRecentViews] = useState([
    { id: 'ACS 0001', title: 'Principal Diagnosis', timestamp: '2 hours ago', category: 'ACS' },
    { id: 'FAQ 089', title: 'Coronary Angioplasty Coding', timestamp: '1 day ago', category: 'FAQ' },
    { id: 'ACS 0013', title: 'Additional Diagnoses', timestamp: '2 days ago', category: 'ACS' }
  ]);
  const [expandedSections, setExpandedSections] = useState({});

  const categories = [
    { id: 'all', label: 'All References', count: 234, icon: BookOpen, color: 'cyan' },
    { id: 'acs', label: 'Australian Coding Standards', count: 89, icon: Target, color: 'green' },
    { id: 'nca', label: 'National Coding Advice', count: 156, icon: Zap, color: 'yellow' },
    { id: 'ccpf', label: 'Clinical Coding Practice Framework', count: 45, icon: CheckCircle, color: 'purple' },
    { id: 'icd10am', label: 'ICD-10-AM Guidelines', count: 78, icon: BookOpen, color: 'blue' },
    { id: 'achi', label: 'ACHI Guidelines', count: 67, icon: AlertCircle, color: 'pink' }
  ];

  const references = [
    {
      id: 'ACS 0001',
      title: 'Principal Diagnosis',
      category: 'Australian Coding Standards',
      type: 'ACS',
      description: 'The condition established after study to be chiefly responsible for occasioning the patient\'s episode of admitted patient care.',
      content: `ACS 0001 - Principal Diagnosis

DEFINITION:
The principal diagnosis is defined as the condition established after study to be chiefly responsible for occasioning the patient's episode of admitted patient care.

CODING RULES:
1. The principal diagnosis should be selected according to the following guidelines
2. When a patient is admitted with a symptom or sign and the underlying cause is subsequently identified, code the underlying cause as the principal diagnosis
3. When no underlying cause can be identified, the symptom or sign should be coded as the principal diagnosis

EXAMPLES:
• Patient admitted with chest pain, later diagnosed with myocardial infarction → Code: I21.9 (Acute myocardial infarction, unspecified)
• Patient admitted with abdominal pain, no underlying cause found → Code: R10.9 (Unspecified abdominal pain)

RELATED STANDARDS:
- ACS 0002: Additional Diagnoses
- ACS 0013: Clinical Significance

CLINICAL CONTEXT:
This standard is fundamental to accurate episode coding and directly impacts DRG assignment and hospital funding. Incorrect principal diagnosis selection can result in inappropriate resource allocation and compliance issues.

UPDATES:
Last updated: 1 July 2025 (Thirteenth Edition)
Next review: July 2028`,
      tags: ['diagnosis', 'principal', 'admission', 'fundamental'],
      lastUpdated: '1 July 2025',
      difficulty: 'Fundamental',
      usage: 'High',
      clinicalRelevance: 95
    },
    {
      id: 'ACS 0013',
      title: 'Additional Diagnoses - Clinical Significance',
      category: 'Australian Coding Standards',
      type: 'ACS',
      description: 'Criteria for determining clinical significance of additional diagnoses in hospital episodes.',
      content: `ACS 0013 - Additional Diagnoses - Clinical Significance

OVERVIEW:
An additional diagnosis is a condition that exists at the time of admission, or develops subsequently, or affects the treatment received and/or length of stay.

CONDITIONS MUST MEET ONE OR MORE OF THE FOLLOWING CRITERIA:
1. Clinical evaluation - requiring examination, review of history, or consultation
2. Therapeutic treatment - medication, surgery, physiotherapy, or other therapeutic intervention
3. Diagnostic procedures - laboratory tests, imaging, monitoring, or other investigations
4. Extended length of hospital stay - condition directly contributes to increased LOS
5. Increased nursing care and/or monitoring - additional observations, interventions

EXAMPLES OF CLINICALLY SIGNIFICANT CONDITIONS:
• Hypertension requiring medication adjustment or monitoring
• Diabetes mellitus requiring blood glucose monitoring or insulin adjustment
• Previous myocardial infarction affecting current treatment decisions
• Chronic kidney disease influencing medication dosing

EXAMPLES OF NON-SIGNIFICANT CONDITIONS:
• Resolved conditions not affecting current care (e.g., appendectomy 10 years ago)
• Chronic stable conditions requiring no intervention (e.g., well-controlled hypothyroidism)
• Incidental findings not affecting treatment (e.g., small renal cyst on imaging)

CODING TIPS:
- Document clearly why each additional diagnosis is clinically significant
- Consider impact on clinical decision-making, not just presence of condition
- When in doubt, consult with clinical staff about relevance to current episode`,
      tags: ['additional', 'diagnosis', 'significance', 'criteria', 'clinical'],
      lastUpdated: '1 July 2025',
      difficulty: 'Intermediate',
      usage: 'High',
      clinicalRelevance: 92
    },
    {
      id: 'FAQ 089',
      title: 'Coronary Angioplasty with Stent Insertion',
      category: 'National Coding Advice',
      type: 'FAQ',
      description: 'Guidance on coding percutaneous coronary interventions with various stent types.',
      content: `FAQ 089 - Coronary Angioplasty with Stent Insertion

QUESTION:
How should percutaneous coronary angioplasty with stent insertion be coded when multiple vessels are treated?

ANSWER:
When coding percutaneous coronary angioplasty with stent insertion:

SINGLE VESSEL:
- 38300-01 [1504] Percutaneous transluminal coronary angioplasty with stent insertion, single vessel

MULTIPLE VESSELS:
- 38300-02 [1504] Percutaneous transluminal coronary angioplasty with stent insertion, multiple vessels

STENT TYPE CONSIDERATIONS:
• Drug-eluting stents: Use same codes as above - stent type does not affect procedure code selection
• Bare metal stents: Use same codes as above
• Bio-resorbable stents: Use same codes as above

CODING GUIDELINES:
• Code one procedure regardless of the number of stents inserted per vessel
• Multiple vessels = treatment of 2 or more epicardial coronary arteries
• Include any associated balloon angioplasty in the same procedure code
• Do not separately code balloon angioplasty when performed as part of stenting procedure

VESSEL COUNTING:
• Left main = counts as one vessel
• LAD, LCX, RCA = each counts as one vessel
• Diagonal and marginal branches count with their parent vessel
• Posterior descending artery (PDA) counts with RCA or LCX depending on dominance

RELATED PROCEDURES:
- 38303-00: Coronary atherectomy
- 38306-00: Insertion of coronary artery stent, percutaneous approach
- 38312-00: Percutaneous transluminal coronary angioplasty, single vessel

CLINICAL SCENARIOS:
1. LAD stent + RCA stent = Multiple vessel (38300-02)
2. LAD stent + diagonal stent = Single vessel (38300-01)
3. RCA stent + PDA stent = Single vessel (38300-01)`,
      tags: ['angioplasty', 'stent', 'coronary', 'PCI', 'procedures', 'cardiology'],
      lastUpdated: '15 June 2025',
      difficulty: 'Advanced',
      usage: 'Medium',
      clinicalRelevance: 88
    },
    {
      id: 'CCPF 001',
      title: 'Clinical Coder Competency Requirements',
      category: 'Clinical Coding Practice Framework',
      type: 'CCPF',
      description: 'Essential competencies required for clinical coding professionals in Australia.',
      content: `Clinical Coding Practice Framework - Competency Requirements

CORE COMPETENCIES:
1. Medical Terminology and Anatomy
   - Understanding of body systems and medical terminology
   - Ability to interpret clinical documentation
   - Knowledge of disease processes and treatments

2. Disease Processes and Clinical Medicine
   - Pathophysiology understanding
   - Treatment modalities and outcomes
   - Clinical decision-making processes

3. ICD-10-AM/ACHI/ACS Application
   - Proficient use of classification systems
   - Understanding of coding conventions
   - Application of Australian Coding Standards

4. Healthcare System Knowledge
   - Hospital operations and clinical workflows
   - Multidisciplinary team roles
   - Quality assurance processes

5. Information Management
   - Data quality and integrity
   - Privacy and confidentiality requirements
   - Documentation standards

6. Quality Assurance
   - Self-review and error identification
   - Peer review processes
   - Continuous improvement practices

EDUCATION REQUIREMENTS:
• Completion of approved clinical coding course (minimum 40 hours theory)
• Minimum 40 hours supervised practical experience
• Annual continuing professional development (20 hours minimum)
• Regular competency assessments

CERTIFICATION LEVELS:
• Foundation Level: Basic coding under supervision
• Intermediate Level: Independent coding of routine cases
• Advanced Level: Complex case coding and mentoring capabilities
• Expert Level: Training delivery and quality review responsibilities

ASSESSMENT METHODS:
- Written examination covering theory and standards
- Practical coding assessment using real cases
- Ongoing performance monitoring and metrics
- Peer review and feedback processes
- Professional development portfolio maintenance`,
      tags: ['competency', 'training', 'certification', 'education', 'professional'],
      lastUpdated: '1 January 2025',
      difficulty: 'Foundation',
      usage: 'Medium',
      clinicalRelevance: 75
    }
  ];

  const filteredReferences = references.filter(ref => {
    const matchesSearch = searchTerm === '' || 
      ref.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeCategory === 'all' || 
      (activeCategory === 'acs' && ref.type === 'ACS') ||
      (activeCategory === 'nca' && ref.type === 'FAQ') ||
      (activeCategory === 'ccpf' && ref.type === 'CCPF');
    
    return matchesSearch && matchesCategory;
  });

  const toggleBookmark = (referenceId) => {
    setBookmarks(prev => 
      prev.includes(referenceId) 
        ? prev.filter(id => id !== referenceId)
        : [...prev, referenceId]
    );
  };

  const viewReference = (reference) => {
    setSelectedReference(reference);
    setRecentViews(prev => {
      const filtered = prev.filter(item => item.id !== reference.id);
      return [
        { id: reference.id, title: reference.title, timestamp: 'Just now', category: reference.type },
        ...filtered
      ].slice(0, 10);
    });
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'ACS': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'FAQ': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'CCPF': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Foundation': return 'text-green-400';
      case 'Intermediate': return 'text-yellow-400';
      case 'Advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : 'gray';
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-600/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Coding References & Standards</h2>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-purple-300">Australian Thirteenth Edition</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">ICD-10-AM/ACHI/ACS</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search standards, advice, and guidelines..."
                className="w-96 bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>
            <button className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2 rounded-lg transition-all duration-200">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-xs text-gray-400">Total References</div>
                <div className="text-sm font-semibold text-white">{references.length}</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Bookmark className="w-4 h-4 text-yellow-400" />
              <div>
                <div className="text-xs text-gray-400">Bookmarked</div>
                <div className="text-sm font-semibold text-white">{bookmarks.length}</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-green-400" />
              <div>
                <div className="text-xs text-gray-400">Recently Viewed</div>
                <div className="text-sm font-semibold text-white">{recentViews.length}</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-xs text-gray-400">Search Results</div>
                <div className="text-sm font-semibold text-white">{filteredReferences.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Categories and Navigation */}
        <div className="w-80 bg-gray-800/30 border-r border-gray-600/50 flex flex-col">
          {/* Categories */}
          <div className="p-4 border-b border-gray-600/50">
            <h3 className="font-semibold text-white mb-3 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Categories
            </h3>
            <div className="space-y-1">
              {categories.map(category => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                      activeCategory === category.id 
                        ? `bg-${category.color}-500/20 text-${category.color}-300 border border-${category.color}-500/30` 
                        : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent className="w-4 h-4" />
                      <span>{category.label}</span>
                    </div>
                    <span className="text-xs bg-gray-600/50 text-gray-300 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bookmarks */}
          <div className="p-4 border-b border-gray-600/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white flex items-center">
                <Bookmark className="w-4 h-4 mr-2 text-yellow-400" />
                Bookmarks
              </h3>
              <button 
                onClick={() => toggleSection('bookmarks')}
                className="text-gray-400 hover:text-white"
              >
                {expandedSections.bookmarks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            {(expandedSections.bookmarks !== false) && (
              <div className="space-y-2">
                {bookmarks.map(bookmarkId => {
                  const ref = references.find(r => r.id === bookmarkId);
                  return ref ? (
                    <button
                      key={bookmarkId}
                      onClick={() => viewReference(ref)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-lg transition-colors"
                    >
                      <div className="font-medium">{ref.id}</div>
                      <div className="text-xs text-gray-500 truncate">{ref.title}</div>
                    </button>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Recent Views */}
          <div className="p-4 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white flex items-center">
                <History className="w-4 h-4 mr-2 text-green-400" />
                Recent Views
              </h3>
              <button 
                onClick={() => toggleSection('recent')}
                className="text-gray-400 hover:text-white"
              >
                {expandedSections.recent ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            {(expandedSections.recent !== false) && (
              <div className="space-y-2">
                {recentViews.map(item => (
                  <div key={`${item.id}-${item.timestamp}`} className="px-3 py-2 text-sm bg-gray-700/30 rounded-lg">
                    <div className="font-medium text-gray-300">{item.id}</div>
                    <div className="text-xs text-gray-500 truncate">{item.title}</div>
                    <div className="text-xs text-gray-400 flex items-center mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {item.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Middle Panel - Reference List */}
        <div className="w-1/2 bg-gray-800/20 border-r border-gray-600/50 flex flex-col">
          <div className="p-4 border-b border-gray-600/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {activeCategory === 'all' ? 'All References' : categories.find(c => c.id === activeCategory)?.label}
              </h3>
              <span className="text-sm text-gray-400">
                {filteredReferences.length} results
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-gray-600/30">
              {filteredReferences.map(reference => (
                <div
                  key={reference.id}
                  onClick={() => viewReference(reference)}
                  className={`p-4 cursor-pointer hover:bg-gray-700/30 transition-colors ${
                    selectedReference?.id === reference.id ? 'bg-cyan-500/10 border-l-4 border-l-cyan-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-mono text-sm font-bold text-cyan-300">
                          {reference.id}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs border ${getTypeColor(reference.type)}`}>
                          {reference.type}
                        </span>
                        <span className={`text-xs ${getDifficultyColor(reference.difficulty)}`}>
                          {reference.difficulty}
                        </span>
                      </div>
                      <h4 className="font-semibold text-white mb-1">{reference.title}</h4>
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">{reference.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {reference.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-600/50 text-gray-300"
                            >
                              <Tag className="h-2 w-2 mr-1" />
                              {tag}
                            </span>
                          ))}
                          {reference.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{reference.tags.length - 3} more</span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>Usage: {reference.usage}</span>
                          <span>•</span>
                          <span>{reference.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(reference.id);
                      }}
                      className={`p-1 rounded transition-colors ${
                        bookmarks.includes(reference.id)
                          ? 'text-yellow-400 hover:text-yellow-500'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <Star className={`h-4 w-4 ${bookmarks.includes(reference.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Reference Content Viewer */}
        <div className="w-1/2 bg-gray-800/10 flex flex-col">
          {selectedReference ? (
            <>
              <div className="p-4 border-b border-gray-600/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-mono text-xl font-bold text-cyan-300">
                        {selectedReference.id}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs border ${getTypeColor(selectedReference.type)}`}>
                        {selectedReference.type}
                      </span>
                      <span className={`text-sm ${getDifficultyColor(selectedReference.difficulty)}`}>
                        {selectedReference.difficulty}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">
                      {selectedReference.title}
                    </h2>
                    <p className="text-gray-400 text-sm mb-3">{selectedReference.category}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Clinical Relevance: {selectedReference.clinicalRelevance}%</span>
                      <span>Usage: {selectedReference.usage}</span>
                      <span>Updated: {selectedReference.lastUpdated}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleBookmark(selectedReference.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        bookmarks.includes(selectedReference.id)
                          ? 'text-yellow-400 hover:text-yellow-500 bg-yellow-400/10'
                          : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                      }`}
                    >
                      <Star className={`h-5 w-5 ${bookmarks.includes(selectedReference.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                      <Copy className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                      <Share className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                      <ExternalLink className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-300">
                      {selectedReference.content}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-600/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {selectedReference.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-600/50 text-gray-300 hover:bg-gray-600/70 transition-colors cursor-pointer"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">
                    Last updated: {selectedReference.lastUpdated}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500 max-w-md">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Select a Reference</h3>
                <p className="text-gray-500">Choose from the list to view detailed coding standards, guidelines, and advice</p>
                <div className="mt-6 space-y-2 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded"></div>
                    <span>ACS - Australian Coding Standards</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                    <span>FAQ - National Coding Advice</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-purple-400 rounded"></div>
                    <span>CCPF - Practice Framework</span>
                  </div>
                </div>
              </div>
            </div>
