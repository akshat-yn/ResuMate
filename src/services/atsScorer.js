/**
 * Transparent 6-Category ATS Rule-Based Scoring Engine
 * Evaluates resumes with exact 0–100 compatibility weighting.
 */

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const WEAK_VERBS_MAP = {
  helped: ['spearheaded', 'championed', 'facilitated', 'orchestrated'],
  'worked on': ['engineered', 'developed', 'architected', 'executed'],
  'responsible for': ['led', 'managed', 'delivered', 'directed'],
  handled: ['resolved', 'navigated', 'streamlined', 'administered'],
  assisted: ['partnered with', 'collaborated with', 'co-engineered'],
  did: ['implemented', 'executed', 'constructed', 'produced'],
  tried: ['piloted', 'initiated', 'evaluated'],
  made: ['designed', 'formulated', 'established', 'built'],
  'involved in': ['contributed to', 'spearheaded', 'accelerated'],
};

export const POWER_ACTION_VERBS = [
  'accelerated', 'achieved', 'analyzed', 'architected', 'automated',
  'built', 'championed', 'collaborated', 'condensed', 'created',
  'decreased', 'delivered', 'deployed', 'designed', 'developed',
  'engineered', 'established', 'executed', 'expanded', 'expedited',
  'facilitated', 'formulated', 'generated', 'implemented', 'improved',
  'increased', 'initiated', 'launched', 'maximized', 'minimized',
  'modernized', 'orchestrated', 'optimized', 'overhauled', 'pioneered',
  'reduced', 'refactored', 'resolved', 'scaled', 'spearheaded',
  'streamlined', 'transformed', 'unified', 'upgraded', 'validated'
];

