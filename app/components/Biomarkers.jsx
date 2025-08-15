"use client";
import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Beaker, 
  MessageCircle, 
  Download, 
  Info, 
  ChevronDown,
  BarChart3,
  Users,
  TrendingUp,
  Target
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample patient data - in production this would come from props
const defaultPatients = [
  {
    id: "P001",
    age: 32,
    sex: "Male",
    cancerType: "Melanoma",
    cancerStage: "II",
    egfrMutation: "Positive",
    pdl1Expression: 71,
    alkFusion: "Positive",
    location: "Perth, WA",
    state: "WA",
    enrollmentStatus: "Enrolled"
  },
  {
    id: "P002",
    age: 41,
    sex: "Male",
    cancerType: "Lymphoma",
    cancerStage: "I",
    egfrMutation: "Positive",
    pdl1Expression: 2,
    alkFusion: "Negative",
    location: "Sydney, NSW",
    state: "NSW",
    enrollmentStatus: "Screened"
  },
  {
    id: "P003",
    age: 47,
    sex: "Female",
    cancerType: "Non-Small Cell Lung Cancer",
    cancerStage: "I",
    egfrMutation: "Negative",
    pdl1Expression: 37,
    alkFusion: "Positive",
    location: "Melbourne, VIC",
    state: "VIC",
    enrollmentStatus: "Enrolled"
  }
];

