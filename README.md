# 🎓 Student OS

**Live Demo:** [https://student-os-olive.vercel.app/](https://student-os-olive.vercel.app/)

Welcome to **Student OS**, an all-in-one, entirely offline-capable productivity dashboard designed specifically for students and self-learners. Built using modern web technologies, Student OS aggregates all the essential tools a student needs into a single, beautifully designed application.

All data is securely saved directly in your browser using `localStorage`, ensuring maximum privacy and instant load times with zero backend required.

---

## ✨ Features

- **📊 Dashboard Overview**: Get a high-level summary of your day including total tasks, completed tasks, focus time, and a dynamic daily progress bar along with inspirational quotes.
- **✅ Task Manager**: A full CRUD interactive task board with drag-and-drop reordering, priority flagging (Low, Medium, High), and status filtering.
- **📚 DSA Tracker**: Specially crafted for computer science students! Track your progress on Data Structures and Algorithm problems, categorized by Topic and Difficulty.
- **⏱️ Pomodoro Timer**: A beautiful circular animated timer adhering to the classic 25-min focus / 5-min break methodology to supercharge deep work sessions.
- **📝 Markdown Notes**: A built-in scratchpad for your thoughts supporting full Markdown syntax (`react-markdown`) with auto-save.
- **📈 Native Analytics**: Uses `recharts` to seamlessly generate visualizations of your study trends (last 7 days Focus Time line chart, and Tasks Priority bar chart) and tracks your daily study streaks!
- **🌙 Dark/Light Mode**: First-class support for both themes utilizing a premium CSS variables color system.
- **⌨️ Keyboard Shortcuts**: Navigate cleanly without a mouse. Press `T` for Tasks, `N` for Notes, `D` for Dashboard, and `P` for Pomodoro!
- **💾 Export to JSON**: One-click download of all your `localStorage` data for backup purposes.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: `react-router-dom`
- **Styling**: Premium Vanilla CSS (CSS Variables, Glassmorphism, Micro-animations)
- **Data Persistence**: Custom React Hooks interfacing with browser `localStorage`
- **Key Libraries**: 
  - `lucide-react` (Icons)
  - `recharts` (Analytics Visualization)
  - `@hello-pangea/dnd` (Drag and Drop Task Reordering)
  - `react-markdown` (Rich Text Note Rendering)
  - `date-fns` (Time and History Formatting)

---

## 🚀 Getting Started Locally

Want to run Student OS on your own machine? Follow these simple steps.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository** (if applicable) or download the source code:
   ```bash
   git clone <your-repository-url>
   cd "Student OS"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   # or
   npm start
   ```

4. **Open your browser**:
   Navigate to `http://localhost:5173/` (or the port specified in your terminal) to see the app in action!

### Building for Production
To generate a highly-optimized production build:
```bash
npm run build
```
This will output the compiled application into a `dist` folder, ready to be deployed to platforms like Vercel, Netlify, or GitHub Pages.

---

## 📖 Architecture & File Structure

The project is structured efficiently using React functional components and hooks:

```text
Student OS/
├── public/                 # Static assets
└── src/
    ├── components/
    │   ├── common/         # Reusable UI components (Card, Button, Input)
    │   └── layout/         # Structural components (Sidebar, Topbar)
    ├── context/            # Global State Management (AppContext, ThemeContext)
    ├── hooks/              # Custom React Hooks (useLocalStorage, useKeyPress)
    ├── pages/              # Primary Views (Dashboard, TaskManager, Notes, etc.)
    ├── App.jsx             # Main Router and Provider injection
    ├── index.css           # Global Styling and Theme Variables
    └── main.jsx            # React Bootstrap file
```

---

*Designed and Built for a focused, productive learning experience.*
