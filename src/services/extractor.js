/**
 * Browser-native Document Parser for PDF and DOCX
 * Zero Python required! Runs 100% inside the user's browser.
 */

// Dynamically import libraries to handle PDF & DOCX
let pdfjsLib = null;
let mammoth = null;

async function loadPdfJs() {
  if (!pdfjsLib) {
    try {
      pdfjsLib = await import('pdfjs-dist/build/pdf');
      // Set worker source
      if (pdfjsLib.GlobalWorkerOptions && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
      }
    } catch (e) {
      console.warn('pdfjs-dist direct import fallback', e);
    }
  }
  return pdfjsLib;
}

async function loadMammoth() {
  if (!mammoth) {
    try {
      mammoth = (await import('mammoth')).default || (await import('mammoth'));
    } catch (e) {
      console.warn('mammoth import error', e);
    }
  }
  return mammoth;
}

export const ResumeExtractor = {
  validateFile(file) {
    const maxMb = 10;
    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > maxMb) {
      throw new Error(`File exceeds maximum allowed size of ${maxMb}MB (current: ${sizeMb.toFixed(1)}MB).`);
    }

    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx' && ext !== 'txt') {
      throw new Error(`Unsupported file type '.${ext}'. Please upload a PDF, DOCX, or TXT file.`);
    }
  },

  async extractText(file) {
    this.validateFile(file);
    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === 'txt') {
      const text = await file.text();
      return {
        text: this.cleanText(text),
        metadata: { fileType: 'txt', charCount: text.length, isScanned: false }
      };
    }

    if (ext === 'pdf') {
      return await this.extractFromPdf(file);
    }

    if (ext === 'docx') {
      return await this.extractFromDocx(file);
    }

    throw new Error(`Unsupported format: ${ext}`);
  },

  async extractFromPdf(file) {
    try {
      const lib = await loadPdfJs();
      const arrayBuffer = await file.arrayBuffer();

      if (lib && lib.getDocument) {
        const loadingTask = lib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const pageCount = pdf.numPages;
        let fullText = '';

        for (let i = 1; i <= pageCount; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageStrings = textContent.items.map((item) => item.str);
          fullText += pageStrings.join(' ') + '\n';
        }

        const isScanned = pageCount > 0 && (fullText.trim().length / pageCount) < 50;

        return {
          text: this.cleanText(fullText),
          metadata: {
            fileType: 'pdf',
            pageCount,
            charCount: fullText.length,
            isScanned,
          }
        };
      } else {
        // Fallback: binary text reader
        const text = await this.readTextFallback(file);
        return {
          text: this.cleanText(text),
          metadata: { fileType: 'pdf', charCount: text.length, isScanned: false }
        };
      }
    } catch (err) {
      console.warn('PDF extraction fallback triggered:', err);
      const text = await this.readTextFallback(file);
      return {
        text: this.cleanText(text),
        metadata: { fileType: 'pdf', charCount: text.length, isScanned: false }
      };
    }
  },

  async extractFromDocx(file) {
    try {
      const m = await loadMammoth();
      const arrayBuffer = await file.arrayBuffer();
      if (m && m.extractRawText) {
        const result = await m.extractRawText({ arrayBuffer });
        return {
          text: this.cleanText(result.value),
          metadata: {
            fileType: 'docx',
            charCount: result.value.length,
            isScanned: false
          }
        };
      }
    } catch (e) {
      console.warn('Mammoth docx parse fallback', e);
    }

    const text = await this.readTextFallback(file);
    return {
      text: this.cleanText(text),
      metadata: { fileType: 'docx', charCount: text.length, isScanned: false }
    };
  },

  async readTextFallback(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        // Strip non-printable ASCII binary bytes
        const clean = (typeof content === 'string' ? content : '')
          .replace(/[^\x20-\x7E\t\n\r]/g, ' ')
          .replace(/\s{2,}/g, ' ');
        resolve(clean);
      };
      reader.onerror = () => resolve('');
      reader.readAsText(file);
    });
  },

  cleanText(text) {
    if (!text) return '';
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\u00A0/g, ' ')
      .replace(/\u2019/g, "'")
      .replace(/\u201c/g, '"')
      .replace(/\u201d/g, '"')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  },

  extractHeuristics(text) {
    const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w+/);
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w\-]+/i);
    const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[\w\-]+/i);

    const sectionsFound = [];
    const sectionMap = {
      summary: /\b(summary|objective|profile|about me)\b/i,
      experience: /\b(experience|work history|employment|work experience)\b/i,
      education: /\b(education|academic background|qualifications)\b/i,
      skills: /\b(skills|technical skills|technologies|competencies)\b/i,
      projects: /\b(projects|key projects|personal projects)\b/i,
      certifications: /\b(certifications|certificates|licenses)\b/i,
    };

    for (const [sec, pattern] of Object.entries(sectionMap)) {
      if (pattern.test(text)) {
        sectionsFound.push(sec);
      }
    }

    return {
      email: emailMatch ? emailMatch[0] : '',
      phone: phoneMatch ? phoneMatch[0] : '',
      linkedin: linkedinMatch ? linkedinMatch[0] : '',
      github: githubMatch ? githubMatch[0] : '',
      detectedSections: sectionsFound,
    };
  }
};
