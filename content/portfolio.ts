import type { Portfolio } from "./types";

/*
  Source of truth. Derived from Subhash Galla's resume (2026).
  TODO markers = real values still needed from Subhash:
    - GitHub / LinkedIn URLs
    - per-project repo / live links
    - resume PDF at /public/subhash-galla-resume.pdf
    - headshot at /public/subhash-galla.jpg  (1600x1600+, the grey-bg photo)
    - real one-liner + metric for "Operations Review Tracker"
*/

export const portfolio: Portfolio = {
  person: {
    name: "Subhash Galla",
    role: "AI & Software Engineer",
    statement:
      "I build LLM systems that stay grounded and the full-stack products that put them to work. Retrieval pipelines, natural-language planners, and document AI that beat their baselines on the numbers that matter.",
    location: "Denton, Texas",
    availability: "Open to full-time AI and software engineering roles",
    photo: "/subhash-galla.jpg", // TODO: add the grey-background headshot at public/subhash-galla.jpg
  },

  socials: [
    { kind: "email", href: "mailto:subhashgalla33@gmail.com", handle: "subhashgalla33@gmail.com" },
    { kind: "github", href: "", handle: "" }, // TODO: github url
    { kind: "linkedin", href: "", handle: "" }, // TODO: linkedin url
    { kind: "resume", href: "/subhash-galla-resume.pdf", handle: "Resume" }, // TODO: drop PDF in /public
  ],

  nav: [
    { id: "home", label: "Index" },
    { id: "work", label: "Work" },
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "contact", label: "Contact" },
  ],

  hero: {
    headline: "AI systems that stay {signal}grounded{/signal}.",
    sub: "AI and software engineer. Retrieval, planning, and document AI, and the full-stack systems that carry them into real use.",
  },

  about: {
    paragraphs: [
      "Most language-model demos fall apart the moment they leave the slide. My work is about the opposite: systems that cite their sources, validate their own output, and get measured against a baseline before anyone calls them done.",
      "That pattern runs through everything I have built. A retrieval-augmented chatbot that answered 25 percent more relevantly than an LLM-only workflow. A natural-language robot planner that went from 62 to 88 percent valid task completion once the output was parsed and checked. A document-AI proof of concept at Westat that reads registration paperwork end to end, from upload to validated fields.",
      "I studied computer science with an AI specialization at the University of North Texas, graduating in 2026 on the President's List. Alongside the models I have shipped React Native apps on a Postgres and Prisma backend, mentored intro-CS students, and run stand-ups and retros for a small project team. I like the whole loop: the model, the service around it, and the interface a person actually touches.",
    ],
    now: "Looking for a team building serious LLM or full-stack systems.",
  },

  work: [
    {
      slug: "retrieval-augmented-chatbot",
      index: 1,
      name: "Retrieval-Augmented Chatbot",
      impact: "Grounded answers over domain sources, 25 percent more relevant than an LLM-only baseline.",
      summary:
        "A chatbot that retrieves from domain knowledge before it answers, so responses stay tied to real documents instead of model memory. I built the retrieval layer, the prompt orchestration, and a structured response step, then measured every change against a plain LLM workflow.",
      role: "Sole developer",
      timeframe: "2025",
      stack: ["Python", "LangChain", "Hugging Face", "RAG", "Vector search"],
      domains: ["Generative AI", "Retrieval"],
      links: { repo: "", caseStudy: true }, // TODO repo
      media: null, // architecture diagram, generated
      metrics: [
        { value: "+25%", label: "answer relevance vs LLM-only" },
      ],
    },
    {
      slug: "nl-robot-task-planner",
      index: 2,
      name: "Natural-Language Robot Task Planner",
      impact: "Turned plain-language instructions into validated robot action steps, 62 to 88 percent valid completion.",
      summary:
        "An LLM planner that converts an instruction like \"pick up the red block and place it on the shelf\" into a checked sequence of pick, move, and place actions in JSON. The gain came from output validation: parsing the model's plan, rejecting malformed steps, and re-prompting until the sequence was executable.",
      role: "Sole developer",
      timeframe: "2025",
      stack: ["Python", "LLMs", "JSON schema", "Prompt engineering"],
      domains: ["Agentic AI", "Planning"],
      links: { repo: "", caseStudy: true }, // TODO repo
      media: null,
      metrics: [
        { value: "62 → 88%", label: "valid task completion" },
      ],
    },
    {
      slug: "food-logging-app",
      index: 3,
      name: "Food-Logging App",
      impact: "A full-stack mobile food tracker: React Native front end, Postgres and Prisma behind it.",
      summary:
        "A mobile app for logging meals through the day. I built app screens, navigation flows, and the interactions people use daily, backed by a Prisma data layer over PostgreSQL for storage and retrieval. The project pushed my full-stack range across UI, data flow, and debugging.",
      role: "Full-stack developer, team of four",
      timeframe: "2024 – 2025",
      stack: ["React Native", "Expo", "PostgreSQL", "Prisma", "TypeScript"],
      domains: ["Full-Stack", "Mobile"],
      links: { repo: "", caseStudy: false }, // TODO repo / live
      media: null,
    },
    {
      slug: "operations-review-tracker",
      index: 4,
      name: "Operations Review Tracker",
      impact: "", // TODO: real one-liner from Subhash
      summary:
        "An operations-review tracker built on SAP data with Excel and Tableau for reporting.", // TODO: verify + expand
      role: "Contributor",
      timeframe: "2024",
      stack: ["Excel", "Tableau", "SAP"],
      domains: ["Data"],
      links: {},
      media: null,
    },
  ],

  experience: [
    {
      company: "Westat",
      title: "AI Software Engineer Intern",
      period: "Jun – Aug 2026",
      highlights: [
        "Built an AI proof of concept that processes registration documents end to end: upload, metadata extraction, requirement matching, and validation.",
        "Integrated Bedrock-style LLM workflows and vector search to speed document review and requirement lookup.",
        "Created the reviewer-facing UI showing extracted fields, validation results, and status.",
        "Worked with mentors to test and debug the pipeline toward reliable end-to-end runs.",
      ],
      stack: ["Python", "AWS Bedrock", "Vector search", "REST APIs", "LLM workflows"],
    },
    {
      company: "University of North Texas",
      title: "IT Support Assistant, Computer Labs",
      period: "May 2024 – May 2026",
      location: "Denton, TX",
      highlights: [
        "Resolved user issues in a customer-facing lab environment; documented outcomes and escalated complex cases with context.",
        "Prioritized concurrent requests under deadline across staff, students, and technical teams.",
        "Wrote quick guides and small automations that made common fixes faster and more consistent.",
      ],
      stack: ["Troubleshooting", "Documentation", "Automation"],
    },
  ],

  education: [
    {
      institution: "University of North Texas",
      credential: "B.S. Computer Science, Certified Specialization in Artificial Intelligence",
      period: "2022 – 2026",
      detail:
        "GPA 3.7. President's List, Fall 2024 and Spring 2025. Coursework in Reinforcement Learning, Machine Learning, Data Science, Data Structures & Algorithms, Operating Systems, and Databases.",
    },
  ],

  capabilities: [
    {
      key: "ai",
      label: "AI / ML",
      items: [
        "LLMs", "RAG", "LangChain", "Hugging Face", "Prompt engineering", "NLP",
        "Generative AI", "PyTorch", "TensorFlow", "scikit-learn", "CNNs", "Reinforcement Learning",
      ],
    },
    {
      key: "lang",
      label: "Languages",
      items: ["Python", "TypeScript", "JavaScript", "Java", "SQL", "C++", "C", "R"],
    },
    {
      key: "fullstack",
      label: "Full-Stack",
      items: ["React Native", "Expo", "REST APIs", "HTML / CSS", "UI development"],
    },
    {
      key: "data",
      label: "Data & Backend",
      items: ["PostgreSQL", "Prisma", "Vector search", "Data modeling", "Database design", "JSON"],
    },
    {
      key: "practice",
      label: "Engineering",
      items: [
        "Data Structures & Algorithms", "OOP", "Software engineering", "Evaluation testing",
        "Debugging", "API integration", "Agile",
      ],
    },
    {
      key: "tools",
      label: "Tools",
      items: ["Git", "GitHub", "AWS Bedrock", "VS Code", "Jupyter"],
    },
  ],

  contact: {
    headline: "Have a system worth building?",
    sub: "The fastest way to reach me is email. Bring a hard problem and I will read every line.",
    primaryEmail: "subhashgalla33@gmail.com",
  },

  meta: {
    siteUrl: "https://subhashgalla.vercel.app", // TODO: real domain
    title: "Subhash Galla — AI & Software Engineer",
    description:
      "Subhash Galla builds grounded LLM systems and full-stack products: retrieval pipelines, natural-language planners, and document AI, with selected projects and experience.",
  },
};
