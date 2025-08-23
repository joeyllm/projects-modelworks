"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from 'react';

/**
 * @todo Replace with actual source of json data
 * @todo Have consistent URL for exported json file and json file for code
 */
import patientData from './api/data/fake_clinical_trial_patients.json';

import { 
  BarChart3, 
  Activity, 
  Users, 
  Shield, 
  MessageCircle, 
  X, 
  Send, 
  Calendar,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Clock,
  FileText,
  Search,
  Dna,
  Heart,
  Database
} from 'lucide-react';

// Mock patient data - in real implementation, this would be imported from JSON

/**
 * @todo Replace with actual source of json data
 */
const mockPatients = Object.keys(patientData).map(key => patientData[key]);

const ClinicalTrialDemoMain = () => {
  const [activeTab, setActiveTab] = useState('Patient Matching');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'system',
      message: 'Welcome! I can help you analyze trial data, find patient patterns, and answer questions about the SCAI-001 study.'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Calculate summary statistics
  const enrolledPatients = mockPatients.filter(p => p.enrollmentStatus === 'Enrolled').length;
  const droppedOut = mockPatients.filter(p => p.enrollmentStatus === 'Excluded').length;
  const uniqueLocations = [...new Set(mockPatients.map(p => p.location))].length;
  const totalPatients = mockPatients.length;
  const severeAEs = mockPatients.filter(p => p.severeAeFlag === 'Yes').length;

  const tabs = [
    { id: 'Patient Matching', icon: Users, color: 'cyan' },
    { id: 'Biomarkers', icon: Dna, color: 'purple' },
    { id: 'Tumor Metrics', icon: BarChart3, color: 'blue' },
    { id: 'Patient Outcomes', icon: Heart, color: 'green' },
    { id: 'Safety & Compliance', icon: Shield, color: 'amber' }
  ];

  const handleExport = async () => {
    try {
      const response = await fetch('/data/fake_clinical_trial_patients.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'patient_data.json';
      a.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please check if the file exists.');
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = { type: 'user', message: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    const currentInput = chatInput;
    setChatInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Remove the Authorization header - handled server-side now
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a clinical research assistant...`
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

      const data = await response.json();
      const aiResponse = {
        type: 'assistant',
        message: data.choices[0].message.content
      };
      
      setChatMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Chat Error:', error);
      
      const errorResponse = {
        type: 'assistant',
        message: 'Sorry, I encountered an error. Please try again.'
      };
      
      setChatMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const PatientMatchingScreen = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Users className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl font-semibold text-white">Patient Matching Algorithm</h3>
          <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm">Active</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Eligible Patients</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">{enrolledPatients}</div>
            <div className="text-xs text-gray-500">+2 this week</div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Screening</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-cyan-400">
              {mockPatients.filter(p => p.enrollmentStatus === 'Screened').length}
            </div>
            <div className="text-xs text-gray-500">5 pending review</div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Excluded</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400">{droppedOut}</div>
            <div className="text-xs text-gray-500">Eligibility criteria</div>
          </div>
        </div>

        <div className="bg-gray-900/30 rounded-lg p-4">
          <h4 className="text-lg font-medium text-white mb-3">Recent Matches</h4>
          <div className="space-y-3">
            {mockPatients.slice(0, 3).map((patient) => (
              <div key={patient.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">{patient.id.slice(-2)}</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">{patient.id}</div>
                    <div className="text-gray-400 text-sm">{patient.cancerType} • Stage {patient.cancerStage}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    patient.enrollmentStatus === 'Enrolled' 
                      ? 'bg-green-500/20 text-green-400' 
                      : patient.enrollmentStatus === 'Screened'
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {patient.enrollmentStatus}
                  </span>
                  <div className="text-gray-400 text-sm">{patient.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const BiomarkersScreen = () => (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Dna className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-semibold text-white">Biomarker Analysis</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 rounded-lg p-4">
          <h4 className="text-lg font-medium text-white mb-4">EGFR Mutation Status</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Positive</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div className="w-16 h-2 bg-gradient-to-r from-green-500 to-green-400 rounded-full"></div>
                </div>
                <span className="text-green-400 text-sm">67%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Negative</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div className="w-8 h-2 bg-gradient-to-r from-gray-500 to-gray-400 rounded-full"></div>
                </div>
                <span className="text-gray-400 text-sm">33%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 rounded-lg p-4">
          <h4 className="text-lg font-medium text-white mb-4">PD-L1 Expression</h4>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">47.8%</div>
            <div className="text-gray-400 text-sm">Average Expression</div>
            <div className="mt-4 w-full bg-gray-700 rounded-full h-3">
              <div className="w-1/2 h-3 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TumorMetricsScreen = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <BarChart3 className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">Tumor Response Metrics</h3>
          <div className="flex items-center space-x-2 bg-blue-500/20 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-blue-400 text-sm">Real-time</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {mockPatients.filter(p => p.bestResponse === 'CR').length}
            </div>
            <div className="text-gray-400 text-sm">Complete Response</div>
            <div className="text-green-400 text-xs">CR</div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {mockPatients.filter(p => p.bestResponse === 'PR').length}
            </div>
            <div className="text-gray-400 text-sm">Partial Response</div>
            <div className="text-blue-400 text-xs">PR</div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-amber-400 mb-1">
              {mockPatients.filter(p => p.bestResponse === 'SD').length}
            </div>
            <div className="text-gray-400 text-sm">Stable Disease</div>
            <div className="text-amber-400 text-xs">SD</div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-400 mb-1">
              {mockPatients.filter(p => p.bestResponse === 'PD').length}
            </div>
            <div className="text-gray-400 text-sm">Progressive Disease</div>
            <div className="text-red-400 text-xs">PD</div>
          </div>
        </div>

        <div className="bg-gray-900/30 rounded-lg p-4">
          <h4 className="text-lg font-medium text-white mb-4">Tumor Size Changes</h4>
          <div className="space-y-3">
            {mockPatients.slice(0, 5).map((patient) => {
              const change = patient.tumorSizeChange;
              const isDecrease = change < 0;
              
              return (
                <div key={patient.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-xs">{patient.id.slice(-2)}</span>
                    </div>
                    <div>
                      <div className="text-white font-medium">{patient.id}</div>
                      <div className="text-gray-400 text-sm">{patient.bestResponse}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className={`font-medium ${isDecrease ? 'text-green-400' : 'text-red-400'}`}>
                        {change > 0 ? '+' : ''}{change}%
                      </div>
                      <div className="text-gray-400 text-xs">vs baseline</div>
                    </div>
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${isDecrease ? 'bg-gradient-to-r from-green-500 to-green-400' : 'bg-gradient-to-r from-red-500 to-red-400'}`}
                        style={{width: `${Math.min(Math.abs(change), 100)}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const PatientOutcomesScreen = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Heart className="w-6 h-6 text-green-400" />
          <h3 className="text-xl font-semibold text-white">Patient Outcomes & Quality of Life</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {(mockPatients.reduce((acc, p) => acc + p.qolCurrent, 0) / mockPatients.length).toFixed(1)}
              </div>
              <div className="text-gray-400 text-sm">Average QoL Score</div>
              <div className="text-green-400 text-xs mt-1">Current</div>
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {(mockPatients.reduce((acc, p) => acc + p.qolBaseline, 0) / mockPatients.length).toFixed(1)}
              </div>
              <div className="text-gray-400 text-sm">Baseline QoL Score</div>
              <div className="text-blue-400 text-xs mt-1">Pre-treatment</div>
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                +{(mockPatients.reduce((acc, p) => acc + (p.qolCurrent - p.qolBaseline), 0) / mockPatients.length).toFixed(1)}
              </div>
              <div className="text-gray-400 text-sm">Average Improvement</div>
              <div className="text-purple-400 text-xs mt-1">Change from baseline</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/30 rounded-lg p-4">
          <h4 className="text-lg font-medium text-white mb-4">Quality of Life Trends</h4>
          <div className="space-y-3">
            {mockPatients.slice(0, 6).map((patient) => {
              const improvement = patient.qolCurrent - patient.qolBaseline;
              const isImproved = improvement > 0;
              
              return (
                <div key={patient.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-xs">{patient.id.slice(-2)}</span>
                    </div>
                    <div>
                      <div className="text-white font-medium">{patient.id}</div>
                      <div className="text-gray-400 text-sm">{patient.cancerType}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right text-sm">
                      <div className="text-gray-400">Baseline: {patient.qolBaseline}</div>
                      <div className="text-white">Current: {patient.qolCurrent}</div>
                    </div>
                    <div className={`text-right font-medium ${isImproved ? 'text-green-400' : 'text-red-400'}`}>
                      {improvement > 0 ? '+' : ''}{improvement}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const SafetyComplianceScreen = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-6 h-6 text-amber-400" />
          <h3 className="text-xl font-semibold text-white">Safety & Compliance Monitoring</h3>
          <div className="flex items-center space-x-2 bg-amber-500/20 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <span className="text-amber-400 text-sm">Monitored</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-amber-400 mb-2">{severeAEs}</div>
            <div className="text-gray-400">Severe AEs</div>
            <div className="text-amber-400 text-xs">Grade 3+</div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-400 mb-2">
              {mockPatients.filter(p => p.protocolDeviations !== 'None').length}
            </div>
            <div className="text-gray-400">Protocol Deviations</div>
            <div className="text-red-400 text-xs">Major + Minor</div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400 mb-2">
              {mockPatients.filter(p => p.secondaryInfection.includes('Yes')).length}
            </div>
            <div className="text-gray-400">Infections</div>
            <div className="text-purple-400 text-xs">Secondary</div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400 mb-2">
              {(mockPatients.filter(p => p.protocolDeviations === 'None').length / mockPatients.length * 100).toFixed(1)}%
            </div>
            <div className="text-gray-400">Compliance Rate</div>
            <div className="text-green-400 text-xs">No deviations</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900/30 rounded-lg p-4">
            <h4 className="text-lg font-medium text-white mb-4">Adverse Events by Type</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">COVID-19</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-700 rounded-full h-2">
                    <div className="w-10 h-2 bg-gradient-to-r from-red-500 to-red-400 rounded-full"></div>
                  </div>
                  <span className="text-red-400 text-sm">
                    {mockPatients.filter(p => p.secondaryInfection.includes('COVID-19')).length}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Pneumonia</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-700 rounded-full h-2">
                    <div className="w-12 h-2 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"></div>
                  </div>
                  <span className="text-amber-400 text-sm">
                    {mockPatients.filter(p => p.secondaryInfection.includes('Pneumonia')).length}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Sepsis</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-700 rounded-full h-2">
                    <div className="w-8 h-2 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"></div>
                  </div>
                  <span className="text-purple-400 text-sm">
                    {mockPatients.filter(p => p.secondaryInfection.includes('Sepsis')).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/30 rounded-lg p-4">
            <h4 className="text-lg font-medium text-white mb-4">Protocol Compliance</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Compliant</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-700 rounded-full h-2">
                    <div className="w-14 h-2 bg-gradient-to-r from-green-500 to-green-400 rounded-full"></div>
                  </div>
                  <span className="text-green-400 text-sm">
                    {mockPatients.filter(p => p.protocolDeviations === 'None').length}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Missed Visits</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-700 rounded-full h-2">
                    <div className="w-6 h-2 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"></div>
                  </div>
                  <span className="text-amber-400 text-sm">
                    {mockPatients.filter(p => p.protocolDeviations === 'Missed Visit').length}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Eligibility Violations</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-700 rounded-full h-2">
                    <div className="w-4 h-2 bg-gradient-to-r from-red-500 to-red-400 rounded-full"></div>
                  </div>
                  <span className="text-red-400 text-sm">
                    {mockPatients.filter(p => p.protocolDeviations === 'Eligibility Violation').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'Patient Matching':
        return <PatientMatchingScreen />;
      case 'Biomarkers':
        return <BiomarkersScreen />;
      case 'Tumor Metrics':
        return <TumorMetricsScreen />;
      case 'Patient Outcomes':
        return <PatientOutcomesScreen />;
      case 'Safety & Compliance':
        return <SafetyComplianceScreen />;
      default:
        return <PatientMatchingScreen />;
    }
  };

  return (
    
    <html>
    <body>
      
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/80 backdrop-blur-md border-b border-cyan-500/50 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50 relative">
                <FileText className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  SCAI-001: Immunotherapy in Advanced Lung Cancer
                </h1>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded">Phase II</span>
                  <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-white">Enrolled</span>
              </div>
              <div className="text-xl font-bold text-cyan-400">{enrolledPatients}</div>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-gray-400">Dropouts</span>
              </div>
              <div className="text-xl font-bold text-amber-400">{droppedOut}</div>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span className="text-gray-400">Sites</span>
              </div>
              <div className="text-xl font-bold text-purple-400">{uniqueLocations}</div>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="w-4 h-4 text-green-400" />
                <span className="text-gray-400">Start</span>
              </div>
              <div className="text-sm font-medium text-green-400">Jan 2024</div>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400">End</span>
              </div>
              <div className="text-sm font-medium text-blue-400">Dec 2025</div>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-600/30">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              
              const getTabColors = (color, isActive) => {
                if (isActive) {
                  switch (color) {
                    case 'cyan': return 'border-cyan-400 text-cyan-400';
                    case 'purple': return 'border-purple-400 text-purple-400';
                    case 'blue': return 'border-blue-400 text-blue-400';
                    case 'green': return 'border-green-400 text-green-400';
                    case 'amber': return 'border-amber-400 text-amber-400';
                    default: return 'border-cyan-400 text-cyan-400';
                  }
                }
                return 'border-transparent text-gray-400 hover:text-white hover:border-gray-500';
              };
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-all duration-200 whitespace-nowrap ${getTabColors(tab.color, isActive)}`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium">{tab.id}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {renderActiveScreen()}
          </div>
          
          {/* Side Panel */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Trial Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Patients:</span>
                  <span className="text-white font-medium">{totalPatients}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Response Rate:</span>
                  <span className="text-green-400 font-medium">64.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Safety Events:</span>
                  <span className="text-amber-400 font-medium">{severeAEs} severe</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Data Quality:</span>
                  <span className="text-cyan-400 font-medium">98.7%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-200">
                  Generate Report
                </button>
                <button 
                onClick = {handleExport}
                className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-all duration-200">
                  Export Data
                </button>
                <button 
                  onClick={() => setShowChat(true)}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-500 transition-all duration-200"
                >
                  Ask AI Assistant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all duration-200 z-50 group"
        >
          <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </button>
      )}

      {/* Chat Drawer */}
      {showChat && (
        <div className="fixed inset-y-0 right-0 w-96 bg-gray-900/95 backdrop-blur-md border-l border-cyan-500/50 shadow-2xl z-50 transform transition-transform duration-300">
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="bg-gray-800/80 border-b border-gray-600/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center">
                    <Database className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">AI Research Assistant</h3>
                    <p className="text-cyan-300 text-sm">Ask about trial data</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="w-8 h-8 bg-gray-700/50 rounded-full flex items-center justify-center hover:bg-gray-600/50 transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                        : msg.type === 'system'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-gray-700/50 text-gray-200 border border-gray-600/30'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-700/50 border border-gray-600/30 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="bg-gray-800/80 border-t border-gray-600/50 p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                  placeholder="Ask about patients, biomarkers, outcomes..."
                  className="flex-1 bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  disabled={isTyping}
                />
                <button
                  onClick={handleChatSend}
                  disabled={!chatInput.trim() || isTyping}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white p-2 rounded-lg hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </body>
    </html>
  );
};

export default ClinicalTrialDemoMain;
