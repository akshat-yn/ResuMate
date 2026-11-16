# ResuMate – Smart AI Resume Analyzer & ATS Optimizer (React & JavaScript)

ResuMate is a modern, production-grade AI-powered Resume Analyzer web application built **100% in JavaScript & React**.

## 1. Completed Features

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

