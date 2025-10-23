# ModelWorks 

This repository contains two AI applications developed by the ModelWorks team:

## 🌿 Branch Overview

### `main` - RAG-Powered Document Q&A System
A full-stack application that enables users to upload PDF documents and ask questions about their content using Retrieval-Augmented Generation (RAG) with local LLM models.

### `clinical-trials-chat-api` - Clinical Trial Analytics Dashboard
A Next.js application for clinical trial data visualization and AI-powered analysis of patient data, biomarkers, and trial outcomes.

## 🚀 Features

- **PDF Document Upload**: Drag-and-drop interface for uploading PDF files
- **Intelligent Q&A**: Ask questions about uploaded documents using RAG
- **Local LLM Integration**: Uses Ollama with DeepSeek R1 (1.5B) model
- **Vector Database**: ChromaDB for document storage and retrieval
- **Modern UI**: Responsive web interface with dark/light theme toggle
- **Real-time Chat**: Interactive chat interface for document queries
- **Dockerized**: Complete containerized setup for easy deployment

## 🏗️ Architecture

The system consists of three main components:

- **Frontend**: HTML/CSS/JavaScript web interface
- **Backend**: FastAPI server with RAG pipeline
- **Ollama**: Local LLM service for text generation and embeddings

### Tech Stack

- **Backend**: FastAPI, Python, LangChain
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **LLM**: Ollama with DeepSeek R1 (1.5B)
- **Embeddings**: Nomic Embed Text
- **Vector DB**: ChromaDB
- **PDF Processing**: pdfplumber
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Docker and Docker Compose
- Git

