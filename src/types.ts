export interface Project {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  seoScore: number;
  lastAudited: string | null;
}

export interface AuditIssue {
  id: string;
  category: 'technical' | 'content' | 'performance' | 'accessibility';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  fix: string;
  currentValue?: string;
  suggestedValue?: string;
}

export interface SEOAudit {
  id: string;
  projectId: string;
  url: string;
  createdAt: string;
  scores: {
    overall: number;
    technical: number;
    content: number;
    accessibility: number;
    performance: number;
  };
  metrics: {
    title: string;
    titleLength: number;
    description: string;
    descriptionLength: number;
    canonical: string;
    headingsCount: { h1: number; h2: number; h3: number; h4: number; h5: number; h6: number };
    imagesCount: number;
    imagesWithAltCount: number;
    pageSizeKb: number;
    loadTimeSec: number;
    brokenLinksCount: number;
    schemaMarkupFound: boolean;
    robotsTxtFound: boolean;
    sitemapXmlFound: boolean;
    sslActive: boolean;
    mobileFriendly: boolean;
  };
  issues: AuditIssue[];
}

export interface KeywordData {
  keyword: string;
  volume: number;
  difficulty: number; // 0-100
  competition: 'high' | 'medium' | 'low';
  intent: 'commercial' | 'informational' | 'transactional' | 'navigational';
  cpc: number;
  related: string[];
  longTail: string[];
  questions: string[];
  clusters: {
    clusterName: string;
    keywords: string[];
  }[];
}

export interface CompetitorComparison {
  userUrl: string;
  competitorUrl: string;
  userScore: number;
  competitorScore: number;
  comparison: {
    metric: string;
    userValue: string | number;
    competitorValue: string | number;
    winner: 'user' | 'competitor' | 'tie';
  }[];
  userStrengths: string[];
  userWeaknesses: string[];
  actionPlan: string[];
}

export interface BlogOptimizationResult {
  score: number;
  readability: 'Easy' | 'Medium' | 'Difficult';
  keywordDensity: number;
  sentenceLengthScore: number; // 0-100
  passiveVoicePercentage: number;
  headingsAnalysis: {
    structure: string;
    issues: string[];
  };
  suggestions: {
    seoTitle: string;
    seoDescription: string;
    seoSlug: string;
    headings: string[];
    introductionImprovement: string;
    conclusionImprovement: string;
    missingTopics: string[];
    faqSection: { question: string; answer: string }[];
  };
}

export interface GeneratedContent {
  title: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  schemaMarkup: string;
  brief: string;
}

export interface PerformanceReport {
  lcp: number; // sec
  inp: number; // ms
  cls: number; // 0-1
  ttfb: number; // ms
  pageSize: number; // MB
  renderBlockingCount: number;
  unusedCSSPercent: number;
  unoptimizedImagesCount: number;
  recommendations: string[];
}

export interface AccessibilityReport {
  score: number;
  wcagLevel: 'A' | 'AA' | 'AAA';
  colorContrastIssues: number;
  missingAltCount: number;
  missingAriaLabels: number;
  keyboardNavIssues: number;
  recommendations: string[];
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}
