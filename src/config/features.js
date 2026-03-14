export const SIDEBAR_NAV_SECTIONS = [
  {
    key: 'ai-tools',
    title: 'AI Tools',
    items: [
      {
        key: 'cringe-meter',
        label: 'LinkedIn Cringe-o-Meter',
        icon: '🤏',
        path: '/cringe-meter',
        description: 'LinkedIn buzzword and cringe analysis',
      },
      {
        key: 'resume-roast',
        label: 'Resume Roast',
        icon: '🔥',
        path: '/resume-roast',
        description: 'Brutally honest resume feedback',
      },
      {
        key: 'email-smoothener',
        label: 'Email Smoothener',
        icon: '📨',
        path: '/email-smoothener',
        description: 'Vibe-check your draft with three sendable versions',
      },
      {
        key: 'skill-assessment',
        label: 'Skill Assessment',
        icon: '🎯',
        path: '/skill-assessment',
        description: 'AI skill evaluation and learning roadmap',
      },
      {
        key: 'stock-analysis',
        label: 'Stock Analysis',
        icon: '📈',
        path: '/stock-analysis',
        description: 'Fundamental analysis and research reports',
      },
    ],
  },
  {
    key: 'career-tools',
    title: 'Career Tools',
    items: [
      {
        key: 'career-roadmap',
        label: 'Career Roadmap',
        icon: '🧭',
        description: 'Plan your next role and milestones',
        disabled: true,
      },
      {
        key: 'interview-coach',
        label: 'Interview Coach',
        icon: '🎤',
        description: 'Mock interview prep and feedback',
        disabled: true,
      },
    ],
  },
  {
    key: 'content-tools',
    title: 'Content Tools',
    items: [
      {
        key: 'post-rewriter',
        label: 'Post Rewriter',
        icon: '✍️',
        description: 'Rewrite content for clarity and tone',
        disabled: true,
      },
      {
        key: 'caption-generator',
        label: 'Caption Generator',
        icon: '📝',
        description: 'Generate social copy quickly',
        disabled: true,
      },
    ],
  },
  {
    key: 'utilities',
    title: 'Utilities',
    items: [
      {
        key: 'admin-analytics',
        label: 'Admin Analytics',
        icon: '📊',
        path: '/admin/analytics',
        description: 'Feature usage, top users, and common queries',
        requiresSuperUser: true,
      },
      {
        key: 'dashboard',
        label: 'Dashboard',
        icon: '🏠',
        path: '/dashboard',
        description: 'Overview and quick actions',
      },
      {
        key: 'settings',
        label: 'Settings',
        icon: '⚙️',
        description: 'Personalization and preferences',
        disabled: true,
      },
    ],
  },
];

export const FEATURE_NAV_ITEMS = SIDEBAR_NAV_SECTIONS.flatMap((section) =>
  section.items.filter((item) => item.path)
);
