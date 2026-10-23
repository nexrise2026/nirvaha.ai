# Nirvaha AI

> **"Tell us what's wrong. Discover what to do next."**

Nirvaha AI is an AI-powered life-problem guidance platform designed to help citizens and students understand everyday challenges—such as educational aid, agricultural difficulties, employment hurdles, and administrative documentation—and discover practical, structured action plans, relevant government welfare schemes, and verified support helplines.

---

## 📖 Problem Statement

Navigating complex life problems—such as unexpected crop failure, missing scholarship deadlines, finding legitimate vocational training programs, or obtaining government paperwork—can be deeply disorienting and stressful. 

Key challenges citizens and students face:
- **Information Overload & Jargon**: Official government websites and welfare portals often use dense administrative language that is difficult to understand.
- **Fragmented Portals**: Critical assistance is scattered across dozens of central, state, and non-profit websites.
- **Lack of Clear Next Steps**: People know their immediate crisis, but struggle to know the sequence of concrete actions required to resolve it (e.g., which documents to gather first, where to report, or which toll-free helpline to contact).

---

## 💡 Solution

**Nirvaha AI** bridges the gap between everyday life problems and official solutions:
1. **Plain-Language Articulation**: Users describe their situation without needing legal or bureaucratic terminology.
2. **Immediate Action Checklist**: Step-by-step checklist prioritized by urgency and document requirements.
3. **Relevant Government Schemes**: Direct eligibility criteria, official portal URLs, and application guidelines.
4. **Verified Support Helplines**: Dedicated toll-free grievance contacts and assistance hotlines.

---

## 🚀 Key Features

- **Responsive Experience**: Clean, accessible mobile-friendly interface built with calm green and neutral tones.
- **Problem Domain Categories**:
  - 🎓 **Education**: Scholarships, college fees, admissions, student grants & academic support.
  - 🌾 **Farming**: Crop loss compensation, fertilizers, irrigation subsidies & equipment grants.
  - 💼 **Jobs & Income**: Skill development, employment exchanges, pensions, wages & livelihood aid.
  - ❓ **Other Problems**: Identity documentation, healthcare assistance, civic grievances & legal aid.
- **Guided Problem Input**: Free-form text input with pre-configured real-world examples.
- **Actionable Guidance Output**:
  - Detailed overview tailored to the domain.
  - Prioritized action checklist with one-click copy functionality.
  - Official welfare schemes and central portal links.
  - Verified toll-free citizen support helplines.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 💻 Getting Started Locally

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **yarn** / **pnpm**

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/nirvaha-ai.git
cd nirvaha-ai
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open your browser at [http://localhost:3000](http://localhost:3000).

### 5. Build for Production
```bash
npm run build
```

---

## 📂 Project Structure

```text
nirvaha-ai/
├── index.html          # HTML entry point with metadata & typography
├── package.json        # Dependencies and build scripts
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
├── README.md           # Project documentation
└── src/
    ├── App.tsx         # Main application interface and guidance engine
    ├── index.css       # Tailwind CSS base and global styles
    └── main.tsx        # React root entry point
```

---

## 📄 License

This project is licensed under the MIT License.
