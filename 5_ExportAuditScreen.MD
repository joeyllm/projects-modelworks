import React, { useState, useEffect } from 'react';
import { Download, FileText, AlertTriangle, CheckCircle, Eye, Settings, ChevronRight, ChevronDown, Calendar, User, Clock, Flag, ExternalLink, Copy, Mail, Printer, Shield, Target, BarChart3, TrendingUp, Zap, Award, RefreshCw, Upload, Share } from 'lucide-react';

const ExportAuditScreen = () => {
  const [exportFormat, setExportFormat] = useState('hl7');
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [auditTagged, setAuditTagged] = useState(false);
  const [showExportPreview, setShowExportPreview] = useState(false);
  const [exportInProgress, setExportInProgress] = useState(false);
  const [qualityExpanded, setQualityExpanded] = useState(true);
  const [auditExpanded, setAuditExpanded] = useState(true);

  const patientData = {
    name: 'John Smith',
    id: 'MRN-789012',
    dob: '15/03/1965',
    admission: '12/07/2025',
    discharge: '18/07/2025',
    los: 6,
    separationMode: 'Discharge to usual residence',
    fundingSource: 'Public Patient',
    urgencyAdmission: 'Emergency'
  };

  const codedEpisode = {
    principalDiagnosis: {
      code: 'I21.9',
      description: 'Acute myocardial infarction, unspecified',
      onsetFlag: 'Y',
      confidence: 98
    },
    secondaryDiagnoses: [
      {
        code: 'I25.10',
        description: 'Atherosclerotic heart disease of native coronary artery without angina pectoris',
        onsetFlag: 'Y',
        confidence: 95
      },
      {
        code: 'I10',
        description: 'Essential hypertension',
        onsetFlag: 'Y',
        confidence: 97
      },
      {
        code: 'E11.9',
        description: 'Type 2 diabetes mellitus without complications',
        onsetFlag: 'Y',
        confidence: 96
      }
    ],
    procedures: [
      {
        code: '38300-01',
        description: 'Percutaneous transluminal coronary angioplasty with stent insertion, single vessel',
        date: '12/07/2025',
        confidence: 99
      }
    ]
  };

  const drgCalculation = {
    drg: 'E40A',
    description: 'Circulatory Disorders except AMI w CC',
    version: 'AR-DRG 12.0',
    relativeWeight: 1.2847,
    alos: 4.8,
    inlierRange: '2-8 days',
    outlierStatus: 'Inlier',
    fundingImpact: '$8,247'
  };

  const qualityFlags = [
    {
      type: 'warning',
      category: 'ACS Compliance',
      code: 'ACS-001',
      message: 'Principal diagnosis coding requires additional clinical significance review',
      reference: 'ACS 0001',
      severity: 'medium',
      impact: 'Potential DRG impact',
      recommendation: 'Verify clinical documentation supports principal diagnosis selection'
    },
    {
      type: 'info',
      category: 'HAC Review',
      code: 'HAC-REV',
      message: 'Case flagged for Hospital Acquired Complication review - no HACs identified',
      reference: 'ACS 0104',
      severity: 'low',
      impact: 'No funding impact',
      recommendation: 'Review complete - no action required'
    },
    {
      type: 'success',
      category: 'Data Quality',
      code: 'DQ-001',
      message: 'All mandatory data elements present and validated',
      reference: 'NHCDC Standards',
      severity: 'none',
      impact: 'Positive compliance',
      recommendation: 'Ready for submission'
    }
  ];

  const auditMetrics = {
    completeness: 98,
    accuracy: 96,
    compliance: 94,
    complexity: 'Medium',
    riskScore: 'Low',
    confidenceScore: 97,
    expectedVariance: '±2%'
  };

  const exportFormats = [
    {
      id: 'hl7',
      name: 'HL7 FHIR',
      description: 'Health Level 7 Fast Healthcare Interoperability Resources format',
      extension: '.json',
      compatible: ['Electronic Health Records', 'Hospital Information Systems', 'State Health Departments'],
      compliance: 'FHIR R4',
      fileSize: '~12KB'
    },
    {
      id: 'fixedfield',
      name: 'Fixed Field Text',
      description: 'State-level compatibility format for health department submissions',
      extension: '.txt',
      compatible: ['Victorian Health Department', 'NHCDC Submissions', 'Medicare Australia'],
      compliance: 'NHCDC v2.1',
      fileSize: '~2KB'
    },
    {
      id: 'csv',
      name: 'CSV Export',
      description: 'Comma-separated values for data analysis and reporting',
      extension: '.csv',
      compatible: ['Excel', 'Data Analytics Tools', 'Statistical Software'],
      compliance: 'RFC 4180',
      fileSize: '~3KB'
    },
    {
      id: 'xml',
      name: 'XML Export',
      description: 'Structured XML format for system integration',
      extension: '.xml',
      compatible: ['Legacy Systems', 'Custom Integrations', 'Data Warehouses'],
      compliance: 'XML 1.0',
      fileSize: '~8KB'
    }
  ];

  const exportStats = {
    totalExports: 1247,
    successRate: 99.2,
    avgProcessingTime: '1.3s',
    lastExport: '22/07/2025 14:30'
  };

  const generateExport = () => {
    setExportInProgress(true);
    setShowExportPreview(false);
    
    setTimeout(() => {
      setShowExportPreview(true);
      setExportInProgress(false);
    }, 2000);
  };

  const downloadExport = () => {
    const format = exportFormats.find(f => f.id === exportFormat);
    alert(`Downloading ${patientData.name} - ${patientData.id} as ${format.name} (${format.extension})`);
  };

  const getExportPreview = () => {
    const baseData = {
      patient: patientData,
      episode: codedEpisode,
      drg: drgCalculation
    };

    switch (exportFormat) {
      case 'hl7':
        return `{
  "resourceType": "Bundle",
  "id": "episode-${patientData.id}-${patientData.admission.replace(/\//g, '')}",
  "type": "collection",
  "timestamp": "${new Date().toISOString()}",
  "entry": [
    {
      "resource": {
        "resourceType": "Patient",
        "id": "${patientData.id}",
        "identifier": [{"value": "${patientData.id}"}],
        "name": [{"family": "Smith", "given": ["John"]}],
        "birthDate": "1965-03-15",
        "gender": "male"
      }
    },
    {
      "resource": {
        "resourceType": "Encounter",
        "id": "episode-${patientData.admission.replace(/\//g, '')}",
        "status": "finished",
        "class": {"code": "IMP", "display": "inpatient encounter"},
        "period": {
          "start": "2025-07-12",
          "end": "2025-07-18"
        },
        "length": {"value": ${patientData.los}, "unit": "d"}
      }
    },
    {
      "resource": {
        "resourceType": "Condition",
        "id": "principal-diagnosis",
        "code": {
          "coding": [{
            "system": "http://terminology.hl7.org/CodeSystem/icd-10-am",
            "code": "${codedEpisode.principalDiagnosis.code}",
            "display": "${codedEpisode.principalDiagnosis.description}"
          }]
        },
        "category": [{"coding": [{"code": "encounter-diagnosis"}]}],
        "clinicalStatus": {"coding": [{"code": "active"}]}
      }
    },
    {
      "resource": {
        "resourceType": "Procedure",
        "id": "primary-procedure",
        "code": {
          "coding": [{
            "system": "http://terminology.hl7.org/CodeSystem/achi",
            "code": "${codedEpisode.procedures[0].code}",
            "display": "${codedEpisode.procedures[0].description}"
          }]
        },
        "status": "completed",
        "performedDateTime": "2025-07-12"
      }
    }
  ],
  "meta": {
    "versionId": "1",
    "lastUpdated": "${new Date().toISOString()}",
    "source": "Clinical Coding Assistant v3.2.1"
  }
}`;

      case 'fixedfield':
        return `01${patientData.id.padEnd(15)}${patientData.name.replace(' ', ',').padEnd(30)}${patientData.dob.replace(/\//g, '')}M${patientData.admission.replace(/\//g, '')}${patientData.discharge.replace(/\//g, '')}${String(patientData.los).padStart(2, '0')}${drgCalculation.drg.padEnd(6)}${codedEpisode.principalDiagnosis.code.padEnd(8)}
02${codedEpisode.secondaryDiagnoses.map(d => d.code).join('').padEnd(50)}
03${codedEpisode.procedures.map(p => p.code).join('').padEnd(50)}
04Principal: ${codedEpisode.principalDiagnosis.description}
05Additional: ${codedEpisode.secondaryDiagnoses.map(d => d.description).join('; ')}
06Procedures: ${codedEpisode.procedures.map(p => p.description).join('; ')}
07DRG: ${drgCalculation.drg} - ${drgCalculation.description}
08Weight: ${drgCalculation.relativeWeight} ALOS: ${drgCalculation.alos} Status: ${drgCalculation.outlierStatus}
09Funding: ${drgCalculation.fundingImpact} Confidence: ${auditMetrics.confidenceScore}%
99END_RECORD`;

      case 'csv':
        return `Patient_ID,Patient_Name,DOB,Gender,Admission_Date,Discharge_Date,LOS,Separation_Mode,Funding_Source,Principal_Dx,Principal_Dx_Desc,Secondary_Dx_1,Secondary_Dx_1_Desc,Secondary_Dx_2,Secondary_Dx_2_Desc,Secondary_Dx_3,Secondary_Dx_3_Desc,Procedure_1,Procedure_1_Desc,DRG,DRG_Description,DRG_Weight,ALOS,Outlier_Status,Funding_Impact,Confidence_Score
${patientData.id},"${patientData.name}",${patientData.dob},M,${patientData.admission},${patientData.discharge},${patientData.los},"${patientData.separationMode}","${patientData.fundingSource}",${codedEpisode.principalDiagnosis.code},"${codedEpisode.principalDiagnosis.description}",${codedEpisode.secondaryDiagnoses[0]?.code || ''},"${codedEpisode.secondaryDiagnoses[0]?.description || ''}",${codedEpisode.secondaryDiagnoses[1]?.code || ''},"${codedEpisode.secondaryDiagnoses[1]?.description || ''}",${codedEpisode.secondaryDiagnoses[2]?.code || ''},"${codedEpisode.secondaryDiagnoses[2]?.description || ''}",${codedEpisode.procedures[0]?.code || ''},"${codedEpisode.procedures[0]?.description || ''}",${drgCalculation.drg},"${drgCalculation.description}",${drgCalculation.relativeWeight},${drgCalculation.alos},"${drgCalculation.outlierStatus}","${drgCalculation.fundingImpact}",${auditMetrics.confidenceScore}`;

      case 'xml':
        return `<?xml version="1.0" encoding="UTF-8"?>
<EpisodeData xmlns="http://healthdept.gov.au/coding/v1">
  <Patient>
    <ID>${patientData.id}</ID>
    <Name>${patientData.name}</Name>
    <DateOfBirth>${patientData.dob}</DateOfBirth>
    <Gender>M</Gender>
  </Patient>
  <Episode>
    <AdmissionDate>${patientData.admission}</AdmissionDate>
    <DischargeDate>${patientData.discharge}</DischargeDate>
    <LengthOfStay>${patientData.los}</LengthOfStay>
    <SeparationMode>${patientData.separationMode}</SeparationMode>
    <FundingSource>${patientData.fundingSource}</FundingSource>
  </Episode>
  <Diagnoses>
    <Principal>
      <Code>${codedEpisode.principalDiagnosis.code}</Code>
      <Description>${codedEpisode.principalDiagnosis.description}</Description>
      <OnsetFlag>${codedEpisode.principalDiagnosis.onsetFlag}</OnsetFlag>
      <Confidence>${codedEpisode.principalDiagnosis.confidence}</Confidence>
    </Principal>
    <Additional>
      ${codedEpisode.secondaryDiagnoses.map(dx => `
      <Diagnosis>
        <Code>${dx.code}</Code>
        <Description>${dx.description}</Description>
        <OnsetFlag>${dx.onsetFlag}</OnsetFlag>
        <Confidence>${dx.confidence}</Confidence>
      </Diagnosis>`).join('')}
    </Additional>
  </Diagnoses>
  <Procedures>
    ${codedEpisode.procedures.map(proc => `
    <Procedure>
      <Code>${proc.code}</Code>
      <Description>${proc.description}</Description>
      <Date>${proc.date}</Date>
      <Confidence>${proc.confidence}</Confidence>
    </Procedure>`).join('')}
  </Procedures>
  <DRG>
    <Code>${drgCalculation.drg}</Code>
    <Description>${drgCalculation.description}</Description>
    <Version>${drgCalculation.version}</Version>
    <RelativeWeight>${drgCalculation.relativeWeight}</RelativeWeight>
    <ALOS>${drgCalculation.alos}</ALOS>
    <OutlierStatus>${drgCalculation.outlierStatus}</OutlierStatus>
    <FundingImpact>${drgCalculation.fundingImpact}</FundingImpact>
  </DRG>
  <Quality>
    <ConfidenceScore>${auditMetrics.confidenceScore}</ConfidenceScore>
    <ComplianceScore>${auditMetrics.compliance}</ComplianceScore>
    <RiskLevel>${auditMetrics.riskScore}</RiskLevel>
  </Quality>
</EpisodeData>`;

      default:
        return 'Preview not available for this format.';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'none': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getMetricColor = (value) => {
    if (value >= 95) return 'text-green-400';
    if (value >= 85) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getFlagIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'info': return <Eye className="w-4 h-4" />;
      default: return <Flag className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-600/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Export & Audit Summary</h2>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-pink-300">Quality Assurance & Data Export</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">Government Compliance</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="font-medium text-white">{patientData.name}</span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-400">{patientData.id}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-white">{patientData.admission} - {patientData.discharge}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-white">LOS: {patientData.los} days</span>
            </div>
          </div>
        </div>

        {/* Export Statistics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Upload className="w-4 h-4 text-pink-400" />
              <div>
                <div className="text-xs text-gray-400">Total Exports</div>
                <div className="text-sm font-semibold text-white">{exportStats.totalExports}</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <div>
                <div className="text-xs text-gray-400">Success Rate</div>
                <div className="text-sm font-semibold text-white">{exportStats.successRate}%</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-xs text-gray-400">Avg Processing</div>
                <div className="text-sm font-semibold text-white">{exportStats.avgProcessingTime}</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-xs text-gray-400">Last Export</div>
                <div className="text-sm font-semibold text-white">{exportStats.lastExport}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Episode Summary Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Episode Summary</h3>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-yellow-400">Quality Verified</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Principal Diagnosis */}
              <div>
                <h4 className="font-medium text-gray-300 mb-3">Principal Diagnosis</h4>
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-medium text-blue-300">
                      {codedEpisode.principalDiagnosis.code}
                    </span>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">
                      {codedEpisode.principalDiagnosis.confidence}%
                    </span>
                  </div>
                  <div className="text-sm text-blue-200 mb-2">
                    {codedEpisode.principalDiagnosis.description}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">Condition Onset:</span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs border border-green-500/30">
                      {codedEpisode.principalDiagnosis.onsetFlag}
                    </span>
                  </div>
                </div>
              </div>

              {/* Secondary Diagnoses */}
              <div>
                <h4 className="font-medium text-gray-300 mb-3">Secondary Diagnoses</h4>
                <div className="space-y-2">
                  {codedEpisode.secondaryDiagnoses.map((dx, index) => (
                    <div key={index} className="bg-gray-700/50 border border-gray-600/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-medium text-cyan-300">{dx.code}</span>
                        <span className="text-xs text-green-400">{dx.confidence}%</span>
                      </div>
                      <div className="text-xs text-gray-300">{dx.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Procedures */}
              <div>
                <h4 className="font-medium text-gray-300 mb-3">Procedures</h4>
                <div className="space-y-2">
                  {codedEpisode.procedures.map((proc, index) => (
                    <div key={index} className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-medium text-green-300">{proc.code}</span>
                        <span className="text-xs text-green-400">{proc.confidence}%</span>
                      </div>
                      <div className="text-xs text-green-200 mb-1">{proc.description}</div>
                      <div className="text-xs text-gray-400">Date: {proc.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* DRG Classification */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">AR-DRG Classification</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-lg font-bold text-purple-300">
                      {drgCalculation.drg}
                    </span>
                    <span className="text-sm text-purple-400">{drgCalculation.version}</span>
                  </div>
                  <div className="text-sm text-purple-200 mb-3">{drgCalculation.description}</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Relative Weight:</span>
                      <span className="font-medium ml-2 text-white">{drgCalculation.relativeWeight}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">ALOS:</span>
                      <span className="font-medium ml-2 text-white">{drgCalculation.alos} days</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-300 mb-3">Financial Impact</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Funding Impact:</span>
                    <span className="text-sm font-medium text-green-400">{drgCalculation.fundingImpact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Inlier Range:</span>
                    <span className="text-sm font-medium text-white">{drgCalculation.inlierRange}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Actual LOS:</span>
                    <span className="text-sm font-medium text-white">{patientData.los} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Status:</span>
                    <span className="text-sm font-medium text-green-400">{drgCalculation.outlierStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Expected Variance:</span>
                    <span className="text-sm font-medium text-gray-300">{auditMetrics.expectedVariance}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quality Assessment */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Quality Assessment</h3>
              <button
                onClick={() => setQualityExpanded(!qualityExpanded)}
                className="text-gray-400 hover:text-white"
              >
                {qualityExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
            
            {qualityExpanded && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-300 mb-3">Compliance Flags</h4>
                  <div className="space-y-3">
                    {qualityFlags.map((flag, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.02] ${getSeverityColor(flag.severity)}`}
                        onClick={() => setSelectedViolation(selectedViolation === flag ? null : flag)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              {getFlagIcon(flag.type)}
                              <span className="font-medium">{flag.category}</span>
                              <span className="text-xs px-2 py-1 rounded-full border">
                                {flag.code}
                              </span>
                            </div>
                            <p className="text-sm mb-1">{flag.message}</p>
                            <div className="text-xs opacity-80">
                              Impact: {flag.impact} • {flag.recommendation}
                            </div>
                          </div>
                          <ChevronRight className={`w-4 h-4 transition-transform ${selectedViolation === flag ? 'rotate-90' : ''}`} />
                        </div>
                        
                        {selectedViolation === flag && (
                          <div className="mt-3 pt-3 border-t border-gray-600/30">
                            <div className="text-xs space-y-1">
                              <div><strong>Reference:</strong> {flag.reference}</div>
                              <div><strong>Recommendation:</strong> {flag.recommendation}</div>
                              <div><strong>Severity:</strong> {flag.severity}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-300 mb-3">Audit Metrics</h4>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Completeness:</span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${getMetricColor(auditMetrics.completeness)}`}>
                            {auditMetrics.completeness}%
                          </span>
                          <div className="w-16 bg-gray-600 rounded-full h-2">
                            <div 
                              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000"
                              style={{width: `${auditMetrics.completeness}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Accuracy:</span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${getMetricColor(auditMetrics.accuracy)}`}>
                            {auditMetrics.accuracy}%
                          </span>
                          <div className="w-16 bg-gray-600 rounded-full h-2">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-1000 delay-200"
                              style={{width: `${auditMetrics.accuracy}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">ACS Compliance:</span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${getMetricColor(auditMetrics.compliance)}`}>
                            {auditMetrics.compliance}%
                          </span>
                          <div className="w-16 bg-gray-600 rounded-full h-2">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-1000 delay-500"
                              style={{width: `${auditMetrics.compliance}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Confidence Score:</span>
                        <span className="text-sm font-medium text-green-400">{auditMetrics.confidenceScore}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Case Complexity:</span>
                        <span className="text-sm font-medium text-white">{auditMetrics.complexity}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Audit Risk:</span>
                        <span className="text-sm font-medium text-green-400">{auditMetrics.riskScore}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => setAuditTagged(!auditTagged)}
                      className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                        auditTagged 
                          ? 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30' 
                          : 'bg-gray-700/30 border-gray-600/30 text-gray-400 hover:bg-gray-600/30 hover:text-white'
                      }`}
                    >
                      <Flag className="h-4 w-4" />
                      <span>{auditTagged ? 'Tagged for External Audit' : 'Tag for External Audit'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Export Options */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Export Options</h3>
              <button
                onClick={() => setAuditExpanded(!auditExpanded)}
                className="text-gray-400 hover:text-white"
              >
                {auditExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
            
            {auditExpanded && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-300 mb-3">Export Format</h4>
                  <div className="space-y-3">
                    {exportFormats.map(format => (
                      <label key={format.id} className="flex items-start space-x-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="exportFormat"
                          value={format.id}
                          checked={exportFormat === format.id}
                          onChange={(e) => setExportFormat(e.target.value)}
                          className="mt-1 text-pink-500 focus:ring-pink-500"
                        />
                        <div className="flex-1 group-hover:bg-gray-700/30 p-2 rounded-lg transition-colors">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium text-white">{format.name}</div>
                            <div className="text-xs text-gray-400">{format.fileSize}</div>
                          </div>
                          <div className="text-sm text-gray-400 mb-1">{format.description}</div>
                          <div className="text-xs text-gray-500 mb-1">
                            <strong>Compatible:</strong> {format.compatible.slice(0, 2).join(', ')}
                            {format.compatible.length > 2 && ` +${format.compatible.length - 2} more`}
                          </div>
                          <div className="text-xs text-cyan-400">
                            <strong>Standard:</strong> {format.compliance}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-300 mb-3">Export Actions</h4>
                  <div className="space-y-3">
                    <button
                      onClick={generateExport}
                      disabled={exportInProgress}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                    >
                      {exportInProgress ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          <span>Generate Preview</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={downloadExport}
                      disabled={!showExportPreview}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Export</span>
                    </button>

                    <div className="grid grid-cols-3 gap-2">
                      <button className="flex items-center justify-center space-x-1 px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors text-sm">
                        <Mail className="h-4 w-4" />
                        <span>Email</span>
                      </button>
                      <button className="flex items-center justify-center space-x-1 px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors text-sm">
                        <Printer className="h-4 w-4" />
                        <span>Print</span>
                      </button>
                      <button className="flex items-center justify-center space-x-1 px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors text-sm">
                        <Share className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-300">Export Security</span>
                      </div>
                      <div className="text-xs text-blue-200 space-y-1">
                        <div>• Patient data encryption in transit</div>
                        <div>• Audit trail for all exports</div>
                        <div>• HIPAA compliant formatting</div>
                        <div>• Government submission ready</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Export Preview */}
          {showExportPreview && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Export Preview</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">
                    Format: {exportFormats.find(f => f.id === exportFormat)?.name}
                  </span>
                  <button
                    onClick={() => setShowExportPreview(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto border border-gray-700">
                <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap leading-relaxed">
                  {getExportPreview()}
                </pre>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  File size: {exportFormats.find(f => f.id === exportFormat)?.fileSize} • 
                  Compliance: {exportFormats.find(f => f.id === exportFormat)?.compliance}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(getExportPreview())}
                    className="flex items-center space-x-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={downloadExport}
                    className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded text-sm transition-all duration-200"
                  >
                    <Download className="h-3 w-3" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportAuditScreen;
