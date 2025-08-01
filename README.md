# CrewAI Company Research Platform

A powerful AI-driven platform that combines CrewAI's multi-agent system with a modern Next.js frontend to automate company and position research. The system intelligently gathers blog articles and YouTube interviews for specified companies and positions using specialized AI agents.

## Architecture Overview

```
┌─────────────────────┐    HTTP/REST API    ┌─────────────────────┐
│                     │ ◄─────────────────► │                     │
│    Next.js Frontend │                     │  CrewAI Backend     │
│                     │                     │                     │
│  - Research Form    │                     │  - Flask API        │
│  - Job Tracking     │                     │  - AI Agents        │
│  - Results Display  │                     │  - Research Tools   │
│                     │                     │                     │
└─────────────────────┘                     └─────────────────────┘
         │                                            │
         │                                            │
         ▼                                            ▼
┌─────────────────────┐                     ┌─────────────────────┐
│   Browser Storage   │                     │   External APIs     │
│                     │                     │                     │
│  - Job State        │                     │  - YouTube API      │
│  - UI Preferences   │                     │  - Blog Search      │
└─────────────────────┘                     │  - Web Scraping     │
                                            └─────────────────────┘
```

## Core Concepts

### **Multi-Agent AI System (CrewAI)**

The backend uses CrewAI's orchestration framework to coordinate specialized AI agents:

- **🔍 Research Coordinator**: Manages the overall research workflow
- **📝 Blog Research Agent**: Searches for relevant blog articles and posts
- **🎥 YouTube Agent**: Finds interview videos and company content
- **🔗 Content Validator**: Verifies and filters discovered links

### **Intelligent Research Pipeline**

1. **Input Processing**: Companies + Positions → Research Matrix
2. **Agent Orchestration**: CrewAI assigns tasks to specialized agents
3. **Parallel Research**: Agents work simultaneously on different aspects
4. **Content Aggregation**: Results are collected and structured
5. **Quality Filtering**: AI validates relevance and quality of findings

### **Real-time Communication**

- **Job Management**: Asynchronous task processing with unique job IDs
- **Status Streaming**: Real-time updates on research progress
- **Event Timeline**: Detailed logging of agent activities
- **Result Delivery**: Structured JSON responses with parsed content

## Project Structure

```
nextjs_crewai/
├── crewai_backend/              # Python backend with CrewAI
│   ├── agents.py                # AI agent definitions
│   ├── crew.py                  # CrewAI orchestration logic
│   ├── tasks.py                 # Research task definitions
│   ├── api.py                   # Flask REST API
│   ├── models.py                # Pydantic data models
│   ├── job_manager.py           # Async job handling
│   ├── gemini_flash.py          # Gemini LLM integration
│   ├── tools/                   # Custom research tools
│   │   ├── youtube_search_tool.py
│   │   └── __init__.py
│   ├── pyproject.toml           # Python dependencies
│   └── poetry.lock
├── nextjs_app/                  # Next.js frontend
│   ├── app/                     # App router pages
│   │   ├── page.tsx             # Main application
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css          # Global styles
│   ├── components/              # React components
│   │   ├── ResearchForm.tsx     # Dynamic input form
│   │   ├── JobTracker.tsx       # Real-time job monitoring
│   │   ├── ResultsDisplay.tsx   # Results visualization
│   │   ├── Toast.tsx            # Notification system
│   │   ├── Header.tsx           # App header
│   │   ├── Footer.tsx           # App footer
│   │   └── ui/                  # Shadcn/ui components
│   ├── lib/                     # Utility functions
│   ├── package.json             # Node.js dependencies
│   └── README.md                # Frontend documentation
└── README.md                    # This file
```

## Quick Start

### Prerequisites

- **Python 3.11+** with Poetry
- **Node.js 18+** with npm/yarn
- **Google AI Studio API Key** (for Gemini)
- **YouTube Data API Key** (optional, for enhanced search)

### **Backend Configuration**

- **LLM Model**: Gemini Flash (fast and cost-effective)
- **Research Tools**: YouTube search, blog discovery, web scraping
- **Job Management**: In-memory with UUID tracking
- **API Framework**: Flask with CORS enabled

### **Frontend Configuration**

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Components**: Shadcn/ui for consistent UI elements
- **State Management**: React hooks with real-time polling

## API Reference

### **Research Endpoints**

#### Start Research Job

```http
POST /api/crew
Content-Type: application/json

{
  "companies": ["Apple", "Google", "Microsoft"],
  "positions": ["CEO", "CTO", "Chief AI Officer"]
}

Response:
{
  "job_id": "uuid-string",
  "status": "STARTED",
  "message": "Research job started"
}
```

#### Get Job Status

```http
GET /api/crew/{job_id}

Response:
{
  "job_id": "uuid-string",
  "status": "COMPLETE",
  "result": "{...json_results...}",
  "events": [
    {
      "data": "CREW_STARTED",
      "timestamp": "2025-08-01T08:04:16.868139"
    }
  ]
}
```

## Key Features

### **Intelligent Research**

- Multi-agent AI coordination using CrewAI
- Specialized agents for different content types
- Automatic relevance filtering and quality assessment
- Parallel processing for faster results

### **Modern Frontend**

- Responsive design with dark/light mode
- Real-time job monitoring with 2-second polling
- Expandable result cards with organized content
- Toast notifications for user feedback

### **Developer Experience**

- Type-safe TypeScript throughout
- Comprehensive error handling
- Modular component architecture
- Hot reload for rapid development

### **Performance**

- Asynchronous job processing
- Efficient API polling strategy
- Optimized React rendering
- Lazy loading for large result sets

## Usage Examples

### **Basic Research**

```typescript
// Research Apple's CEO and CTO
const research = {
  companies: ["Apple"],
  positions: ["CEO", "CTO"],
};
```

### **Multi-Company Analysis**

```typescript
// Compare leadership across tech giants
const research = {
  companies: ["Apple", "Google", "Microsoft", "Amazon"],
  positions: ["CEO", "CTO", "Chief AI Officer"],
};
```

### **Industry Deep Dive**

```typescript
// Research specific roles across industry
const research = {
  companies: ["OpenAI", "Anthropic", "DeepMind", "Cohere"],
  positions: ["Founder", "Chief Scientist", "Head of Safety"],
};
```

**Built with ❤️ using AI-driven architecture and modern web technologies.**
