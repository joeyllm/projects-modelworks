"use client";
import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  Shield, 
  MessageCircle, 
  Download, 
  TrendingUp,
  TrendingDown,
  Users,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

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
    qolBaseline: 92,
    qolCurrent: 73,
    adverseEventsCount: 1,
    severeAeFlag: "Yes",
    secondaryInfection: "Yes - Pneumonia",
    protocolDeviations: "None"
  },
  {
    id: "P004",
    age: 75,
    sex: "Other",
    cancerType: "Lymphoma",
    cancerStage: "III",
    egfrMutation: "Positive",
    pdl1Expression: 21,
    alkFusion: "Positive",
    location: "Canberra, ACT",
    state: "ACT",
    enrollmentStatus: "Enrolled",
    qolBaseline: 60,
    qolCurrent: 72,
    adverseEventsCount: 4,
    severeAeFlag: "Yes",
    secondaryInfection: "No",
    protocolDeviations: "Eligibility Violation"
  },
  {
    id: "P005",
    age: 66,
    sex: "Other",
    cancerType: "Melanoma",
    cancerStage: "II",
    egfrMutation: "Negative",
    pdl1Expression: 90,
    alkFusion: "Negative",
    location: "Sydney, NSW",
    state: "NSW",
    enrollmentStatus: "Enrolled",
    qolBaseline: 83,
    qolCurrent: 87,
    adverseEventsCount: 2,
    severeAeFlag: "Yes",
    secondaryInfection: "Yes - COVID-19",
    protocolDeviations: "None"
  },
  {
    id: "P006",
    age: 28,
    sex: "Female",
    cancerType: "Breast Cancer",
    cancerStage: "IV",
    egfrMutation: "Negative",
    pdl1Expression: 45,
    alkFusion: "Positive",
    location: "Brisbane, QLD",
    state: "QLD",
    enrollmentStatus: "Enrolled",
    qolBaseline: 55,
    qolCurrent: 68,
    adverseEventsCount: 3,
    severeAeFlag: "No",
    secondaryInfection: "Yes - Pneumonia",
    protocolDeviations: "Missed Visit"
  }
];

