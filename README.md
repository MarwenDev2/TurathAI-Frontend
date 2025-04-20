# TurathAI Frontend Workspace

🚀 **Overview**  
TurathAI Frontend is a multi-application Angular workspace containing both the public-facing **Frontoffice** and administrative **Backoffice** interfaces for the TurathAI platform.  
This AI-driven initiative promotes sustainable tourism by showcasing Tunisia's rich heritage, with separate optimized experiences for end-users and administrators.

---

## 🌟 Application Features

### 🏛 Frontoffice (Public Site)
- Heritage Site Exploration & Discovery  
- Cultural Event Browsing  
- User Review System  
- AI-Powered Recommendations  
- Gamification Features  

### 👑 Backoffice (Admin Panel)
- User Management System  
- Content Management (Sites/Events)  
- Analytics Dashboard  
- System Configuration  
- Moderation Tools  

---

## 🛠 Technologies Used

- **Angular Workspace**: Multi-project architecture  
- **UI Frameworks**: Angular Material + TailwindCSS  
- **State Management**: NgRx (shared store)  
- **API Communication**: RESTful APIs via `HttpClient`  
- **Authentication**: JWT with role-based guards  
- **Build System**: Angular CLI with custom configurations  

---

## 🚀 Getting Started

### ✅ Prerequisites
- Node.js v16+ (LTS recommended)  
- Angular CLI v15+ (`npm install -g @angular/cli`)  
- Git  

### 📥 Installation & Development

# Clone repository
git clone https://github.com/MarwenDev2/TurathAI-Frontend.git
cd TurathAI-Frontend

# Install dependencies
npm install

ng serve

### 🔧 Build Commands

# Production build (both apps)
ng build frontoffice --configuration production
ng build backoffice --configuration production

# Build with stats analysis
ng build frontoffice --stats-json

### 🌐 Access Points

Frontoffice: http://localhost:4200/frontoffice

Backoffice: http://localhost:4200/backoffice


### 📌 Contributing Guidelines

Clone the workspace

Create feature branches from develop

Follow naming conventions:

feat/frontoffice/[feature-name]

feat/backoffice/[feature-name]

feat/shared/[component-name]

Submit PRs to the develop branch
