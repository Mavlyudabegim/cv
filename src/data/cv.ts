import { url } from '../utils/url';

// All CV content lives here. Edit this file to update the website.
// Projects are separate Markdown files in src/content/projects/.

export const profile = {
  name: 'Mavlyudabegim Mekhrilloeva',
  shortName: 'Mavlyudabegim M.',
  title: 'Working Student – AI, Automation & Data',
  tagline:
    'Machine Learning student at Saarland University and former software engineer. I use AI, automation and data to solve real business problems.',
  location: 'Saarbrücken, Germany',
  degreeLine: 'M.Sc. Computer Science · DAAD scholar',
  availability: 'Available immediately · up to 20 h/week',
  relocation: 'Open to relocation',
  email: 'mekhrullaeva@gmail.com',
  linkedin: 'https://www.linkedin.com/in/mavlyudabegimmekhrilloeva-4246ba1b1/',
  github: 'https://github.com/Mavlyudabegim',
  cvFile: url('/Mavlyudabegim_Mekhrilloeva_CV.pdf'),
};

export const about = {
  heading: 'From building reporting tools to machine learning',
  paragraphs: [
    "I'm an M.Sc. Computer Science student focusing on Machine Learning at Saarland University, and a DAAD scholar. Before that, I spent 2 years as a software engineer building reporting tools for insurance companies and financial institutions.",
    "I'm good at turning business requirements into working technical solutions and at explaining technical ideas to non-technical stakeholders. I want to keep applying AI and automation to real business problems.",
  ],
};

// `color` picks one of the gradient styles defined in global.css: violet | pink | teal | amber | blue
export const stats = [
  { value: '2 yrs', label: 'Software engineering experience', color: 'violet' },
  { value: '−70%', label: 'Production bugs after adding automated tests', color: 'pink' },
  { value: '+65%', label: 'Usability gain on data-heavy features', color: 'teal' },
  { value: '1.1', label: 'B.Sc. grade (German scale)', color: 'amber' },
];

export type TimelineItem = {
  title: string;
  org: string;
  period: string;
  points: string[]; // may contain <strong> tags
  tags?: string[];
};

export const experience: TimelineItem[] = [
  {
    title: 'Software Engineer (Python / Angular)',
    org: 'Exadel · Tashkent, Uzbekistan',
    period: '06/2022 – 04/2024',
    points: [
      'Developed a web-based reporting platform that lets insurance companies and financial institutions build regulatory and financial reports from ready-made building blocks.',
      'Turned client business requirements into technical solutions by adapting core form designs into custom financial reports with spreadsheet-like formulas and calculations.',
      'Automated report generation with <strong>Python/Django</strong> services on <strong>PostgreSQL</strong>, producing Excel and PDF documents and cutting manual work for business users.',
      'Built data-heavy <strong>Angular (NgRx)</strong> features such as a virtual scroller for large datasets and financial report tables, <strong>improving usability by 65%</strong>.',
      'Improved data quality and reliability with SonarQube analysis and fixes for validation, authorization and API errors. Wrote unit and end-to-end tests with Jest, <strong>reducing production bugs by 70%</strong>.',
      'Worked with stakeholders in an international, cross-functional team of 15 people.',
    ],
    tags: ['Python', 'Django', 'PostgreSQL', 'Angular', 'NgRx', 'Jest', 'SonarQube'],
  },
  {
    title: 'Software Engineering Intern (Node.js / Angular)',
    org: 'EPAM Systems · Tashkent, Uzbekistan',
    period: 'Internship · before Exadel',
    points: [
      'Worked on a <strong>litter-picking web application for the city of Tashkent</strong>, built to keep the city clean with the help of its residents.',
      'Residents can <strong>report places with garbage</strong>, so these spots become visible to others.',
      'Users can <strong>organise litter-picking events</strong> and <strong>find volunteers nearby</strong> to join them.',
      'Built backend features with <strong>NestJS</strong> and <strong>Node.js</strong>, and frontend features with <strong>Angular</strong>.',
      'Gained hands-on experience with a full-stack TypeScript project in a team, from requirements to working features.',
    ],
    tags: ['NestJS', 'Node.js', 'TypeScript', 'Angular'],
  },
];