const OutcomesSafety = ({ patients = defaultPatients, openChatPanel }) => {
  const [activeTab, setActiveTab] = useState('Outcomes');
  const [filters, setFilters] = useState({
    stages: [],
    egfrMutation: [],
    alkFusion: []
  });

  const tabs = [
    { id: 'Outcomes', icon: Activity, color: 'green' },
    { id: 'Safety', icon: AlertTriangle, color: 'amber' },
    { id: 'Compliance', icon: Shield, color: 'blue' }
  ];

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

    return filtered;
  }, [patients, filters]);

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

  const getTabColors = (color, isActive) => {
    if (isActive) {
      switch (color) {
        case 'green': return 'border-green-400 text-green-400 bg-green-500/10';
        case 'amber': return 'border-amber-400 text-amber-400 bg-amber-500/10';
        case 'blue': return 'border-blue-400 text-blue-400 bg-blue-500/10';
        default: return 'border-green-400 text-green-400 bg-green-500/10';
      }
    }
    return 'border-transparent text-white hover:text-gray-300 hover:border-gray-500';
  };

  const exportData = (tabName) => {
    let data = [];
    let headers = [];

    switch (tabName) {
      case 'Outcomes':
        headers = ['Patient ID', 'Baseline QoL', 'Current QoL', 'Change', 'Cancer Type', 'Stage'];
        data = filteredPatients.map(p => [
          p.id,
          p.qolBaseline,
          p.qolCurrent,
          p.qolCurrent - p.qolBaseline,
          p.cancerType,
          p.cancerStage
        ]);
        break;
      case 'Safety':
        headers = ['Patient ID', 'Adverse Events', 'Severe AE', 'Secondary Infection', 'Cancer Type'];
        data = filteredPatients.map(p => [
          p.id,
          p.adverseEventsCount,
          p.severeAeFlag,
          p.secondaryInfection,
          p.cancerType
        ]);
        break;
      case 'Compliance':
        headers = ['Patient ID', 'Protocol Deviations', 'Cancer Type', 'Stage'];
        data = filteredPatients.map(p => [
          p.id,
          p.protocolDeviations,
          p.cancerType,
          p.cancerStage
        ]);
        break;
    }

    const csvContent = [headers, ...data]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tabName.toLowerCase()}_data_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const OutcomesTab = () => {
    const qolData = useMemo(() => {
      return [
        {
          timePoint: 'Baseline',
          avgQoL: filteredPatients.reduce((sum, p) => sum + p.qolBaseline, 0) / filteredPatients.length
        },
        {
          timePoint: 'Current',
          avgQoL: filteredPatients.reduce((sum, p) => sum + p.qolCurrent, 0) / filteredPatients.length
        }
      ];
    }, [filteredPatients]);

    const qolStats = useMemo(() => {
      const improvements = filteredPatients.filter(p => p.qolCurrent > p.qolBaseline).length;
      const declines = filteredPatients.filter(p => p.qolCurrent < p.qolBaseline).length;
      const avgImprovement = filteredPatients.reduce((sum, p) => sum + (p.qolCurrent - p.qolBaseline), 0) / filteredPatients.length;
      
      return { improvements, declines, avgImprovement };
    }, [filteredPatients]);

    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-gray-800 border border-cyan-500/50 rounded-lg p-3 shadow-lg">
            <p className="text-white font-medium">{label}</p>
            <p className="text-green-400">
              Average QoL: <span className="font-bold">{payload[0].value.toFixed(1)}</span>
            </p>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-green-400" />
              <span className="text-white text-sm">Total Patients</span>
            </div>
            <div className="text-2xl font-bold text-green-400">{filteredPatients.length}</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className="text-white text-sm">QoL Improved</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">{qolStats.improvements}</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <span className="text-white text-sm">QoL Declined</span>
            </div>
            <div className="text-2xl font-bold text-red-400">{qolStats.declines}</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-5 h-5 text-purple-400" />
              <span className="text-white text-sm">Avg Change</span>
            </div>
            <div className={`text-2xl font-bold ${qolStats.avgImprovement >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {qolStats.avgImprovement >= 0 ? '+' : ''}{qolStats.avgImprovement.toFixed(1)}
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Quality of Life Trends</h3>
            <button
              onClick={() => exportData('Outcomes')}
              className="flex items-center space-x-2 bg-green-600/80 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={qolData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="timePoint" stroke="#ffffff" />
                <YAxis stroke="#ffffff" domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="avgQoL" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Individual Patient Changes</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {filteredPatients.map(patient => {
              const change = patient.qolCurrent - patient.qolBaseline;
              return (
                <div key={patient.id} className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-xs">{patient.id.slice(-2)}</span>
                    </div>
                    <div>
                      <div className="text-white font-medium">{patient.id}</div>
                      <div className="text-white text-sm">{patient.cancerType}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-sm">
                      {patient.qolBaseline} → {patient.qolCurrent}
                    </div>
                    <div className={`text-sm font-medium ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {change >= 0 ? '+' : ''}{change}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const SafetyTab = () => {
    const aeData = useMemo(() => {
      const counts = {
        '0': filteredPatients.filter(p => p.adverseEventsCount === 0).length,
        '1-2': filteredPatients.filter(p => p.adverseEventsCount >= 1 && p.adverseEventsCount <= 2).length,
        '3-4': filteredPatients.filter(p => p.adverseEventsCount >= 3 && p.adverseEventsCount <= 4).length,
        '≥5': filteredPatients.filter(p => p.adverseEventsCount >= 5).length
      };
      
      return Object.entries(counts).map(([range, count]) => ({
        range,
        count,
        percentage: filteredPatients.length > 0 ? ((count / filteredPatients.length) * 100).toFixed(1) : 0
      }));
    }, [filteredPatients]);

    const infectionData = useMemo(() => {
      const infections = {};
      filteredPatients.forEach(p => {
        const infection = p.secondaryInfection === 'No' ? 'No infection' : 
                         p.secondaryInfection.includes('COVID-19') ? 'COVID-19' :
                         p.secondaryInfection.includes('Sepsis') ? 'Sepsis' :
                         p.secondaryInfection.includes('Pneumonia') ? 'Pneumonia' : 'Other';
        infections[infection] = (infections[infection] || 0) + 1;
      });

      const colors = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];
      
      return Object.entries(infections).map(([type, count], index) => ({
        name: type,
        value: count,
        percentage: filteredPatients.length > 0 ? ((count / filteredPatients.length) * 100).toFixed(1) : 0,
        fill: colors[index % colors.length]
      }));
    }, [filteredPatients]);

    const severeAEs = filteredPatients.filter(p => p.severeAeFlag === 'Yes').length;
    const outliers = filteredPatients.filter(p => p.adverseEventsCount >= 5);

    const AETooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
          <div className="bg-gray-800 border border-cyan-500/50 rounded-lg p-3 shadow-lg">
            <p className="text-white font-medium">{data.range} AEs</p>
            <p className="text-amber-400">Count: <span className="font-bold">{data.count}</span></p>
            <p className="text-amber-400">Percentage: <span className="font-bold">{data.percentage}%</span></p>
          </div>
        );
      }
      return null;
    };

    const InfectionTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
          <div className="bg-gray-800 border border-cyan-500/50 rounded-lg p-3 shadow-lg">
            <p className="text-white font-medium">{data.name}</p>
            <p className="text-cyan-400">Count: <span className="font-bold">{data.value}</span></p>
            <p className="text-cyan-400">Percentage: <span className="font-bold">{data.percentage}%</span></p>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-white text-sm">Severe AEs</span>
            </div>
            <div className="text-2xl font-bold text-red-400">{severeAEs}</div>
            <div className="text-xs text-white">Grade ≥3</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span className="text-white text-sm">Total AEs</span>
            </div>
            <div className="text-2xl font-bold text-amber-400">
              {filteredPatients.reduce((sum, p) => sum + p.adverseEventsCount, 0)}
            </div>
            <div className="text-xs text-white">All grades</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-purple-400" />
              <span className="text-white text-sm">Infections</span>
            </div>
            <div className="text-2xl font-bold text-purple-400">
              {filteredPatients.filter(p => p.secondaryInfection !== 'No').length}
            </div>
            <div className="text-xs text-white">Secondary</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Adverse Events Distribution</h3>
              <button
                onClick={() => exportData('Safety')}
                className="flex items-center space-x-2 bg-amber-600/80 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="range" stroke="#ffffff" />
                  <YAxis stroke="#ffffff" />
                  <Tooltip content={<AETooltip />} />
                  <Bar dataKey="count" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Secondary Infections</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={infectionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {infectionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<InfectionTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {outliers.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-red-400 mb-3">High AE Patients (≥5 events)</h4>
            <div className="space-y-2">
              {outliers.map(patient => (
                <div key={patient.id} className="flex justify-between text-sm">
                  <span className="text-white">{patient.id} ({patient.cancerType})</span>
                  <span className="text-red-400">{patient.adverseEventsCount} events</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const ComplianceTab = () => {
    const deviations = filteredPatients.filter(p => p.protocolDeviations !== 'None');
    const complianceRate = ((filteredPatients.length - deviations.length) / filteredPatients.length * 100).toFixed(1);

    const deviationTypes = useMemo(() => {
      const types = {};
      deviations.forEach(p => {
        const type = p.protocolDeviations;
        types[type] = (types[type] || 0) + 1;
      });
      return types;
    }, [deviations]);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white text-sm">Compliance Rate</span>
            </div>
            <div className="text-2xl font-bold text-green-400">{complianceRate}%</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <span className="text-white text-sm">Deviations</span>
            </div>
            <div className="text-2xl font-bold text-red-400">{deviations.length}</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span className="text-white text-sm">Missed Visits</span>
            </div>
            <div className="text-2xl font-bold text-amber-400">
              {filteredPatients.filter(p => p.protocolDeviations === 'Missed Visit').length}
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <span className="text-white text-sm">Eligibility Issues</span>
            </div>
            <div className="text-2xl font-bold text-orange-400">
              {filteredPatients.filter(p => p.protocolDeviations === 'Eligibility Violation').length}
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Protocol Deviations</h3>
            <button
              onClick={() => exportData('Compliance')}
              className="flex items-center space-x-2 bg-blue-600/80 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>

          {deviations.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-green-400 mb-2">Excellent Compliance!</h4>
              <p className="text-white">No protocol deviations detected across all enrolled patients.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700/50">
                    <th className="px-4 py-3 text-left text-white font-medium">Patient ID</th>
                    <th className="px-4 py-3 text-left text-white font-medium">Deviation Type</th>
                    <th className="px-4 py-3 text-left text-white font-medium">Cancer Type</th>
                    <th className="px-4 py-3 text-left text-white font-medium">Stage</th>
                    <th className="px-4 py-3 text-left text-white font-medium">Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600/30">
                  {deviations.map(patient => (
                    <tr key={patient.id} className="hover:bg-gray-700/30">
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          patient.protocolDeviations === 'Eligibility Violation' ? 'bg-red-500/20 text-red-400' :
                          patient.protocolDeviations === 'Missed Visit' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {patient.protocolDeviations}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white">{patient.cancerType}</td>
                      <td className="px-4 py-3 text-white">{patient.cancerStage}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          patient.protocolDeviations === 'Eligibility Violation' ? 'bg-red-500/20 text-red-400' :
                          'bg-amber-500/20 text-amber-400'
                        }`}>
                          {patient.protocolDeviations === 'Eligibility Violation' ? 'High' : 'Low'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {Object.keys(deviationTypes).length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Deviation Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(deviationTypes).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center bg-gray-700/50 rounded-lg p-3">
                  <span className="text-white">{type}</span>
                  <span className="text-amber-400 font-bold">{count} patient{count > 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const FilterPanel = () => {
    const stageOptions = ['I', 'II', 'III', 'IV'];
    const egfrOptions = ['Positive', 'Negative'];
    const alkOptions = ['Positive', 'Negative'];

    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        
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
      </div>
    );
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Outcomes':
        return <OutcomesTab />;
      case 'Safety':
        return <SafetyTab />;
      case 'Compliance':
        return <ComplianceTab />;
      default:
        return <OutcomesTab />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Outcomes & Safety</h2>
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
          Comprehensive analysis of patient-reported outcomes, adverse events, secondary infections, and protocol compliance.
        </p>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg">
        <div className="flex space-x-0 overflow-x-auto">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-6 border-b-2 transition-all duration-200 whitespace-nowrap ${getTabColors(tab.color, isActive)}`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="font-medium">{tab.id}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Panel */}
        <div className="lg:col-span-1">
          <FilterPanel />
        </div>
        
        {/* Content Area */}
        <div className="lg:col-span-3">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
};

export default OutcomesSafety;
