"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Filter, 
  Search, 
  User, 
  List, 
  MessageCircle, 
  Download, 
  RotateCcw, 
  X,
  ChevronDown,
  CheckCircle,
  XCircle,
  Activity,
  Heart,
  Shield,
  AlertTriangle,
  MapPin,
  Calendar,
  Dna,
  BarChart3
} from 'lucide-react';

// Complete Australian clinical trial dataset embedded directly in component
const patientsData = [
  {
    "id": "P001",
    "age": 32,
    "sex": "Male",
    "cancerType": "Melanoma",
    "cancerStage": "II",
    "egfrMutation": "Positive",
    "pdl1Expression": 71,
    "alkFusion": "Positive",
    "location": "Perth, WA",
    "state": "WA",
    "enrollmentStatus": "Enrolled",
    "tumorSizeChange": 19,
    "bestResponse": "CR",
    "qolBaseline": 78,
    "qolCurrent": 86,
    "adverseEventsCount": 4,
    "severeAeFlag": "No",
    "secondaryInfection": "No",
    "protocolDeviations": "None"
  },
  {
    "id": "P002",
    "age": 41,
    "sex": "Male",
    "cancerType": "Lymphoma",
    "cancerStage": "I",
    "egfrMutation": "Positive",
    "pdl1Expression": 2,
    "alkFusion": "Negative",
    "location": "Sydney, NSW",
    "state": "NSW",
    "enrollmentStatus": "Screened",
    "tumorSizeChange": -50,
    "bestResponse": "PR",
    "qolBaseline": 60,
    "qolCurrent": 78,
    "adverseEventsCount": 5,
    "severeAeFlag": "No",
    "secondaryInfection": "Yes - Sepsis",
    "protocolDeviations": "Eligibility Violation"
  },
  {
    "id": "P003",
    "age": 47,
    "sex": "Female",
    "cancerType": "Non-Small Cell Lung Cancer",
    "cancerStage": "I",
    "egfrMutation": "Negative",
    "pdl1Expression": 37,
    "alkFusion": "Positive",
    "location": "Melbourne, VIC",
    "state": "VIC",
    "enrollmentStatus": "Screened",
    "tumorSizeChange": -45,
    "bestResponse": "PD",
    "qolBaseline": 92,
    "qolCurrent": 73,
    "adverseEventsCount": 1,
    "severeAeFlag": "Yes",
    "secondaryInfection": "Yes - Pneumonia",
    "protocolDeviations": "None"
  },
  {
    "id": "P004",
    "age": 75,
    "sex": "Other",
    "cancerType": "Lymphoma",
    "cancerStage": "III",
    "egfrMutation": "Positive",
    "pdl1Expression": 21,
    "alkFusion": "Positive",
    "location": "Canberra, ACT",
    "state": "ACT",
    "enrollmentStatus": "Excluded",
    "tumorSizeChange": -13,
    "bestResponse": "CR",
    "qolBaseline": 60,
    "qolCurrent": 72,
    "adverseEventsCount": 4,
    "severeAeFlag": "Yes",
    "secondaryInfection": "No",
    "protocolDeviations": "Eligibility Violation"
  },
  {
    "id": "P005",
    "age": 66,
    "sex": "Other",
    "cancerType": "Melanoma",
    "cancerStage": "II",
    "egfrMutation": "Negative",
    "pdl1Expression": 90,
    "alkFusion": "Negative",
    "location": "Sydney, NSW",
    "state": "NSW",
    "enrollmentStatus": "Excluded",
    "tumorSizeChange": 37,
    "bestResponse": "CR",
    "qolBaseline": 83,
    "qolCurrent": 87,
    "adverseEventsCount": 2,
    "severeAeFlag": "Yes",
    "secondaryInfection": "Yes - COVID-19",
    "protocolDeviations": "None"
  },
  {
    "id": "P006",
    "age": 77,
    "sex": "Female",
    "cancerType": "Lymphoma",
    "cancerStage": "II",
    "egfrMutation": "Negative",
    "pdl1Expression": 79,
    "alkFusion": "Positive",
    "location": "Sydney, NSW",
    "state": "NSW",
    "enrollmentStatus": "Enrolled",
    "tumorSizeChange": 1,
    "bestResponse": "SD",
    "qolBaseline": 81,
    "qolCurrent": 88,
    "adverseEventsCount": 5,
    "severeAeFlag": "Yes",
    "secondaryInfection": "Yes - COVID-19",
    "protocolDeviations": "Missed Visit"
  },
  {
    "id": "P007",
    "age": 68,
    "sex": "Female",
    "cancerType": "Breast Cancer",
    "cancerStage": "IV",
    "egfrMutation": "Negative",
    "pdl1Expression": 6,
    "alkFusion": "Negative",
    "location": "Melbourne, VIC",
    "state": "VIC",
    "enrollmentStatus": "Screened",
    "tumorSizeChange": 45,
    "bestResponse": "SD",
    "qolBaseline": 86,
    "qolCurrent": 68,
    "adverseEventsCount": 4,
    "severeAeFlag": "No",
    "secondaryInfection": "Yes - Pneumonia",
    "protocolDeviations": "Eligibility Violation"
  },
  {
    "id": "P008",
    "age": 35,
    "sex": "Male",
    "cancerType": "Lymphoma",
    "cancerStage": "IV",
    "egfrMutation": "Positive",
    "pdl1Expression": 3,
    "alkFusion": "Positive",
    "location": "Brisbane, QLD",
    "state": "QLD",
    "enrollmentStatus": "Enrolled",
    "tumorSizeChange": -30,
    "bestResponse": "PD",
    "qolBaseline": 48,
    "qolCurrent": 66,
    "adverseEventsCount": 0,
    "severeAeFlag": "Yes",
    "secondaryInfection": "Yes - Pneumonia",
    "protocolDeviations": "Eligibility Violation"
  },
  {
    "id": "P009",
    "age": 70,
    "sex": "Female",
    "cancerType": "Lymphoma",
    "cancerStage": "III",
    "egfrMutation": "Positive",
    "pdl1Expression": 1,
    "alkFusion": "Positive",
    "location": "Perth, WA",
    "state": "WA",
    "enrollmentStatus": "Excluded",
    "tumorSizeChange": 48,
    "bestResponse": "SD",
    "qolBaseline": 53,
    "qolCurrent": 41,
    "adverseEventsCount": 3,
    "severeAeFlag": "Yes",
    "secondaryInfection": "Yes - Sepsis",
    "protocolDeviations": "Eligibility Violation"
  },
  {
    "id": "P010",
    "age": 61,
    "sex": "Male",
    "cancerType": "Melanoma",
    "cancerStage": "II",
    "egfrMutation": "Positive",
    "pdl1Expression": 7,
    "alkFusion": "Negative",
    "location": "Adelaide, SA",
    "state": "SA",
    "enrollmentStatus": "Excluded",
    "tumorSizeChange": -25,
    "bestResponse": "PR",
    "qolBaseline": 67,
    "qolCurrent": 53,
    "adverseEventsCount": 2,
    "severeAeFlag": "No",
    "secondaryInfection": "Yes - COVID-19",
    "protocolDeviations": "Missed Visit"
  },
  {
    "id": "P011",
    "age": 53,
    "sex": "Other",
    "cancerType": "Non-Small Cell Lung Cancer",
    "cancerStage": "III",
    "egfrMutation": "Negative",
    "pdl1Expression": 49,
    "alkFusion": "Positive",
    "location": "Canberra, ACT",
    "state": "ACT",
    "enrollmentStatus": "Screened",
    "tumorSizeChange": -11,
    "bestResponse": "PR",
    "qolBaseline": 53,
    "qolCurrent": 49,
    "adverseEventsCount": 3,
    "severeAeFlag": "Yes",
    "secondaryInfection": "Yes - COVID-19",
    "protocolDeviations": "Missed Visit"
  },
  {
    "id": "P012",
    "age": 71,
    "sex": "Male",
    "cancerType": "Colon Cancer",
    "cancerStage": "I",
    "egfrMutation": "Positive",
    "pdl1Expression": 3,
    "alkFusion": "Positive",
    "location": "Perth, WA",
    "state": "WA",
    "enrollmentStatus": "Screened",
    "tumorSizeChange": -29,
    "bestResponse": "SD",
    "qolBaseline": 41,
    "qolCurrent": 26,
    "adverseEventsCount": 5,
    "severeAeFlag": "No",
    "secondaryInfection": "Yes - COVID-19",
    "protocolDeviations": "Missed Visit"
  },
  {
    "id": "P013",
    "age": 61,
    "sex": "Other",
    "cancerType": "Breast Cancer",
    "cancerStage": "III",
    "egfrMutation": "Negative",
    "pdl1Expression": 33,
    "alkFusion": "Negative",
    "location": "Brisbane, QLD",
    "state": "QLD",
    "enrollmentStatus": "Excluded",
    "tumorSizeChange": -19,
    "bestResponse": "PR",
    "qolBaseline": 68,
    "qolCurrent": 65,
    "adverseEventsCount": 1,
    "severeAeFlag": "Yes",
    "secondaryInfection": "Yes - Sepsis",
    "protocolDeviations": "None"
  },
  {
    "id": "P014",
    "age": 65,
    "sex": "Male",
    "cancerType": "Lymphoma",
    "cancerStage": "II",
    "egfrMutation": "Positive",
    "pdl1Expression": 14,
    "alkFusion": "Positive",
    "location": "Perth, WA",
    "state": "WA",
    "enrollmentStatus": "Excluded",
    "tumorSizeChange": -42,
    "bestResponse": "CR",
    "qolBaseline": 75,
    "qolCurrent": 68,
    "adverseEventsCount": 5,
    "severeAeFlag": "No",
    "secondaryInfection": "No",
    "protocolDeviations": "Missed Visit"
  },
  {
    "id": "P015",
    "age": 70,
    "sex": "Other",
    "cancerType": "Colon Cancer",
    "cancerStage": "II",
    "egfrMutation": "Positive",
    "pdl1Expression": 23,
    "alkFusion": "Negative",
    "location": "Sydney, NSW",
    "state": "NSW",
    "enrollmentStatus": "Screened",
    "tumorSizeChange": -26,
    "bestResponse": "CR",
    "qolBaseline": 62,
    "qolCurrent": 81,
    "adverseEventsCount": 1,
    "severeAeFlag": "Yes",
    "secondaryInfection": "Yes - Pneumonia",
    "protocolDeviations": "Eligibility Violation"
  },
  {
    "id": "P016",
    "age": 46,
    "sex": "Female",
    "cancerType": "Non-Small Cell Lung Cancer",
    "cancerStage": "I",
    "egfrMutation": "Positive",
    "pdl1Expression": 14,
    "alkFusion": "Negative",
    "location": "Perth, WA",
    "state": "WA",
    "enrollmentStatus": "Screened",
    "tumorSizeChange": -37,
    "bestResponse": "PR",
    "qolBaseline": 64,
    "qolCurrent": 84,
    "adverseEventsCount": 4,
    "severeAeFlag": "Yes",
    "secondaryInfection": "Yes - COVID-19",
    "protocolDeviations": "Missed Visit"
  },
  {
    "id": "P017",
    "age": 26,
    "sex": "Female",
    "cancerType": "Breast Cancer",
    "cancerStage": "III",
    "egfrMutation": "Negative",
    "pdl1Expression": 87,
    "alkFusion": "Positive",
    "location": "Darwin, NT",
    "state": "NT",
    "enrollmentStatus": "Enrolled",
    "tumorSizeChange": 20,
    "bestResponse": "CR",
    "qolBaseline": 40,
    "qolCurrent": 44,
    "adverseEventsCount": 0,
    "severeAeFlag": "Yes",
    "secondaryInfection": "No",
    "protocolDeviations": "None"
  },
  {
    "id": "P018",
    "age": 80,
    "sex": "Male",
    "cancerType": "Breast Cancer",
    "cancerStage": "IV",
    "egfrMutation": "Negative",
    "pdl1Expression": 10,
    "alkFusion": "Negative",
    "location": "Sydney, NSW",
    "state": "NSW",
    "enrollmentStatus": "Screened",
    "tumorSizeChange": -29,
    "bestResponse": "PD",
    "qolBaseline": 83,
    "qolCurrent": 70,
    "adverseEventsCount": 2,
    "severeAeFlag": "Yes",
    "secondaryInfection": "Yes - Pneumonia",
    "protocolDeviations": "Eligibility Violation"
  },
  {
    "id": "P019",
    "age": 52,
    "sex": "Female",
    "cancerType": "Melanoma",
    "cancerStage": "IV",
    "egfrMutation": "Negative",
    "pdl1Expression": 34,
    "alkFusion": "Positive",
    "location": "Melbourne, VIC",
    "state": "VIC",
    "enrollmentStatus": "Screened",
    "tumorSizeChange": -43,
    "bestResponse": "CR",
    "qolBaseline": 56,
    "qolCurrent": 43,
    "adverseEventsCount": 0,
    "severeAeFlag": "No",
    "secondaryInfection": "No",
    "protocolDeviations": "None"
  },
  {
    "id": "P020",
    "age": 58,
    "sex": "Other",
    "cancerType": "Lymphoma",
    "cancerStage": "II",
    "egfrMutation": "Positive",
    "pdl1Expression": 27,
    "alkFusion": "Positive",
    "location": "Hobart, TAS",
    "state": "TAS",
    "enrollmentStatus": "Enrolled",
    "tumorSizeChange": -42,
    "bestResponse": "PR",
    "qolBaseline": 44,
    "qolCurrent": 62,
    "adverseEventsCount": 0,
    "severeAeFlag": "No",
    "secondaryInfection": "No",
    "protocolDeviations": "Missed Visit"
  },
  {
    "id": "P021",
    "age": 51,
    "sex": "Other",
    "cancerType": "Non-Small Cell Lung Cancer",
    "cancerStage": "I",
    "egfrMutation": "Negative",
    "pdl1Expression": 32,
    "alkFusion": "Negative",
    "location": "Melbourne, VIC",
    "state": "VIC",
    "enrollmentStatus": "Enrolled",
    "tumorSizeChange": -10,
    "bestResponse": "PR",
    "qolBaseline": 47,
    "qolCurrent": 38,
    "adverseEventsCount": 5,
    "severeAeFlag": "No",
    "secondaryInfection": "Yes - Pneumonia",
    "protocolDeviations": "None"
  },
  {
    "id": "P022",
    "age": 61,
    "sex": "Female",
    "cancerType": "Colon Cancer",
    "cancerStage": "III",
    "egfrMutation": "Positive",
    "pdl1Expression": 85,
    "alkFusion": "Positive",
    "location": "Brisbane, QLD",
    "state": "QLD",
    "enrollmentStatus": "Excluded",
    "tumorSizeChange": -38,
    "bestResponse": "CR",
    "qolBaseline": 63,
    "qolCurrent": 79,
    "adverseEventsCount": 2,
    "severeAeFlag": "Yes",
    "secondaryInfection": "Yes - Sepsis",
    "protocolDeviations": "None"
  },
  {
    "id": "P023",
    "age": 64,
    "sex": "Male",
    "cancerType": "Breast Cancer",
    "cancerStage": "III",
    "egfrMutation": "Negative",
    "pdl1Expression": 77,
    "alkFusion": "Positive",
    "location": "Brisbane, QLD",
    "state": "QLD",
    "enrollmentStatus": "Excluded",
    "tumorSizeChange": 28,
    "bestResponse": "CR",
    "qolBaseline": 74,
    "qolCurrent": 54,
    "adverseEventsCount": 2,
    "severeAeFlag": "No",
    "secondaryInfection": "No",
    "protocolDeviations": "None"
  },
  {
    "id": "P024",
    "age": 31,
    "sex": "Male",
    "cancerType": "Lymphoma",
    "cancerStage": "II",
    "egfrMutation": "Negative",
    "pdl1Expression": 26,
    "alkFusion": "Negative",
    "location": "Adelaide, SA",
    "state": "SA",
    "enrollmentStatus": "Enrolled",
    "tumorSizeChange": -24,
    "bestResponse": "SD",
    "qolBaseline": 40,
    "qolCurrent": 24,
    "adverseEventsCount": 0,
    "severeAeFlag": "No",
    "secondaryInfection": "Yes - Sepsis",
    "protocolDeviations": "None"
  },
  {
    "id": "P025",
    "age": 59,
    "sex": "Female",
    "cancerType": "Melanoma",
    "cancerStage": "I",
    "egfrMutation": "Positive",
    "pdl1Expression": 76,
    "alkFusion": "Negative",
    "location": "Gold Coast, QLD",
    "state": "QLD",
    "enrollmentStatus": "Enrolled",
    "tumorSizeChange": -17,
    "bestResponse": "PR",
    "qolBaseline": 54,
    "qolCurrent": 48,
    "adverseEventsCount": 2,
    "severeAeFlag": "No",
    "secondaryInfection": "Yes - Pneumonia",
    "protocolDeviations": "Missed Visit"
  },
  {
    "id": "P026",
    "age": 21,
    "sex": "Male",
    "cancerType": "Breast Cancer",
    "cancerStage": "I",
    "egfrMutation": "Negative",
    "pdl1Expression": 93,
    "alkFusion": "Positive",
    "location": "Brisbane, QLD",
    "state": "QLD",
    "enrollmentStatus": "Enrolled",
    "tumorSizeChange": -79,
    "bestResponse": "PR",
    "qolBaseline": 71,
    "qolCurrent": 72,
    "adverseEventsCount": 4,
    "severeAeFlag": "Yes",
    "secondaryInfection": "No",
    "protocolDeviations": "Eligibility Violation"
  },
  {
    "id": "P027",
    "age": 32,
    "sex": "Female",
    "cancerType": "Lymphoma",
    "cancerStage": "II",
    "egfrMutation": "Positive",
    "pdl1Expression": 42,
    "alkFusion": "Positive",
    "location": "Newcastle, NSW",
    "state": "NSW",
    "enrollmentStatus": "Enrolled",
    "tumorSizeChange": -47,
    "bestResponse": "PR",
    "qolBaseline": 62,
    "qolCurrent": 80,
    "adverseEventsCount": 4,
    "severeAeFlag": "No",
    "secondaryInfection": "Yes - Pneumonia",
    "protocolDeviations": "Missed Visit"
  },
  {
    "id": "P028",
    "age": 49,
    "sex": "Male",
    "cancerType": "Melanoma",
    "cancerStage": "II",
    "egfrMutation": "Positive",
    "pdl1Expression": 70,
    "alkFusion": "Negative",
    "location": "Geelong, VIC",
    "state": "VIC",
    "enrollmentStatus": "Enrolled",
    "tumorSizeChange": -22,
    "bestResponse": "PR",
    "qolBaseline": 75,
    "qolCurrent": 67,
    "adverseEventsCount": 2,
    "severeAeFlag": "No",
    "secondaryInfection": "Yes - Sepsis",
    "protocolDeviations": "Eligibility Violation"
  },
  {
    "id": "P029",
    "age": 45,
    "sex": "Male",
    "cancerType": "Breast Cancer",
    "cancerStage": "I",
    "egfrMutation": "Positive",
    "pdl1Expression": 65,
    "alkFusion": "Negative",
    "location": "Melbourne, VIC",
    "state": "VIC",
    "enrollmentStatus": "Screened",
    "tumorSizeChange": 48,
    "bestResponse": "SD",
    "qolBaseline": 90,
    "qolCurrent": 91,
    "adverseEventsCount": 1,
    "severeAeFlag": "No",
    "secondaryInfection": "Yes - Pneumonia",
    "protocolDeviations": "Missed Visit"
  },
  {
    "id": "P030",
    "age": 45,
    "sex": "Other",
    "cancerType": "Melanoma",
    "cancerStage": "I",
    "egfrMutation": "Positive",
    "pdl1Expression": 27,
    "alkFusion": "Negative",
    "location": "Wollongong, NSW",
    "state": "NSW",
    "enrollmentStatus": "Excluded",
    "tumorSizeChange": -17,
    "bestResponse": "CR",
    "qolBaseline": 84,
    "qolCurrent": 69,
    "adverseEventsCount": 3,
    "severeAeFlag": "Yes",
    "secondaryInfection": "Yes - Pneumonia",
    "protocolDeviations": "Eligibility Violation"
  }
];

