"use client";
import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  BarChart3, 
  MessageCircle, 
  Download, 
  Info, 
  X,
  TrendingDown,
  TrendingUp,
  Minus,
  Target
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

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
    enrollmentStatus: "Enrolled",
    tumors: [
      { id: "T1", location: "Lung", baseline: 45, current: 25, sizeChange: -44, response: "PR" },
      { id: "T2", location: "Liver", baseline: 30, current: 18, sizeChange: -40, response: "PR" }
    ],
    overallResponse: "PR",
    qolBaseline: 78,
    qolCurrent: 86,
    adverseEventsCount: 4,
    severeAeFlag: "No",
    secondaryInfection: "No",
    protocolDeviations: "None"
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
    enrollmentStatus: "Enrolled",
    tumors: [
      { id: "T1", location: "Mediastinum", baseline: 52, current: 15, sizeChange: -71, response: "CR" }
    ],
    overallResponse: "CR",
    qolBaseline: 60,
    qolCurrent: 78,
    adverseEventsCount: 5,
    severeAeFlag: "No",
    secondaryInfection: "Yes - Sepsis",
    protocolDeviations: "Eligibility Violation"
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
    enrollmentStatus: "Enrolled",
    tumors: [
      { id: "T1", location: "Right Lung", baseline: 35, current: 40, sizeChange: 14, response: "SD" },
      { id: "T2", location: "Lymph Node", baseline: 20, current: 25, sizeChange: 25, response: "PD" }
    ],
    overallResponse: "PD",
    qolBaseline: 92,
    qolCurrent: 73,
    adverseEventsCount: 1,
    severeAeFlag: "Yes",
    secondaryInfection: "Yes - Pneumonia",
    protocolDeviations: "None"
  }
];