## 🚀 Quick Start

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd projects-modelworks
   ```

2. **Make the init script executable**:
   ```bash
   chmod +x init.sh
   ```

3. **Run the initialization script**:
   ```bash
   ./init.sh
   ```

This script will:
- Start all Docker containers
- Download the required LLM models (DeepSeek R1 1.5B and Nomic Embed Text)
- Set up the vector database

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:7860
   - Ollama: http://localhost:11434

## 📖 Usage

1. **Upload a PDF**: Drag and drop a PDF file into the upload area
2. **Ask Questions**: Type your questions about the document content
3. **Get Answers**: The system will use RAG to provide contextually relevant answers

## 🔧 API Endpoints

- `POST /upload`: Upload PDF files for processing
- `POST /ask`: Send questions about uploaded documents

## 📁 Project Structure

```
├── api/                    # API configuration
├── backend/                # FastAPI backend
│   ├── components/         # Core functionality modules
│   │   ├── database.py    # ChromaDB integration
│   │   ├── embedding.py   # Embedding model setup
│   │   ├── history.py     # Conversation history
│   │   ├── llm.py         # LLM integration
│   │   ├── pipeline.py    # RAG pipeline orchestration
│   │   ├── retrieve.py    # Document retrieval
│   │   ├── store_text.py  # PDF text extraction
│   │   └── upload.py      # File upload handling
│   ├── api_handler.py     # FastAPI application
│   └── requirements.txt   # Python dependencies
├── frontend/              # Web interface
│   ├── index.html        # Main page
│   └── script.js         # Frontend logic
├── docker-compose.yml     # Container orchestration
└── init.sh               # Setup script
```

## 🛠️ Development

### Backend Development

The backend uses a modular architecture with separate components for:

- **Pipeline**: Orchestrates the RAG workflow
- **Database**: Manages ChromaDB vector storage
- **LLM**: Handles text generation with Ollama
- **Embedding**: Manages text embeddings
- **Retrieve**: Implements similarity search
- **Upload**: Processes PDF files
- **History**: Manages conversation context

### Frontend Development

The frontend is built with vanilla JavaScript and provides:

- Drag-and-drop PDF upload
- Real-time chat interface
- Theme switching (dark/light mode)
- Responsive design

## 🔒 Model Storage

Models are stored in a Docker volume (`ollama-data`) and persist across container restarts. To avoid losing models:

- ✅ Use `docker-compose down` (keeps volumes)
- ❌ Avoid `docker-compose down -v` (deletes volumes)
- ❌ Avoid `docker volume rm ollama-data`

## 🐛 Troubleshooting

### Common Issues

1. **Models not downloading**: Ensure Ollama service is running and accessible
2. **Upload failures**: Check that the backend service is running on port 7860
3. **No responses**: Verify that the LLM model is properly loaded in Ollama

### Logs

Check container logs:
```bash
docker-compose logs backend
docker-compose logs ollama
```

---

## 🧬 Clinical Trials Branch (`clinical-trials-chat-api`)

### Overview
A sophisticated clinical trial analytics dashboard built with Next.js, featuring real-time patient data visualization, biomarker analysis, and AI-powered insights for the SCAI-001 immunotherapy study.

### Key Features

- **Patient Matching Algorithm**: Real-time patient enrollment and screening status
- **Biomarker Analysis**: EGFR mutations, PD-L1 expression, and ALK fusion analysis
- **Tumor Response Metrics**: Complete/Partial/Stable/Progressive disease tracking
- **Patient Outcomes**: Quality of Life (QoL) score monitoring and trends
- **Safety & Compliance**: Adverse events tracking and protocol deviation monitoring
- **AI Research Assistant**: GPT-4 powered chat interface for trial data analysis
- **Data Export**: PDF report generation and JSON data export

### Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS 4, Lucide React icons
- **Charts**: Recharts for data visualization
- **AI Integration**: OpenAI GPT-4 API
- **Data**: JSON-based patient dataset with 100+ mock patients

### Project Structure

```
app/
├── api/
│   ├── chat/route.ts          # OpenAI API integration
│   └── data/                  # Patient datasets
├── components/
│   ├── ClinicalTrialDemoMain.jsx  # Main dashboard component
│   ├── Biomarkers.jsx         # Biomarker analysis
│   ├── PatientMatching.jsx    # Patient enrollment
│   ├── TumorMetrics.jsx      # Tumor response tracking
│   ├── OutcomesSafety.jsx    # Safety monitoring
│   └── ChatDocsInterface.jsx  # AI chat interface
├── globals.css               # Global styles
├── layout.js                 # App layout
└── page.jsx                  # Main page
```

### Key Features

#### 1. **Patient Matching Dashboard**
- Real-time enrollment status tracking
- Geographic distribution across Australian sites
- Screening pipeline management
- Eligibility criteria monitoring

#### 2. **Biomarker Analysis**
- EGFR mutation status visualization (67% positive)
- PD-L1 expression levels (47.8% average)
- ALK fusion analysis
- Interactive progress bars and charts

#### 3. **Tumor Response Tracking**
- RECIST criteria compliance
- Complete Response (CR), Partial Response (PR), Stable Disease (SD), Progressive Disease (PD)
- Tumor size change visualization
- Real-time metrics dashboard

#### 4. **Patient Outcomes & QoL**
- Baseline vs current Quality of Life scores
- Improvement tracking (+8.1 average improvement)
- Individual patient progress monitoring
- Trend analysis

#### 5. **Safety & Compliance**
- Severe adverse events tracking (Grade 3+)
- Protocol deviation monitoring
- Secondary infection tracking (COVID-19, Pneumonia, Sepsis)
- Compliance rate calculation (98.7%)

#### 6. **AI Research Assistant**
- GPT-4 powered chat interface
- Clinical trial data analysis
- Patient pattern recognition
- Research insights generation

### Setup Instructions

1. **Switch to the clinical trials branch**:
   ```bash
   git checkout clinical-trials-chat-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create `.env.local`:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   Open [http://localhost:3000](http://localhost:3000)

### Data Structure

The application uses a comprehensive patient dataset with the following fields:

- **Demographics**: Age, sex, location
- **Clinical**: Cancer type, stage, enrollment status
- **Biomarkers**: EGFR mutation, PD-L1 expression, ALK fusion
- **Outcomes**: Tumor response, QoL scores, adverse events
- **Safety**: Protocol deviations, infections, compliance

### API Integration

- **OpenAI GPT-4**: For AI-powered clinical insights
- **Data Export**: PDF reports and JSON data downloads
- **Real-time Updates**: Live dashboard metrics

---
## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 👥 Team

- **Tom** – Bachelor of Advanced Computing - Scribe
- **Xuan** – Bachelor of Software Engineering – Project Manager  
- **Jana** – Bachelor of Software Engineering - Monitor
- **Arnav** – Bachelor of Software Engineering - Spokesperson
- **Scarlett** – Master of Computing - Checker
- **Josh** – Bachelor of Computing - Deputy
- **Jaylee** – Master of Computing - Coordinator

---
**ModelWorks © 2025** - Bridging AI research with practical applications
