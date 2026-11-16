# ResumeAI – Smart AI Resume Analyzer & ATS Optimizer (React & JavaScript)

ResumeAI is a modern, production-grade AI-powered Resume Analyzer web application built **100% in JavaScript & React**.

> [!TIP]
> **Zero Python Required!** All resume extraction (PDF & DOCX), transparent 6-category ATS scoring, keyword matching, STAR method bullet point rewriting, and history comparison run directly in the browser with Node.js and Vite.

---

## 1. Quick Start (Run in 2 Steps)

### Step 1: Open Terminal in VS Code
Ensure you are in the project folder:
```powershell
cd C:\Users\hp\.gemini\antigravity\scratch\resume-ai
```

### Step 2: Install & Start Development Server
```powershell
npm install
npm run dev
```

Your browser will automatically open:
👉 **`http://localhost:5173`**

*(Press `o` + `Enter` in the terminal to open the browser if it does not open automatically).*

---

## 2. Completed Features

### A. Authentication & Profiles
- Register and login forms with persistent browser session.
- **1-Click "Launch Instant Demo Account"**: Jump straight into the dashboard without registration.
- Profile settings to customize your target role and seniority level.

### B. In-Browser Document Extraction
- Supports **PDF** (`pdfjs-dist`), **DOCX** (`mammoth`), and raw text paste.
- 100% client-side: Files are parsed securely inside your browser memory without third-party uploads.
- Validates file size (<10MB) and format types.

### C. Transparent 6-Pillar ATS Compatibility Scorer (0 to 100)
- **Skills Relevance (25 points)**: Variety of core skills, contextual usage, and technical/soft balance.
- **Experience Quality (20 points)**: Measurable metrics (`%`, `$`, scale counts), tenure, and power action verbs.
- **Keyword Optimization (20 points)**: ATS search density, vocabulary diversity, and optimal length (350–850 words).
- **Resume Structure (15 points)**: Essential sections (Summary, Experience, Education, Skills).
- **Readability & Layout (10 points)**: Concise bullet point formatting instead of dense paragraphs.
- **Education Relevance (10 points)**: Degree clarity, university accreditation, and graduation dates.

### D. Job Description Matching & Keyword Gap Engine
- Paste any employer's vacancy description to calculate a position-specific match score.
- Color-coded skill breakdown: **Matching Skills in Green** and **Missing Skills in Red**.
- High-yield missing ATS keyword recommendations.
- AI-tailored professional summary recommendations customized for the specific vacancy.

### E. AI Resume Bullet Point & Summary Improver
- Side-by-side comparison view (Original vs AI Enhanced).
- Replaces passive phrases (*"responsible for"*, *"helped"*) with executive verbs (*"spearheaded"*, *"engineered"*).
- Converts generic responsibilities into STAR-method accomplishments.
- **Hallucination-Free Safeguard**: Never invents unearned qualifications or false metrics.
- One-click copy to clipboard.

### F. Analysis History & Version Comparison
- View history of past analyses with date and score tiers stored in `localStorage`.
- Compare two versions side-by-side to track score gains and category improvements.
- Delete past analysis records.

### G. Downloadable PDF Report
- Generates downloadable executive PDF reports containing overall ATS score, category breakdowns, strengths, weaknesses, and AI recommendations using `jsPDF`.

---

## 3. Google Gemini AI Integration (Optional)

ResumeAI works out-of-the-box using its built-in rule-based and heuristic ATS scoring engine.

If you want live Gemini AI generation:
1. Open the app and go to **Profile & Settings**.
2. Paste your Google Gemini API key into the **Gemini API Key** field.
3. Click **Save AI Settings**.
*(You can get a free Gemini API key from [aistudio.google.com](https://aistudio.google.com/)).*

---

## 4. Project Structure

```
resume-ai/
├── package.json                    # React 18, Vite, Tailwind CSS, Lucide, Recharts, jsPDF, pdfjs-dist, mammoth
├── vite.config.js                  # Vite server configuration
├── tailwind.config.js              # SaaS brand palette & font configuration
├── postcss.config.js               # PostCSS plugins
├── index.html                      # HTML5 template with Inter typography
├── .env.example                    # Environment template
├── .env                            # Active environment configuration
├── src/
│   ├── main.jsx                    # React entry point
│   ├── App.jsx                     # Core application router & state coordinator
│   ├── index.css                   # Tailwind styles, custom scrollbar & print stylesheet
│   ├── context/
│   │   └── AuthContext.jsx         # Authentication provider (localStorage, demo login, user state)
│   ├── services/
│   │   ├── extractor.js            # In-browser PDF & DOCX text extraction
│   │   ├── atsScorer.js            # Transparent 6-pillar ATS scoring & action verb engine
│   │   ├── geminiService.js        # Google Gemini REST API client & heuristic fallback
│   │   ├── historyService.js       # LocalStorage persistence & side-by-side comparison
│   │   └── pdfExport.js            # High-fidelity downloadable PDF report generator
│   ├── components/
│   │   ├── Navbar.jsx              # Navigation bar with user profile & brand logo
│   │   ├── Sidebar.jsx             # Collapsible SaaS workspace sidebar
│   │   ├── ScoreGauge.jsx          # Circular animated ATS score gauge (0-100)
│   │   ├── CategoryBreakdown.jsx   # 6-category weighted progress bars
│   │   ├── SkillBadges.jsx         # Color-coded matching (green) & missing (red) skills
│   │   ├── FileUpload.jsx          # Drag & drop upload with validation (<10MB)
│   │   └── LoadingState.jsx        # Multi-stage progressive AI analysis animation
│   └── pages/
│       ├── LandingPage.jsx         # SaaS landing hero, pillars, and live preview
│       ├── LoginPage.jsx           # User sign-in with 1-click Demo Account launcher
│       ├── RegisterPage.jsx        # Registration with target role & seniority
│       ├── Dashboard.jsx           # Overview, ATS gauge, score distribution chart
│       ├── UploadPage.jsx          # PDF/DOCX dropzone, text paste & role targeting
│       ├── AnalysisResultsPage.jsx # Full score report, strengths, weaknesses, PDF export
│       ├── JobMatchPage.jsx        # Job description matcher & missing keyword detector
│       ├── ResumeImproverPage.jsx  # Side-by-side STAR rewriter with power verbs
│       ├── HistoryPage.jsx         # Version history and side-by-side comparison
│       └── ProfileSettingsPage.jsx # Candidate preferences & Gemini AI health monitor
└── README.md
```
