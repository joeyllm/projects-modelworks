import React, { useState, useEffect } from 'react';
import { Heart, Brain, Shield, Zap, Globe, Database, Lock, User, Search, Filter, Star, Clock, TrendingUp, ArrowRight, Play, Settings, LogOut } from 'lucide-react';
import ClinicalCodingDemo from './ClinicalCodingDemo';

const DemoMenu = () => {
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [user, setUser] = useState({
    name: 'Admin User',
    role: 'System Administrator',
    avatar: 'AU'
  });

  const demos = [
    {
      id: 1,
      title: 'Clinical Coding Assistant',
      restricted: true,
      icon: Heart,
      category: 'Healthcare',
      description: 'AI-powered medical coding with ICD-10-AM compliance and accuracy optimization.',
      features: ['ICD-10-AM Automation', 'ACHI Procedures', 'ACS Compliance', 'AR-DRG Classification'],
      accuracy: 99.2,
      usage: 87.5,
      satisfaction: 94.8,
      status: 'active',
      lastUpdated: '2 hours ago'
    },
    {
      id: 2,
      title: 'AI Research Assistant',
      restricted: false,
      icon: Brain,
      category: 'Research',
      description: 'Advanced research automation with literature analysis and data synthesis.',
      features: ['Literature Review', 'Data Analysis', 'Citation Management', 'Report Generation'],
      accuracy: 96.8,
      usage: 92.3,
      satisfaction: 91.5,
      status: 'active',
      lastUpdated: '1 day ago'
    },
    {
      id: 3,
      title: 'Cybersecurity Monitor',
      restricted: true,
      icon: Shield,
      category: 'Security',
      description: 'Real-time threat detection and security incident response system.',
      features: ['Threat Detection', 'Incident Response', 'Vulnerability Assessment', 'Compliance Monitoring'],
      accuracy: 98.5,
      usage: 78.9,
      satisfaction: 89.2,
      status: 'maintenance',
      lastUpdated: '3 days ago'
    },
    {
      id: 4,
      title: 'Energy Optimization',
      restricted: false,
      icon: Zap,
      category: 'Infrastructure',
      description: 'Smart grid management and energy consumption optimization platform.',
      features: ['Grid Management', 'Load Balancing', 'Predictive Analytics', 'Cost Optimization'],
      accuracy: 94.2,
      usage: 85.7,
      satisfaction: 88.9,
      status: 'active',
      lastUpdated: '5 days ago'
    },
    {
      id: 5,
      title: 'Global Analytics',
      restricted: false,
      icon: Globe,
      category: 'Analytics',
      description: 'Comprehensive data analytics and business intelligence platform.',
      features: ['Data Visualization', 'Predictive Modeling', 'KPI Tracking', 'Custom Dashboards'],
      accuracy: 97.1,
      usage: 89.4,
      satisfaction: 92.7,
      status: 'active',
      lastUpdated: '1 week ago'
    },
    {
      id: 6,
      title: 'Data Management Hub',
      restricted: true,
      icon: Database,
      category: 'Data',
      description: 'Centralized data management with advanced governance and compliance.',
      features: ['Data Governance', 'Quality Control', 'Compliance Monitoring', 'Integration Tools'],
      accuracy: 99.1,
      usage: 76.8,
      satisfaction: 87.3,
      status: 'active',
      lastUpdated: '2 weeks ago'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Demos', count: demos.length },
    { id: 'Healthcare', label: 'Healthcare', count: demos.filter(d => d.category === 'Healthcare').length },
    { id: 'Research', label: 'Research', count: demos.filter(d => d.category === 'Research').length },
    { id: 'Security', label: 'Security', count: demos.filter(d => d.category === 'Security').length },
    { id: 'Infrastructure', label: 'Infrastructure', count: demos.filter(d => d.category === 'Infrastructure').length },
    { id: 'Analytics', label: 'Analytics', count: demos.filter(d => d.category === 'Analytics').length },
    { id: 'Data', label: 'Data', count: demos.filter(d => d.category === 'Data').length }
  ];

  const filteredDemos = demos.filter(demo => {
    const matchesSearch = searchTerm === '' || 
      demo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demo.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || demo.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleDemoSelect = (demo) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedDemo(demo);
      setIsTransitioning(false);
    }, 300);
  };

  const handleBackToMenu = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedDemo(null);
      setIsTransitioning(false);
    }, 300);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'maintenance': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Healthcare': return 'from-cyan-500 to-blue-600';
      case 'Research': return 'from-purple-500 to-indigo-600';
      case 'Security': return 'from-red-500 to-pink-600';
      case 'Infrastructure': return 'from-yellow-500 to-orange-600';
      case 'Analytics': return 'from-green-500 to-emerald-600';
      case 'Data': return 'from-gray-500 to-slate-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const DemoExpansion = ({ demo }) => {
    const IconComponent = demo.icon;
    
    // Add this condition for Clinical Coding Assistant
    if (demo.id === 1) { // Clinical Coding Assistant
      return <ClinicalCodingDemo onBackToMenu={handleBackToMenu} />;
    }
    
    // Default demo expansion for other demos
    return (
      <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="h-full flex flex-col bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50">
          {/* Demo Header */}
          <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-600/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${getCategoryColor(demo.category)} rounded-xl flex items-center justify-center shadow-lg`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{demo.title}</h1>
                  <p className="text-gray-400">{demo.description}</p>
                </div>
              </div>
              
              <button
                onClick={handleBackToMenu}
                className="flex items-center space-x-2 bg-gray-700/50 hover:bg-gray-600/50 text-white px-6 py-3 rounded-lg transition-all duration-200 backdrop-blur-sm border border-gray-600/30 hover:border-cyan-500/50 group"
              >
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                <span>Back to Menu</span>
              </button>
            </div>
          </div>

          {/* Demo Content */}
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Features */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Key Features</h3>
                  <div className="space-y-3">
                    {demo.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Accuracy:</span>
                      <span className="text-green-400 font-semibold">{demo.accuracy}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Usage Rate:</span>
                      <span className="text-blue-400 font-semibold">{demo.usage}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Satisfaction:</span>
                      <span className="text-purple-400 font-semibold">{demo.satisfaction}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo Placeholder */}
              <div className="mt-6 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-12">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Play className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Demo Coming Soon</h3>
                  <p className="text-gray-400 mb-6">This demo is currently under development and will be available soon.</p>
                  <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-3 rounded-lg transition-all duration-200">
                    Get Notified
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (selectedDemo) {
    return <DemoExpansion demo={selectedDemo} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/80 backdrop-blur-md border-b border-cyan-500/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Southern Cross Portal
                </h1>
                <p className="text-cyan-300 text-sm">AI-Powered Demo Showcase</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">{user.avatar}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-white">{user.name}</div>
                  <div className="text-xs text-gray-400">{user.role}</div>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search demos..."
                className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 backdrop-blur-sm"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 backdrop-blur-sm"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.label} ({category.count})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDemos.map(demo => {
            const IconComponent = demo.icon;
            return (
              <div
                key={demo.id}
                onClick={() => handleDemoSelect(demo)}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6 cursor-pointer hover:bg-gray-700/50 hover:border-cyan-500/50 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(demo.category)} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    {demo.restricted && (
                      <Lock className="w-4 h-4 text-yellow-400" />
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(demo.status)}`}>
                      {demo.status}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {demo.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {demo.description}
                </p>
                
                <div className="space-y-3 mb-4">
                  {demo.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                      <span className="text-xs text-gray-300">{feature}</span>
                    </div>
                  ))}
                  {demo.features.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{demo.features.length - 3} more features
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{demo.accuracy}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>{demo.satisfaction}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{demo.lastUpdated}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{demo.category}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredDemos.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No demos found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default DemoMenu;