const PatientMatching = ({ patients = patientsData, openChatPanel }) => {
  const [filters, setFilters] = useState({
    cancerTypes: [],
    stages: [],
    egfrMutation: [],
    alkFusion: [],
    pdl1Expression: [],
    locations: [],
    states: [],
    ageMin: '',
    ageMax: '',
    enrollmentStatus: []
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const cancerTypes = [...new Set(patients.map(p => p.cancerType))].sort();
    const stages = [...new Set(patients.map(p => p.cancerStage))].sort();
    const locations = [...new Set(patients.map(p => p.location))].sort();
    const states = [...new Set(patients.map(p => p.state))].sort();
    const enrollmentStatuses = [...new Set(patients.map(p => p.enrollmentStatus))].sort();
    
    return {
      cancerTypes,
      stages,
      locations,
      states,
      enrollmentStatuses,
      egfrMutations: ['Positive', 'Negative'],
      alkFusions: ['Positive', 'Negative'],
      pdl1Categories: ['<25%', '25-50%', '50-75%', '>75%']
    };
  }, [patients]);

  // Helper function to categorize PD-L1 expression
  const categorizePDL1 = (expression) => {
    if (expression < 25) return '<25%';
    if (expression < 50) return '25-50%';
    if (expression < 75) return '50-75%';
    return '>75%';
  };

  // Filter patients based on current filters and search
  const filteredPatients = useMemo(() => {
    let filtered = patients;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.cancerTypes.length > 0) {
      filtered = filtered.filter(p => filters.cancerTypes.includes(p.cancerType));
    }

    if (filters.stages.length > 0) {
      filtered = filtered.filter(p => filters.stages.includes(p.cancerStage));
    }

    if (filters.egfrMutation.length > 0) {
      filtered = filtered.filter(p => filters.egfrMutation.includes(p.egfrMutation));
    }

    if (filters.alkFusion.length > 0) {
      filtered = filtered.filter(p => filters.alkFusion.includes(p.alkFusion));
    }

    if (filters.pdl1Expression.length > 0) {
      filtered = filtered.filter(p => 
        filters.pdl1Expression.includes(categorizePDL1(p.pdl1Expression))
      );
    }

    if (filters.locations.length > 0) {
      filtered = filtered.filter(p => filters.locations.includes(p.location));
    }

    if (filters.states.length > 0) {
      filtered = filtered.filter(p => filters.states.includes(p.state));
    }

    if (filters.ageMin !== '') {
      filtered = filtered.filter(p => p.age >= parseInt(filters.ageMin));
    }

    if (filters.ageMax !== '') {
      filtered = filtered.filter(p => p.age <= parseInt(filters.ageMax));
    }

    if (filters.enrollmentStatus.length > 0) {
      filtered = filtered.filter(p => filters.enrollmentStatus.includes(p.enrollmentStatus));
    }

    return filtered;
  }, [patients, filters, searchTerm]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (Array.isArray(prev[filterType])) {
        const isSelected = prev[filterType].includes(value);
        return {
          ...prev,
          [filterType]: isSelected
            ? prev[filterType].filter(item => item !== value)
            : [...prev[filterType], value]
        };
      }
      return { ...prev, [filterType]: value };
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      cancerTypes: [],
      stages: [],
      egfrMutation: [],
      alkFusion: [],
      pdl1Expression: [],
      locations: [],
      states: [],
      ageMin: '',
      ageMax: '',
      enrollmentStatus: []
    });
    setSearchTerm('');
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'Patient ID', 'Age', 'Sex', 'Cancer Type', 'Stage', 'EGFR Mutation',
      'ALK Fusion', 'PD-L1 Expression', 'Location', 'Enrollment Status'
    ];
    
    const csvData = filteredPatients.map(patient => [
      patient.id,
      patient.age,
      patient.sex,
      patient.cancerType,
      patient.cancerStage,
      patient.egfrMutation,
      patient.alkFusion,
      patient.pdl1Expression,
      patient.location,
      patient.enrollmentStatus
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `patient_matching_results_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Check if patient meets inclusion criteria
  const checkInclusionCriteria = (patient) => {
    return {
      ageRange: patient.age >= 18 && patient.age <= 80,
      stageRequirement: ['I', 'II', 'III', 'IV'].includes(patient.cancerStage),
      biomarkerPresent: patient.egfrMutation === 'Positive' || patient.alkFusion === 'Positive',
      pdl1Expression: patient.pdl1Expression >= 1,
      noSevereComorbidity: patient.severeAeFlag === 'No'
    };
  };

  const MultiSelectDropdown = ({ label, options, selected, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <label className="block text-sm font-medium text-white mb-2">{label}</label>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-left text-white hover:border-cyan-400/50 transition-colors duration-200 flex items-center justify-between"
        >
          <span className="truncate">
            {selected.length === 0 ? placeholder : `${selected.length} selected`}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute z-20 w-full mt-1 bg-gray-800 border border-gray-600/50 rounded-lg shadow-lg max-h-40 overflow-y-auto">
            {options.map(option => (
              <label
                key={option}
                className="flex items-center px-3 py-2 hover:bg-gray-700/50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => onChange(option)}
                  className="mr-2 text-cyan-400 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                />
                <span className="text-white text-sm">{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  const PatientDetailModal = ({ patient, onClose }) => {
    const criteria = checkInclusionCriteria(patient);

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900/95 border border-cyan-500/50 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="bg-gray-800/80 border-b border-gray-600/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{patient.id}</h2>
                  <p className="text-cyan-300">{patient.cancerType} • Stage {patient.cancerStage}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-gray-700/50 rounded-full flex items-center justify-center hover:bg-gray-600/50 transition-colors duration-200"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Demographics</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white">Age:</span>
                    <span className="text-white">{patient.age}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white">Sex:</span>
                    <span className="text-white">{patient.sex}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white">Location:</span>
                    <span className="text-white">{patient.location}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Biomarkers</h3>
                <div className="space-y-2 text-sm">
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

              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white">Enrollment:</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      patient.enrollmentStatus === 'Enrolled' ? 'bg-green-500/20 text-green-400' :
                      patient.enrollmentStatus === 'Screened' ? 'bg-cyan-500/20 text-cyan-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {patient.enrollmentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white">Best Response:</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      patient.bestResponse === 'CR' ? 'bg-green-500/20 text-green-400' :
                      patient.bestResponse === 'PR' ? 'bg-blue-500/20 text-blue-400' :
                      patient.bestResponse === 'SD' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {patient.bestResponse}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Clinical Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <span>Treatment Response</span>
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Tumor Size Change:</span>
                      <span className={`font-medium ${patient.tumorSizeChange < 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {patient.tumorSizeChange > 0 ? '+' : ''}{patient.tumorSizeChange}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${patient.tumorSizeChange < 0 ? 'bg-gradient-to-r from-green-500 to-green-400' : 'bg-gradient-to-r from-red-500 to-red-400'}`}
                        style={{width: `${Math.min(Math.abs(patient.tumorSizeChange), 100)}%`}}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Adverse Events:</span>
                    <span className="text-white">{patient.adverseEventsCount}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-green-400" />
                  <span>Quality of Life</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Baseline:</span>
                    <span className="text-white">{patient.qolBaseline}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Current:</span>
                    <span className="text-white">{patient.qolCurrent}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Change:</span>
                    <span className={`font-medium ${(patient.qolCurrent - patient.qolBaseline) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(patient.qolCurrent - patient.qolBaseline) > 0 ? '+' : ''}{patient.qolCurrent - patient.qolBaseline}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Inclusion Criteria */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <span>Inclusion Criteria Assessment</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Age Range (18-80):</span>
                  {criteria.ageRange ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Cancer Stage I-IV:</span>
                  {criteria.stageRequirement ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Biomarker Present:</span>
                  {criteria.biomarkerPresent ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">PD-L1 ≥1%:</span>
                  {criteria.pdl1Expression ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Safety Information */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>Safety Information</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-white">Severe AE Flag:</span>
                  <span className={`px-2 py-1 rounded text-xs ${patient.severeAeFlag === 'Yes' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    {patient.severeAeFlag}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">Secondary Infection:</span>
                  <span className={`px-2 py-1 rounded text-xs ${patient.secondaryInfection !== 'No' ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>
                    {patient.secondaryInfection}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">Protocol Deviations:</span>
                  <span className={`px-2 py-1 rounded text-xs ${patient.protocolDeviations !== 'None' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    {patient.protocolDeviations}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <User className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Patient Matching</h2>
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
          Advanced AI-powered patient matching system for clinical trial enrollment. 
          Filter by demographics, biomarkers, and clinical criteria to find suitable candidates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Panel */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-6 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <Filter className="w-5 h-5 text-cyan-400" />
                <span>Filters</span>
              </h3>
              <button
                onClick={resetFilters}
                className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <MultiSelectDropdown
                label="Cancer Type"
                options={filterOptions.cancerTypes}
                selected={filters.cancerTypes}
                onChange={(value) => handleFilterChange('cancerTypes', value)}
                placeholder="Select cancer types"
              />

              <MultiSelectDropdown
                label="Stage"
                options={filterOptions.stages}
                selected={filters.stages}
                onChange={(value) => handleFilterChange('stages', value)}
                placeholder="Select stages"
              />

              <MultiSelectDropdown
                label="EGFR Mutation"
                options={filterOptions.egfrMutations}
                selected={filters.egfrMutation}
                onChange={(value) => handleFilterChange('egfrMutation', value)}
                placeholder="Select EGFR status"
              />

              <MultiSelectDropdown
                label="ALK Fusion"
                options={filterOptions.alkFusions}
                selected={filters.alkFusion}
                onChange={(value) => handleFilterChange('alkFusion', value)}
                placeholder="Select ALK status"
              />

              <MultiSelectDropdown
                label="PD-L1 Expression"
                options={filterOptions.pdl1Categories}
                selected={filters.pdl1Expression}
                onChange={(value) => handleFilterChange('pdl1Expression', value)}
                placeholder="Select PD-L1 range"
              />

              <MultiSelectDropdown
                label="Location"
                options={filterOptions.locations}
                selected={filters.locations}
                onChange={(value) => handleFilterChange('locations', value)}
                placeholder="Select locations"
              />

              <MultiSelectDropdown
                label="State"
                options={filterOptions.states}
                selected={filters.states}
                onChange={(value) => handleFilterChange('states', value)}
                placeholder="Select states"
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Age Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.ageMin}
                    onChange={(e) => handleFilterChange('ageMin', e.target.value)}
                    className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.ageMax}
                    onChange={(e) => handleFilterChange('ageMax', e.target.value)}
                    className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <MultiSelectDropdown
                label="Enrollment Status"
                options={filterOptions.enrollmentStatuses}
                selected={filters.enrollmentStatus}
                onChange={(value) => handleFilterChange('enrollmentStatus', value)}
                placeholder="Select status"
              />
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Actions */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Patient ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-white">
                  <span className="text-cyan-400 font-medium">{filteredPatients.length}</span> patients found
                </div>
                <button
                  onClick={exportToCSV}
                  className="flex items-center space-x-2 bg-green-600/80 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Demographics</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cancer Info</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Biomarkers</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600/30">
                  {filteredPatients.map((patient) => (
                    <tr
                      key={patient.id}
                      onClick={() => {
                        setSelectedPatient(patient);
                        setShowDetailModal(true);
                      }}
                      className="hover:bg-gray-700/30 cursor-pointer transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-xs">{patient.id.slice(-2)}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{patient.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{patient.age}y, {patient.sex}</div>
                        <div className="text-xs text-white flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{patient.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{patient.cancerType}</div>
                        <div className="text-xs text-white">Stage {patient.cancerStage}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          <span className={`px-2 py-1 text-xs rounded ${patient.egfrMutation === 'Positive' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                            EGFR {patient.egfrMutation}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded ${patient.alkFusion === 'Positive' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
                            ALK {patient.alkFusion}
                          </span>
                          <span className="px-2 py-1 text-xs rounded bg-purple-500/20 text-purple-400">
                            PD-L1 {patient.pdl1Expression}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded font-medium ${
                          patient.enrollmentStatus === 'Enrolled' ? 'bg-green-500/20 text-green-400' :
                          patient.enrollmentStatus === 'Screened' ? 'bg-cyan-500/20 text-cyan-400' :
                          'bg-amber-500/20 text-amber-400'
                        }`}>
                          {patient.enrollmentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredPatients.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-2">No patients found matching current filters</div>
                  <button
                    onClick={resetFilters}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
                  >
                    Reset filters to see all patients
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {showDetailModal && selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedPatient(null);
          }}
        />
      )}
    </div>
  );
};

export default PatientMatching;
