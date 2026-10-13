# DigiShield — Digital Risk Protection Platform

**AI-Powered Brand Protection | Social Profile Detection | Application Impersonation Analysis**

DigiShield is an AI-assisted platform designed to identify potential brand impersonation, analyze suspicious social profiles, compare logos, and support threat investigation through Generative AI.

## Key Features

- **User Authentication:** Registration and login through FastAPI.
- **Brand Management:** Maintain official brand and identity information.
- **Social Profile Detection:** Identify suspicious profile names using RapidFuzz similarity matching.
- **Logo Comparison:** Compare candidate logos against official brand assets.
- **AI-Powered Analysis:** Use Google Gemini to generate insights from stored findings.
- **Results & Review:** Centralize findings for investigation and review.
- **Modular Architecture:** Separate frontend, backend, database, and detection logic.

## Technology Stack

- **Frontend:** React, Vite, JavaScript, CSS
- **Backend:** Python, FastAPI
- **Database:** MongoDB, PyMongo
- **AI Integration:** Google Gemini API
- **Text Similarity:** RapidFuzz
- **Visual Analysis:** Python-based logo comparison modules
- **API Documentation:** OpenAPI / Swagger UI
- **Version Control:** Git and GitHub

## System Architecture

```mermaid
flowchart TD
    U([User / Analyst])
    UI[React + Vite Frontend]
    API[FastAPI Backend]

    AUTH[Authentication]
    BRAND[Brand Management]
    DET[Detection Engine]
    REVIEW[Results and Review]

    FUZZY[RapidFuzz Profile Matching]
    LOGO[Logo Comparison]
    DB[(MongoDB)]
    AI[Google Gemini API]

    subgraph FUTURE["Future Enhancements - Planned"]
        LIVE[Live Threat Monitoring<br/>Authorized APIs and Scheduled Scans]
        TRANS[Transformers<br/>Semantic Text Matching]
        NN[Neural Networks<br/>Multi-Signal Risk Classification]
        CNN[CNNs<br/>Logo and App Icon Features]
        MULTI[Multimodal Detection<br/>Text + Images + Metadata]
        PROD[Production Readiness<br/>Audit Logs, RBAC, Testing and Deployment]
    end

    U --> UI
    UI <-->|REST API| API

    API --> AUTH
    API --> BRAND
    API --> DET
    API --> REVIEW

    AUTH <--> DB
    BRAND <--> DB
    REVIEW <--> DB

    DET --> FUZZY
    DET --> LOGO

    REVIEW <--> AI

    LIVE -.-> DET
    TRANS -.-> FUZZY
    NN -.-> DET
    CNN -.-> LOGO
    MULTI -.-> DET
    PROD -.-> API

    style U fill:#E8F0FE,stroke:#4285F4,color:#172554
    style UI fill:#EDE9FE,stroke:#7C3AED,color:#312E81
    style API fill:#DBEAFE,stroke:#2563EB,color:#1E3A8A
    style DB fill:#D1FAE5,stroke:#059669,color:#064E3B
    style AI fill:#FCE7F3,stroke:#DB2777,color:#831843
    style FUTURE fill:#F8FAFC,stroke:#64748B,stroke-dasharray:5 5,color:#334155
```

### Architecture Overview

1. **Presentation Layer:** React dashboard for brand management and threat review.
2. **API Layer:** FastAPI handles requests, authentication, and application workflows.
3. **Detection Layer:** Python modules perform profile-name similarity matching and logo comparison.
4. **Data Layer:** MongoDB stores application data and findings.
5. **AI Layer:** Gemini generates contextual analysis for supported findings.
6. **Future Intelligence Layer:** Planned integrations for live monitoring, transformer-based semantic matching, neural-network risk classification, CNN-based visual analysis, and multimodal detection.
7. **Production Layer:** Planned improvements for audit logging, role-based access control, automated testing, and deployment.

## Detection Workflow

1. Maintain official brand information.
2. Evaluate available candidate profiles and logo assets.
3. Identify potential similarities using detection modules.
4. Present findings for review.
5. Request AI-assisted analysis when needed.
6. Review evidence and decide on appropriate action.

## Development Phases

- **Phase 1 — Foundation:** React frontend, FastAPI backend, authentication, and MongoDB integration.
- **Phase 2 — Detection:** Brand management, fuzzy profile matching, and logo comparison.
- **Phase 3 — AI Integration:** Gemini-powered analysis and Results & Review workflow.
- **Phase 4 — Live Monitoring (Planned):** Authorized external API integrations and scheduled scans.
- **Phase 5 — Advanced AI (Planned):** Transformer-based semantic matching, neural-network risk classification, CNN-based visual feature extraction, and multimodal detection.
- **Phase 6 — Production Readiness (Planned):** Audit logs, role-based access control, automated testing, and deployment.

## Project Structure

```text
ByteNexus/
├── main.py
├── auth.py
├── database.py
├── demo_scanners.py
├── test_gemini.py
├── detection.py
├── logo_detection.py
├── social_detection_practice.py
├── create_demo_logos.py
├── social_profiles.json
├── sample_logos/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── api.js
│   ├── index.css
│   └── components/
├── public/
├── package.json
├── vite.config.js
├── index.html
└── README.md
```

## Getting Started

### Prerequisites

- Python
- Node.js and npm
- MongoDB or MongoDB Atlas
- Google Gemini API key for AI analysis

### Backend Setup

Create a Python virtual environment:

```bash
python -m venv .venv
```

Activate the virtual environment and install the backend dependencies required by the project.

Start the FastAPI backend:

```bash
uvicorn main:app --reload
```

API documentation: `http://127.0.0.1:8000/docs`

### Frontend Setup

Install the frontend dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed by Vite.

## Environment Configuration

Configure the required credentials in a local `.env` file using the variable names expected by the backend.

```dotenv
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

Never commit API keys, database credentials, or other secrets to GitHub.

## Future Enhancements

- **Live Threat Monitoring:** Authorized external API integrations and scheduled scans.
- **Transformers:** Semantic matching of profile descriptions and brand-related content.
- **Neural Networks:** Risk classification using multiple threat signals.
- **CNNs:** Visual feature extraction for logo and application-icon comparison.
- **Multimodal Detection:** Combine text, image, and metadata signals.
- **Production Readiness:** Audit logs, role-based access, automated testing, and deployment.

## Project Information

- **Project:** DigiShield — Digital Risk Protection Platform
- **Repository:** [ByteNexus on GitHub](https://github.com/jhansivemuluri/ByteNexus)
- **Focus:** AI-assisted brand protection and digital identity risk analysis

## Team Members

- SALMA SHAIK
- YAMINI KRISHNAMANENI
- CHITRA LALITHA DEVU KAKUMANU

---

*Detect potential risks. Investigate with context. Protect digital identity with intelligence.*
