/**
 * Client-Side Analysis History & Comparison Service
 * Persists user analyses locally using localStorage. Zero database installation required!
 */

const STORAGE_KEY = 'resumeai_analyses_history';

export const HistoryService = {
  getAll() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to read history from localStorage', e);
      return [];
    }
  },

  save(analysis) {
    if (!analysis) return;
    const history = this.getAll();
    // Prepend new analysis
    const updated = [analysis, ...history.filter((h) => h.id !== analysis.id)].slice(0, 30);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  getById(id) {
    const history = this.getAll();
    return history.find((h) => h.id === id) || null;
  },

  delete(id) {
    const history = this.getAll();
    const updated = history.filter((h) => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  compare(id1, id2) {
    const a1 = this.getById(id1);
    const a2 = this.getById(id2);

    if (!a1 || !a2) {
      throw new Error('One or both analysis records were not found.');
    }

    const diff = Math.round((a2.overall_score - a1.overall_score) * 10) / 10;
    const improvements = [];
    const regressions = [];

    const cats = [
      ['skills_relevance', 'Skills Relevance'],
      ['experience_quality', 'Experience Quality'],
      ['keyword_optimization', 'Keyword Optimization'],
      ['resume_structure', 'Resume Structure'],
      ['readability', 'Readability & Layout'],
      ['education_relevance', 'Education Relevance'],
    ];

    for (const [key, label] of cats) {
      const v1 = a1.category_scores?.[key] || 0;
      const v2 = a2.category_scores?.[key] || 0;
      const delta = Math.round((v2 - v1) * 10) / 10;
      if (delta > 0) {
        improvements.push(`${label} gained +${delta} pts`);
      } else if (delta < 0) {
        regressions.push(`${label} decreased by ${delta} pts`);
      }
    }

    if (improvements.length === 0 && regressions.length === 0) {
      improvements.push('Scores remained identical between versions.');
    }

    return {
      analysis_1: {
        id: a1.id,
        filename: a1.filename,
        overall_score: a1.overall_score,
        category_scores: a1.category_scores,
        created_at: a1.created_at,
      },
      analysis_2: {
        id: a2.id,
        filename: a2.filename,
        overall_score: a2.overall_score,
        category_scores: a2.category_scores,
        created_at: a2.created_at,
      },
      score_difference: diff,
      improvements,
      regressions,
    };
  }
};