export const ATSScorer = {
  evaluateResume(text, parsedData = {}) {
    const lowerText = text.toLowerCase();

    // 1. Skills Relevance (Max 25)
    const { score: skillsScore, feedback: skillsFeedback } = this.scoreSkills(parsedData, lowerText);

    // 2. Experience Quality (Max 20)
    const { score: expScore, feedback: expFeedback } = this.scoreExperience(parsedData, text);

    // 3. Keyword Optimization (Max 20)
    const { score: kwScore, feedback: kwFeedback } = this.scoreKeywords(text);

    // 4. Resume Structure (Max 15)
    const { score: structScore, feedback: structFeedback, missing: missingSections } = this.scoreStructure(parsedData, lowerText);

    // 5. Readability & Layout (Max 10)
    const { score: readScore, feedback: readFeedback } = this.scoreReadability(text);

    // 6. Education Relevance (Max 10)
    const { score: eduScore, feedback: eduFeedback } = this.scoreEducation(parsedData, lowerText);

    let rawTotal = skillsScore + expScore + kwScore + structScore + readScore + eduScore;
    let overallScore = Math.max(15, Math.min(99, Math.round(rawTotal * 10) / 10));

    const categoryScores = {
      skills_relevance: Math.round(skillsScore * 10) / 10,
      experience_quality: Math.round(expScore * 10) / 10,
      keyword_optimization: Math.round(kwScore * 10) / 10,
      resume_structure: Math.round(structScore * 10) / 10,
      readability: Math.round(readScore * 10) / 10,
      education_relevance: Math.round(eduScore * 10) / 10,
    };

    const weakVerbs = this.detectWeakVerbs(text);
    const repeatedWords = this.detectRepeatedWords(text);

    return {
      overallScore,
      categoryScores,
      missingSections,
      weakVerbs,
      repeatedWords,
      breakdown: {
        skills: { score: categoryScores.skills_relevance, max: 25, feedback: skillsFeedback },
        experience: { score: categoryScores.experience_quality, max: 20, feedback: expFeedback },
        keywords: { score: categoryScores.keyword_optimization, max: 20, feedback: kwFeedback },
        structure: { score: categoryScores.resume_structure, max: 15, feedback: structFeedback },
        readability: { score: categoryScores.readability, max: 10, feedback: readFeedback },
        education: { score: categoryScores.education_relevance, max: 10, feedback: eduFeedback },
      }
    };
  },

  scoreSkills(parsedData, text) {
    let score = 0;
    const feedback = [];
    const tech = parsedData.technical_skills || [];
    const soft = parsedData.soft_skills || [];
    const total = tech.length + soft.length;

    if (total >= 10) {
      score += 15;
      feedback.push(`Strong skill density detected (${total} skills identified).`);
    } else if (total >= 5) {
      score += 10;
      feedback.push(`Good skills variety (${total} skills). Consider adding specialized tools.`);
    } else if (total > 0) {
      score += 6;
      feedback.push('Skills section is sparse. Include specific frameworks, libraries, and tools.');
    } else {
      score += 2;
      feedback.push('No distinct technical skills list detected.');
    }

    if (tech.length >= 4 && soft.length >= 2) {
      score += 5;
      feedback.push('Solid balance of technical competencies and soft skills.');
    } else if (tech.length > 0) {
      score += 3;
    }

    // Context check
    let skillsInText = 0;
    for (const s of tech.slice(0, 8)) {
      if (text.includes(s.toLowerCase())) skillsInText++;
    }
    if (skillsInText >= 3) {
      score += 5;
      feedback.push('Skills are actively demonstrated inside work or project bullets.');
    } else {
      score += 2;
      feedback.push('Incorporate core skills directly into work experience descriptions.');
    }

    return { score: Math.min(25, score), feedback };
  },

  scoreExperience(parsedData, text) {
    let score = 0;
    const feedback = [];
    const work = parsedData.work_experience || [];

    if (work.length >= 2) {
      score += 8;
      feedback.push(`Substantial work history (${work.length} roles found).`);
    } else if (work.length === 1) {
      score += 5;
      feedback.push('Single work role listed. Supplement with internships or projects.');
    } else {
      const projects = parsedData.projects || [];
      if (projects.length >= 2) {
        score += 5;
        feedback.push('Strong portfolio projects compensate for limited traditional work history.');
      } else {
        score += 2;
        feedback.push('Limited work experience or project accomplishments detected.');
      }
    }

    const metricMatches = text.match(/(\b\d+%\b|\$\d+[\d,]*[kKmMbB]?|\b\d+\+?\s*(users|clients|requests|ms|seconds|hours|teams|members|projects)\b)/gi) || [];
    if (metricMatches.length >= 4) {
      score += 8;
      feedback.push(`Outstanding measurable impact: found ${metricMatches.length} quantifiable metrics.`);
    } else if (metricMatches.length >= 2) {
      score += 5;
      feedback.push('Good measurable metrics. Quantify 1-2 more bullet points.');
    } else {
      score += 2;
      feedback.push('Lacks measurable results. Add percentages, dollar amounts, or scale numbers.');
    }

    let powerCount = 0;
    for (const v of POWER_ACTION_VERBS) {
      try {
        const regex = new RegExp(`\\b${escapeRegex(v)}\\b`, 'i');
        if (regex.test(text)) powerCount++;
      } catch (_) {
        if (text.toLowerCase().includes(v.toLowerCase())) powerCount++;
      }
    }
    if (powerCount >= 5) {
      score += 4;
      feedback.push('Strong use of active power verbs throughout.');
    } else {
      score += 2;
      feedback.push('Incorporate more executive action verbs (e.g. engineered, orchestrated, scaled).');
    }

    return { score: Math.min(20, score), feedback };
  },

  scoreKeywords(text) {
    let score = 8;
    const feedback = [];
    const words = text.split(/\s+/).filter(Boolean);
    const count = words.length;

    if (count >= 350 && count <= 850) {
      score += 7;
      feedback.push(`Optimal resume word count (${count} words). High ATS readability.`);
    } else if (count >= 200 && count < 350) {
      score += 4;
      feedback.push(`Slightly brief (${count} words). Elaborate on impact.`);
    } else if (count > 850) {
      score += 4;
      feedback.push(`Resume is lengthy (${count} words). Condense to 1-2 pages.`);
    } else {
      score += 2;
      feedback.push('Very low word count.');
    }

    const unique = new Set(words.map((w) => w.toLowerCase()).filter((w) => w.length > 3));
    const diversity = unique.size / Math.max(count, 1);
    if (diversity > 0.45) {
      score += 5;
      feedback.push('Rich industry vocabulary with minimal repetitive phrasing.');
    } else {
      score += 3;
      feedback.push('Reduce repeated words with synonyms and domain terminology.');
    }

    return { score: Math.min(20, score), feedback };
  },

  scoreStructure(parsedData, text) {
    let score = 0;
    const feedback = [];
    const missing = [];
    const personal = parsedData.personal_info || {};

    const contactPoints = ['email', 'phone', 'linkedin'].filter((k) => personal[k]).length;
    if (contactPoints >= 2) {
      score += 4;
      feedback.push('Complete contact details present.');
    } else {
      score += 2;
      feedback.push('Ensure email, phone number, and LinkedIn are prominently featured.');
    }

    if (parsedData.professional_summary || text.includes('summary') || text.includes('objective')) {
      score += 3;
    } else {
      missing.push('Professional Summary');
    }

    if ((parsedData.work_experience && parsedData.work_experience.length > 0) || text.includes('experience')) {
      score += 3;
    } else {
      missing.push('Work Experience');
    }

    if ((parsedData.education && parsedData.education.length > 0) || text.includes('education')) {
      score += 3;
    } else {
      missing.push('Education');
    }

    if ((parsedData.technical_skills && parsedData.technical_skills.length > 0) || text.includes('skills')) {
      score += 2;
    } else {
      missing.push('Skills');
    }

    return { score: Math.min(15, score), feedback, missing };
  },

  scoreReadability(text) {
    let score = 6;
    const feedback = [];
    const lines = text.split('\n');
    const bulletCount = lines.filter((l) => /^[-•*–—►]/.test(l.trim())).length;

    if (bulletCount >= 6) {
      score += 4;
      feedback.push('Well-structured bullet point formatting detected.');
    } else if (bulletCount >= 2) {
      score += 2;
      feedback.push('Some bullets present. Convert remaining blocks into bullet items.');
    } else {
      score += 1;
      feedback.push('Few bullet points found. ATS scanners favor bullet items over large paragraphs.');
    }

    return { score: Math.min(10, score), feedback };
  },

  scoreEducation(parsedData, text) {
    let score = 0;
    const feedback = [];
    const edu = parsedData.education || [];

    if (edu.length > 0) {
      score += 6;
      feedback.push(`Education credential parsed (${edu[0].degree || 'Degree'}).`);
      if (edu[0].institution) score += 2;
      if (edu[0].graduation_year || /20\d\d/.test(text)) {
        score += 2;
        feedback.push('Graduation timeline specified.');
      }
    } else if (/bachelor|master|degree|university|college/i.test(text)) {
      score += 6;
      feedback.push('Academic credentials identified.');
    } else {
      score += 2;
      feedback.push('Include academic degree, major, and graduation year.');
    }

    return { score: Math.min(10, score), feedback };
  },

  detectWeakVerbs(text) {
    const results = [];
    for (const [weak, alts] of Object.entries(WEAK_VERBS_MAP)) {
      try {
        const regex = new RegExp(`(?:^|\\b)${escapeRegex(weak)}(?:\\b|$)`, 'i');
        const match = text.match(regex);
        if (match && match.index !== undefined) {
          const start = Math.max(0, match.index - 25);
          const end = Math.min(text.length, match.index + weak.length + 35);
          const snippet = text.substring(start, end).replace(/\n/g, ' ').trim();
          results.push({
            original_verb: weak,
            suggested_alternatives: alts,
            context: `...${snippet}...`
          });
        }
      } catch (_) {}
    }
    return results.slice(0, 6);
  },

  detectRepeatedWords(text) {
    const stopwords = new Set([
      'the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'were',
      'been', 'also', 'using', 'into', 'over', 'such', 'than', 'then', 'their',
      'them', 'about', 'which', 'more', 'will', 'would', 'could', 'should'
    ]);
    const words = (text.match(/\b[a-zA-Z]{4,}\b/g) || []).map((w) => w.toLowerCase());
    const counts = {};
    for (const w of words) {
      if (!stopwords.has(w)) {
        counts[w] = (counts[w] || 0) + 1;
      }
    }
    return Object.entries(counts)
      .filter(([_, count]) => count >= 6)
      .map(([word]) => word)
      .slice(0, 6);
  }
};
