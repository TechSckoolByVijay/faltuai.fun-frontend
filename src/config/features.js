export const SIDEBAR_NAV_SECTIONS = [
  {
    key: 'faltu-growth',
    title: 'Faltu Growth',
    items: [
      {
        key: 'resume-roast',
        label: 'Resume Roast',
        icon: '🔥',
        path: '/resume-roast',
        description: 'Brutally honest resume feedback',
      },
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
      {
        key: 'skill-assessment',
        label: 'Skill Assessment',
        icon: '🎯',
        path: '/skill-assessment',
        description: 'AI skill evaluation and learning roadmap',
      },
    ],
  },
  {
    key: 'faltu-content',
    title: 'Faltu Content',
    items: [
      {
        key: 'cringe-meter',
        label: 'LinkedIn Cringe-o-Meter',
        icon: '🤏',
        path: '/cringe-meter',
        description: 'Buzzword and cringe analysis',
      },
      {
        key: 'post-rewriter',
        label: 'Post Rewriter',
        icon: '✍️',
        description: 'Rewrite for clarity and tone',
        disabled: true,
      },
      {
        key: 'caption-generator',
        label: 'Caption Generator',
        icon: '📝',
        description: 'Generate social copy quickly',
        disabled: true,
      },
      {
        key: 'email-smoothener',
        label: 'Email Smoothener',
        icon: '📨',
        path: '/email-smoothener',
        description: 'Vibe-check your drafts',
      },
    ],
  },
  {
    key: 'faltu-lifestyle',
    title: 'Faltu Lifestyle',
    items: [
      {
        key: 'ai-news-podcast',
        label: 'AI News Podcast',
        icon: '🎧',
        description: 'Personalized daily audio briefing for students',
        disabled: true,
      },
      {
        key: 'ai-newsletter',
        label: 'AI Newsletter',
        icon: '📰',
        description: 'Smart curation of news you actually need',
        disabled: true,
      },
      {
        key: 'idea-spark',
        label: 'Idea Spark',
        icon: '💡',
        path: '/idea-spark',
        description: 'Turn one phrase into 10 practical micro-ideas',
      },
    ],
  },
  {
    key: 'faltu-utilities',
    title: 'Faltu Utilities',
    items: [
      {
        key: 'name-craft',
        label: 'NameCraft',
        icon: '🧭',
        path: '/name-craft',
        description: 'Generate consistent naming conventions fast',
      },
    ],
  },
  {
    key: 'admin',
    title: 'Admin',
    items: [
      {
        key: 'admin-analytics',
        label: 'Admin Analytics',
        icon: '📊',
        path: '/admin/analytics',
        description: 'Feature usage, top users, and common queries',
        requiresSuperUser: true,
      },
    ],
  },
];

export const FEATURE_NAV_ITEMS = SIDEBAR_NAV_SECTIONS.flatMap((section) =>
  section.items.filter((item) => item.path)
);