const Biomarkers = ({ patients = defaultPatients, openChatPanel }) => {
  const [selectedBiomarker, setSelectedBiomarker] = useState('EGFR');
  const [filters, setFilters] = useState({
    stages: [],
    enrollmentStatus: ['Enrolled']
  });
  const [showTooltip, setShowTooltip] = useState(false);

  // Biomarker definitions for info tooltips
  const biomarkerInfo = {
    'EGFR': 'EGFR mutation: Presence of specific gene alterations in the Epidermal Growth Factor Receptor that may predict response to targeted therapies.',
    'ALK': 'ALK fusion: Chromosomal rearrangements involving the Anaplastic Lymphoma Kinase gene, often found in lung cancers and targetable with specific inhibitors.',
    'PD-L1': 'PD-L1 expression: Programmed Death-Ligand 1 protein levels on tumor cells, used to predict response to immunotherapy treatments.'
  };

  // Filter patients based on current filters
  const filteredPatients = useMemo(() => {
    let filtered = patients;

    if (filters.stages.length > 0) {
      filtered = filtered.filter(p => filters.stages.includes(p.cancerStage));
    }

    if (filters.enrollmentStatus.length > 0) {
      filtered = filtered.filter(p => filters.enrollmentStatus.includes(p.enrollmentStatus));
    }

    return filtered;
  }, [patients, filters]);

  // Process data for charts based on selected biomarker
  const chartData = useMemo(() => {
    if (selectedBiomarker === 'EGFR') {
      const positive = filteredPatients.filter(p => p.egfrMutation === 'Positive').length;
      const negative = filteredPatients.filter(p => p.egfrMutation === 'Negative').length;
      const total = filteredPatients.length;
      
      return [
        { 
          category: 'Positive', 
          count: positive, 
          percentage: total > 0 ? ((positive / total) * 100).toFixed(1) : 0,
          color: '#10b981'
        },
        { 
          category: 'Negative', 
          count: negative, 
          percentage: total > 0 ? ((negative / total) * 100).toFixed(1) : 0,
          color: '#6b7280'
        }
      ];
    }

    if (selectedBiomarker === 'ALK') {
      const positive = filteredPatients.filter(p => p.alkFusion === 'Positive').length;
      const negative = filteredPatients.filter(p => p.alkFusion === 'Negative').length;
      const total = filteredPatients.length;
      
      return [
        { 
          category: 'Positive', 
          count: positive, 
          percentage: total > 0 ? ((positive / total) * 100).toFixed(1) : 0,
          color: '#3b82f6'
        },
        { 
          category: 'Negative', 
          count: negative, 
          percentage: total > 0 ? ((negative / total) * 100).toFixed(1) : 0,
          color: '#6b7280'
        }
      ];
    }

    if (selectedBiomarker === 'PD-L1') {
      const bins = {
        '0-25%': filteredPatients.filter(p => p.pdl1Expression >= 0 && p.pdl1Expression <= 25).length,
        '26-50%': filteredPatients.filter(p => p.pdl1Expression >= 26 && p.pdl1Expression <= 50).length,
        '51-75%': filteredPatients.filter(p => p.pdl1Expression >= 51 && p.pdl1Expression <= 75).length,
        '76-100%': filteredPatients.filter(p => p.pdl1Expression >= 76 && p.pdl1Expression <= 100).length
      };
      const total = filteredPatients.length;
      const colors = ['#ef4444', '#f59e0b', '#8b5cf6', '#10b981'];
      
      return Object.entries(bins).map(([range, count], index) => ({
        category: range,
        count,
        percentage: total > 0 ? ((count / total) * 100).toFixed(1) : 0,
        color: colors[index]
      }));
    }

    return [];
  }, [filteredPatients, selectedBiomarker]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (selectedBiomarker === 'EGFR') {
      const positive = filteredPatients.filter(p => p.egfrMutation === 'Positive').length;
      const total = filteredPatients.length;
      return {
        positivePercentage: total > 0 ? ((positive / total) * 100).toFixed(1) : 0,
        negativePercentage: total > 0 ? (((total - positive) / total) * 100).toFixed(1) : 0,
        totalPatients: total,
        meetsCriteria: positive // Assuming positive EGFR is inclusion criteria
      };
    }

    if (selectedBiomarker === 'ALK') {
      const positive = filteredPatients.filter(p => p.alkFusion === 'Positive').length;
      const total = filteredPatients.length;
      return {
        positivePercentage: total > 0 ? ((positive / total) * 100).toFixed(1) : 0,
        negativePercentage: total > 0 ? (((total - positive) / total) * 100).toFixed(1) : 0,
        totalPatients: total,
        meetsCriteria: positive
      };
    }

    if (selectedBiomarker === 'PD-L1') {
      const expressions = filteredPatients.map(p => p.pdl1Expression);
      const mean = expressions.length > 0 ? (expressions.reduce((a, b) => a + b, 0) / expressions.length).toFixed(1) : 0;
      const median = expressions.length > 0 ? expressions.sort((a, b) => a - b)[Math.floor(expressions.length / 2)] : 0;
      const aboveThreshold = filteredPatients.filter(p => p.pdl1Expression >= 50).length; // Assuming 50% is threshold
      
      return {
        mean,
        median,
        totalPatients: filteredPatients.length,
        meetsCriteria: aboveThreshold,
        aboveThresholdPercentage: filteredPatients.length > 0 ? ((aboveThreshold / filteredPatients.length) * 100).toFixed(1) : 0
      };
    }

    return {};
  }, [filteredPatients, selectedBiomarker]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const currentValues = prev[filterType];
      const isSelected = currentValues.includes(value);
      
      return {
        ...prev,
        [filterType]: isSelected
          ? currentValues.filter(item => item !== value)
          : [...currentValues, value]
      };
    });
  };

  // Export functions
  const exportToCSV = () => {
    const headers = ['Category', 'Count', 'Percentage'];
    const csvData = chartData.map(item => [item.category, item.count, `${item.percentage}%`]);
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedBiomarker}_analysis_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // In a real app, this would generate a PDF with the chart
    alert('PDF export functionality would be implemented with a library like jsPDF or Puppeteer');
  };

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-cyan-500/50 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          <p className="text-cyan-400">
            Count: <span className="font-bold">{data.count}</span>
          </p>
          <p className="text-cyan-400">
            Percentage: <span className="font-bold">{data.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const biomarkerOptions = ['EGFR', 'ALK', 'PD-L1'];
  const stageOptions = ['I', 'II', 'III', 'IV'];
  const statusOptions = ['Enrolled', 'Screened', 'Excluded'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Beaker className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Biomarker Analysis</h2>
            <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Live</span>
            </div>
          </div>
          <button
            onClick={openChatPanel}
            className="flex items-center space-x-2 bg-purple-600/80 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Ask AI</span>
          </button>
        </div>
        <p className="text-white">
          Interactive analysis of biomarker distributions across the patient cohort. 
          Select different biomarkers and apply filters to explore molecular characteristics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-3">Biomarker Selection</label>
              <div className="space-y-2">
                {biomarkerOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => setSelectedBiomarker(option)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                      selectedBiomarker === option
                        ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                    }`}
                  >
                    {option} {option === 'EGFR' ? 'Mutation' : option === 'ALK' ? 'Fusion' : 'Expression'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-3">Cancer Stage</label>
              <div className="space-y-2">
                {stageOptions.map(stage => (
                  <label key={stage} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.stages.includes(stage)}
                      onChange={() => handleFilterChange('stages', stage)}
                      className="text-purple-400 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-white">Stage {stage}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-3">Enrollment Status</label>
              <div className="space-y-2">
                {statusOptions.map(status => (
                  <label key={status} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.enrollmentStatus.includes(status)}
                      onChange={() => handleFilterChange('enrollmentStatus', status)}
                      className="text-purple-400 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-white">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-600/50 pt-4">
              <div className="text-sm text-white mb-2">Export Options</div>
              <div className="space-y-2">
                <button
                  onClick={exportToCSV}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600/80 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-all duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={exportToPDF}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-all duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span>PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chart and Analysis */}
        <div className="lg:col-span-3 space-y-6">
          {/* Chart Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <h3 className="text-xl font-semibold text-white">
                  {selectedBiomarker} {selectedBiomarker === 'PD-L1' ? 'Expression' : selectedBiomarker === 'EGFR' ? 'Mutation' : 'Fusion'} Distribution
                </h3>
                <div className="relative">
                  <button
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="text-white hover:text-cyan-400 transition-colors duration-200"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  {showTooltip && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 bg-gray-900 border border-cyan-500/50 rounded-lg p-3 text-sm text-gray-300 z-10">
                      {biomarkerInfo[selectedBiomarker]}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-sm text-white">
                {filteredPatients.length} patients
              </div>
            </div>

            <div className="h-80 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="category" 
                    stroke="#ffffff"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#ffffff"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="count" 
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                  >
                    {chartData.map((entry, index) => (
                      <Bar key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <span className="text-white text-sm">Total Patients</span>
              </div>
              <div className="text-2xl font-bold text-white">{summaryStats.totalPatients}</div>
            </div>

            {selectedBiomarker !== 'PD-L1' ? (
              <>
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="text-white text-sm">Positive</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">{summaryStats.positivePercentage}%</div>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="w-5 h-5 text-white" />
                    <span className="text-white text-sm">Negative</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{summaryStats.negativePercentage}%</div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <span className="text-white text-sm">Mean Expression</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">{summaryStats.mean}%</div>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="w-5 h-5 text-purple-400" />
                    <span className="text-white text-sm">Median Expression</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-400">{summaryStats.median}%</div>
                </div>
              </>
            )}

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-amber-400" />
                <span className="text-white text-sm">Meets Criteria</span>
              </div>
              <div className="text-2xl font-bold text-amber-400">{summaryStats.meetsCriteria}</div>
              {selectedBiomarker === 'PD-L1' && (
                <div className="text-xs text-gray-500 mt-1">≥50% expression</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Biomarkers;