export const education: TimelineItem[] = [
  {
    title: 'M.Sc. Computer Science (Informatik)',
    org: 'Saarland University · Saarbrücken',
    period: '10/2024 – expected 01/2027',
    points: [
      'All coursework completed. Thesis in progress: <strong>Robust Contracts for Delegated Classification</strong>, incentive contracts for outsourced ML training that stay reliable when the outcome distribution is uncertain.',
      'Relevant courses: Machine Learning, Neural Networks, Machine Translation (NLP), Optimization Algorithms in ML, Cybersecurity in ML.',
      'DAAD Scholarship holder (All Disciplines).',
    ],
  },
  {
    title: 'B.Sc. Computer Engineering',
    org: 'Tashkent University of Information Technologies',
    period: '2018 – 2022',
    points: [
      'Grade: <strong>1.1</strong> (German grading scale). Thesis: Algorithms for preprocessing EMG biosignals.',
      'Relevant courses: Data Structures and Algorithms, Machine Learning, Artificial Intelligence, Numerical Methods.',
    ],
  },
];

// `icon` must be a name from src/components/Icon.astro
export const skills = [
  { group: 'AI & Data', icon: 'spark', color: 'violet', items: ['Machine Learning', 'Neural Networks', 'NLP / Machine Translation', 'Reinforcement Learning', 'Data analysis', 'Data quality', 'PyTorch', 'NumPy', 'pandas'] },
  { group: 'Programming & Data', icon: 'code', color: 'pink', items: ['Python', 'SQL', 'PostgreSQL', 'TypeScript', 'JavaScript'] },
  { group: 'Automation & Tools', icon: 'wrench', color: 'teal', items: ['Django (ORM)', 'NestJS', 'Node.js', 'Angular (NgRx)', 'Git', 'Docker', 'Kubernetes', 'AWS', 'SonarQube', 'Jira'] },
  { group: 'Quality & Testing', icon: 'shield', color: 'amber', items: ['Unit testing (Jest)', 'End-to-end testing', 'Automated code analysis', 'Debugging'] },
  { group: 'Office', icon: 'table', color: 'blue', items: ['Excel', 'Word', 'PowerPoint', 'Outlook'] },
  { group: 'Soft skills', icon: 'people', color: 'violet', items: ['Stakeholder communication', 'Requirements analysis', 'Analytical problem-solving', 'Teamwork', 'Independent work'] },
];

// `level` is the bar width in percent
export const languages = [
  { name: 'Uzbek', label: 'Native', level: 100 },
  { name: 'English', label: 'C1 · fluent', level: 90 },
  { name: 'Russian', label: 'C1', level: 90 },
  { name: 'German', label: 'B1 · in progress', level: 55 },
];

export const awards = [
  { title: 'DAAD Scholarship: All Disciplines', detail: 'German Academic Exchange Service · 2024' },
];

export const contact = {
  heading: "Let's work together",
  text: "I'm looking for a working student position in AI, automation or data. I can start immediately, work up to 20 hours a week and I'm open to relocation.",
};

// Articles section: a simple list of article titles linking to Notion (newest first).
// To add an article, add a line with its title and public Notion link.
export const articles = {
  heading: 'Articles',
  intro: 'I write about machine learning, AI, trustworthy ML and reinforcement learning, explained in plain English.',
  items: [
    { title: 'The Central Limit Theorem', url: 'https://app.notion.com/p/mavlyudabegim/The-Central-Limit-Theorem-3fd208081b7681c39a2aeb205cba5248' },
    { title: 'The “No Free Lunch” Theory: Why No ML Algorithm is Universally Best?', url: 'https://www.notion.so/3fb208081b7681c0b895f9128d114f73' },
  ],
};