const TumorMetrics = ({ patients = defaultPatients, openChatPanel }) => {
  const [filters, setFilters] = useState({
    stages: [],
    egfrMutation: [],
    alkFusion: [],
    showSevereProgressionOnly: false
  });
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDetail, setShowPatientDetail] = useState(false);
  const [viewMode, setViewMode] = useState('overall');

  const calculateOverallMetrics = (patient) => {
    if (viewMode === 'overall') {
      const overallChange = patient.tumors.reduce((sum, tumor) => sum + tumor.sizeChange, 0) / patient.tumors.length;
      return {
        change: overallChange,
        response: patient.overallResponse,
        tumorCount: patient.tumors.length
      };
    } else if (viewMode === 'target') {
      const targetTumor = patient.tumors[0];
      return {
        change: targetTumor.sizeChange,
        response: targetTumor.response,
        tumorCount: patient.tumors.length,
        tumorInfo: targetTumor
      };
    }
    return null;
  };

  const filteredPatients = useMemo(() => {
    let filtered = patients.filter(p => p.enrollmentStatus === 'Enrolled');

    if (filters.stages.length > 0) {
      filtered = filtered.filter(p => filters.stages.includes(p.cancerStage));
    }

    if (filters.egfrMutation.length > 0) {
      filtered = filtered.filter(p => filters.egfrMutation.includes(p.egfrMutation));
    }

    if (filters.alkFusion.length > 0) {
      filtered = filtered.filter(p => filters.alkFusion.includes(p.alkFusion));
    }

    if (filters.showSevereProgressionOnly) {
      filtered = filtered.filter(p => {
        const metrics = calculateOverallMetrics(p);
        return metrics && metrics.change >= 20;
      });
    }

    return filtered;
  }, [patients, filters, viewMode]);

  const chartData = useMemo(() => {
    if (viewMode === 'individual') {
      const allTumors = [];
      filteredPatients.forEach(patient => {
        patient.tumors.forEach((tumor, index) => {
          allTumors.push({
            patientId: `${patient.id}-${tumor.id}`,
            displayId: `${patient.id}.${tumor.id}`,
            tumorChange: tumor.sizeChange,
            bestResponse: tumor.response,
            patient: patient,
            tumor: tumor,
            tumorLocation: tumor.location
          });
        });
      });
      return allTumors.sort((a, b) => a.tumorChange - b.tumorChange);
    } else {
      return filteredPatients
        .map(patient => {
          const metrics = calculateOverallMetrics(patient);
          return {
            patientId: patient.id,
            tumorChange: metrics.change,
            bestResponse: metrics.response,
            patient: patient,
            tumorCount: metrics.tumorCount,
            viewMode: viewMode
          };
        })
        .sort((a, b) => a.tumorChange - b.tumorChange);
    }
  }, [filteredPatients, viewMode]);

  const summaryMetrics = useMemo(() => {
    let dataForMetrics;
    
    if (viewMode === 'individual') {
      dataForMetrics = [];
      filteredPatients.forEach(patient => {
        patient.tumors.forEach(tumor => {
          dataForMetrics.push({ sizeChange: tumor.sizeChange });
        });
      });
    } else {
      dataForMetrics = filteredPatients.map(patient => {
        const metrics = calculateOverallMetrics(patient);
        return { sizeChange: metrics.change };
      });
    }
    
    const responders = dataForMetrics.filter(item => item.sizeChange <= -30).length;
    const stableDisease = dataForMetrics.filter(item => item.sizeChange > -30 && item.sizeChange < 20).length;
    const progressors = dataForMetrics.filter(item => item.sizeChange >= 20).length;
    
    return {
      responders,
      stableDisease,
      progressors,
      total: dataForMetrics.length,
      totalPatients: filteredPatients.length
    };
  }, [filteredPatients, viewMode]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (filterType === 'showSevereProgressionOnly') {
        return { ...prev, [filterType]: value };
      }
      
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

  const handleBarClick = (data) => {
    setSelectedPatient(data.patient);
    setShowPatientDetail(true);
  };

  const exportToCSV = () => {
    const headers = ['Patient ID', 'Tumor Size Change (%)', 'Best Response', 'Cancer Type', 'Stage'];
    const csvData = chartData.map(item => [
      item.patientId,
      item.tumorChange,
      item.bestResponse,
      item.patient.cancerType,
      item.patient.cancerStage
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tumor_metrics_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    alert('PDF export functionality would be implemented with a library like jsPDF or Puppeteer');
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-cyan-500/50 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">
            {viewMode === 'individual' ? data.displayId : data.patientId}
          </p>
          {viewMode === 'individual' && (
            <p className="text-cyan-400 text-sm">Location: {data.tumorLocation}</p>
          )}
          {viewMode === 'overall' && data.tumorCount > 1 && (
            <p className="text-cyan-400 text-sm">Tumors: {data.tumorCount} (averaged)</p>
          )}
          {viewMode === 'target' && data.tumorCount > 1 && (
            <p className="text-cyan-400 text-sm">Target tumor (of {data.tumorCount})</p>
          )}
          <p className="text-cyan-400">
            Change: <span className="font-bold">{data.tumorChange > 0 ? '+' : ''}{data.tumorChange.toFixed(1)}%</span>
          </p>
          <p className="text-cyan-400">
            Response: <span className="font-bold">{data.bestResponse}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (change) => {
    if (change <= -30) return '#10b981';
    if (change < 20) return '#f59e0b';
    return '#ef4444';
  };

  const stageOptions = ['I', 'II', 'III', 'IV'];
  const egfrOptions = ['Positive', 'Negative'];
  const alkOptions = ['Positive', 'Negative'];

  const PatientDetailPanel = ({ patient, onClose }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 border border-cyan-500/50 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gray-800/80 border-b border-gray-600/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{patient.id}</h2>
                <p className="text-cyan-300">Tumor Response Analysis</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-700/50 rounded-full flex items-center justify-center hover:bg-gray-600/50 transition-colors duration-200"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Tumor Assessment</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white">Total Tumors:</span>
                  <span className="text-white font-bold">{patient.tumors.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">Overall Response:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    patient.overallResponse === 'CR' ? 'bg-green-500/20 text-green-400' :
                    patient.overallResponse === 'PR' ? 'bg-blue-500/20 text-blue-400' :
                    patient.overallResponse === 'SD' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {patient.overallResponse}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-white mb-2 block">Individual Tumors:</span>
                  <div className="space-y-2">
                    {patient.tumors.map((tumor, index) => (
                      <div key={tumor.id} className="bg-gray-700/50 rounded p-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white text-sm">{tumor.id} ({tumor.location})</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            tumor.sizeChange < 0 ? 'bg-green-500/20 text-green-400' : 
                            tumor.sizeChange < 20 ? 'bg-amber-500/20 text-amber-400' : 
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {tumor.sizeChange > 0 ? '+' : ''}{tumor.sizeChange}%
                          </span>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span className="text-white">Baseline: {tumor.baseline}mm</span>
                          <span className="text-white">Current: {tumor.current}mm</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Patient Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white">Cancer Type:</span>
                  <span className="text-white">{patient.cancerType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">Stage:</span>
                  <span className="text-white">{patient.cancerStage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">Age/Sex:</span>
                  <span className="text-white">{patient.age}y, {patient.sex}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">Location:</span>
                  <span className="text-white">{patient.location}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Biomarker Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-white">EGFR:</span>
                <span className={`px-2 py-1 rounded text-xs ${patient.egfrMutation === 'Positive' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                  {patient.egfrMutation}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">ALK:</span>
                <span className={`px-2 py-1 rounded text-xs ${patient.alkFusion === 'Positive' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                  {patient.alkFusion}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">PD-L1:</span>
                <span className="text-white">{patient.pdl1Expression}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Tumor Metrics</h2>
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
            <span>Chat with Docs</span>
          </button>
        </div>
        <p className="text-white">
          Percentage change in tumor size from baseline for each enrolled patient. 
          Negative values indicate tumor shrinkage, positive values indicate growth.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-3">View Mode</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="viewMode"
                    value="overall"
                    checked={viewMode === 'overall'}
                    onChange={(e) => setViewMode(e.target.value)}
                    className="text-blue-400 bg-gray-700 border-gray-600 focus:ring-blue-500"
                  />
                  <span className="text-white">Overall Patient Response</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="viewMode"
                    value="target"
                    checked={viewMode === 'target'}
                    onChange={(e) => setViewMode(e.target.value)}
                    className="text-blue-400 bg-gray-700 border-gray-600 focus:ring-blue-500"
                  />
                  <span className="text-white">Target Tumor Only</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="viewMode"
                    value="individual"
                    checked={viewMode === 'individual'}
                    onChange={(e) => setViewMode(e.target.value)}
                    className="text-blue-400 bg-gray-700 border-gray-600 focus:ring-blue-500"
                  />
                  <span className="text-white">All Individual Tumors</span>
                </label>
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
                      className="text-blue-400 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-white">Stage {stage}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-3">EGFR Mutation</label>
              <div className="space-y-2">
                {egfrOptions.map(option => (
                  <label key={option} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.egfrMutation.includes(option)}
                      onChange={() => handleFilterChange('egfrMutation', option)}
                      className="text-blue-400 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-white">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-3">ALK Fusion</label>
              <div className="space-y-2">
                {alkOptions.map(option => (
                  <label key={option} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.alkFusion.includes(option)}
                      onChange={() => handleFilterChange('alkFusion', option)}
                      className="text-blue-400 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-white">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.showSevereProgressionOnly}
                  onChange={(e) => handleFilterChange('showSevereProgressionOnly', e.target.checked)}
                  className="text-red-400 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                />
                <span className="text-white text-sm">Show Severe Progression Only (≥20%)</span>
              </label>
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

        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingDown className="w-5 h-5 text-green-400" />
                <span className="text-white text-sm">Responders</span>
              </div>
              <div className="text-2xl font-bold text-green-400">{summaryMetrics.responders}</div>
              <div className="text-xs text-white">≤-30% change</div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Minus className="w-5 h-5 text-amber-400" />
                <span className="text-white text-sm">Stable Disease</span>
              </div>
              <div className="text-2xl font-bold text-amber-400">{summaryMetrics.stableDisease}</div>
              <div className="text-xs text-white">-30% to +20%</div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-red-400" />
                <span className="text-white text-sm">Progressors</span>
              </div>
              <div className="text-2xl font-bold text-red-400">{summaryMetrics.progressors}</div>
              <div className="text-xs text-white">≥+20% change</div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-cyan-400" />
                <span className="text-white text-sm">Total</span>
              </div>
              <div className="text-2xl font-bold text-cyan-400">{summaryMetrics.total}</div>
              <div className="text-xs text-white">
                {viewMode === 'individual' ? 'Total tumors' : 'Enrolled patients'}
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Activity className="w-5 h-5 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">
                  {viewMode === 'overall' ? 'Overall Patient Response' : 
                   viewMode === 'target' ? 'Target Tumor Response' : 
                   'Individual Tumor Response'}
                </h3>
              </div>
              <div className="text-sm text-white">
                Click bar for details • {chartData.length} {viewMode === 'individual' ? 'tumors' : 'patients'} shown
                {viewMode === 'individual' && summaryMetrics.totalPatients && (
                  <span> from {summaryMetrics.totalPatients} patients</span>
                )}
              </div>
            </div>

            <div className="h-80 mb-4 overflow-x-auto">
              <div style={{ minWidth: `${Math.max(chartData.length * 60, 600)}px`, height: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="patientId" 
                      stroke="#ffffff"
                      fontSize={11}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      stroke="#ffffff"
                      fontSize={12}
                      label={{ value: 'Tumor Size Change (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#ffffff' } }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={-30} stroke="#10b981" strokeDasharray="2 2" label={{ value: "Response Threshold", position: "topRight", fill: "#ffffff" }} />
                    <ReferenceLine y={20} stroke="#ef4444" strokeDasharray="2 2" label={{ value: "Progression Threshold", position: "topRight", fill: "#ffffff" }} />
                    <ReferenceLine y={0} stroke="#6b7280" />
                    <Bar 
                      dataKey="tumorChange" 
                      onClick={handleBarClick}
                      className="cursor-pointer"
                    >
                      {chartData.map((entry, index) => (
                        <Bar key={`cell-${index}`} fill={getBarColor(entry.tumorChange)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-white">Response (≤-30%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-amber-500 rounded"></div>
                <span className="text-white">Stable (-30% to +20%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-white">Progression (≥+20%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPatientDetail && selectedPatient && (
        <PatientDetailPanel
          patient={selectedPatient}
          onClose={() => {
            setShowPatientDetail(false);
            setSelectedPatient(null);
          }}
        />
      )}
    </div>
  );
};

export default TumorMetrics;
