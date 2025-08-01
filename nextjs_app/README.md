# ResearchAI Frontend

A sleek, modern Next.js frontend for the CrewAI-powered company research system. This application provides an intuitive interface for researching companies and positions, with real-time AI agent tracking and beautiful results display.

## 🌟 Features

### 🎯 **Smart Research Interface**

- **Dynamic Form**: Add/remove companies and positions with intuitive controls
- **Input Validation**: Real-time validation and user-friendly error messages
- **Research Preview**: Shows expected scope (companies × positions = total combinations)

### 🤖 **Real-time AI Tracking**

- **Live Job Monitoring**: Polls backend every 2 seconds for status updates
- **Activity Timeline**: Shows detailed progression of AI agent activities
- **Status Indicators**: Visual feedback for STARTED/COMPLETE/ERROR states
- **Automatic Results**: Seamlessly transitions to results when complete

### 📊 **Rich Results Display**

- **Expandable Cards**: Click to expand/collapse detailed research results
- **Summary Statistics**: Overview of companies, positions, blogs, and videos found
- **Organized Content**: Separate sections for blog articles and YouTube interviews
- **External Links**: Safe, one-click access to all discovered content
- **Bulk Actions**: Expand all, collapse all, or start new search

### 🎨 **Modern UI/UX**

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Mode Support**: Automatic theme switching with system preferences
- **Gradient Animations**: Beautiful animated gradients and hover effects
- **Loading States**: Comprehensive loading indicators throughout the app
- **Error Handling**: Graceful error display with recovery options

## 📋 Backend Integration

### **API Endpoints Used**

```typescript
// Start new research job
POST http://localhost:3001/api/crew
{
  "companies": ["Apple", "Google"],
  "positions": ["CEO", "CTO"]
}

// Get job status and results
GET http://localhost:3001/api/crew/{job_id}
```

### **Data Flow**

1. **User Input** → Research form collects companies and positions
2. **Job Creation** → POST request creates research job, returns job_id
3. **Real-time Polling** → GET requests every 2 seconds for status updates
4. **Results Display** → When complete, results are parsed and displayed

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend running on port 3001

### Installation

```bash
# Navigate to frontend directory
cd nextjs_app

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🧩 Component Overview

### **ResearchForm.tsx**

- Dynamic company/position field management
- Real-time validation and count display
- Research scope preview

### **JobTracker.tsx**

- Real-time monitoring of AI research progress
- Event timeline with timestamps
- Automatic transition to results

### **ResultsDisplay.tsx**

- Rich visualization of research results
- Expandable card interface
- Summary statistics dashboard

## 🎨 Technology Stack

- **Next.js 15** - React framework with app directory
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Shadcn/ui** - High-quality components

---

Built with ❤️ using CrewAI, Next.js, TypeScript, and Tailwind CSS.
