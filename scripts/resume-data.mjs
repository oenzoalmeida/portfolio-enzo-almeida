// Fonte centralizada de informações dos quatro documentos profissionais.
// Qualquer atualização de conteúdo é feita aqui e refletida nos quatro PDFs
// pelo comando `npm run resumes` (scripts/build-resumes.mjs).
// Regras permanentes: sem fotografia, sem travessão, sem barras de conhecimento,
// sem indicadores percentuais e sem qualquer sinal de busca por emprego.

export const updated = { pt: 'Atualizado em novembro de 2026', en: 'Updated in November 2026' };

export const identity = {
  name: 'Enzo Almeida',
  role: {
    pt: 'Desenvolvedor de Software Júnior · Full Stack',
    en: 'Junior Software Developer · Full Stack',
  },
  location: { pt: 'Ribeirão Preto, SP, Brasil', en: 'Ribeirão Preto, SP, Brazil' },
  contacts: {
    email: 'enzoalmeida.dev@gmail.com',
    github: 'https://github.com/oenzoalmeida',
    githubLabel: 'github.com/oenzoalmeida',
    linkedin: 'https://www.linkedin.com/in/enzolara/',
    linkedinLabel: 'linkedin.com/in/enzolara',
    portfolio: 'https://portfolio-enzo-almeida.vercel.app/',
    portfolioLabel: 'portfolio-enzo-almeida.vercel.app',
  },
};

export const profile = {
  pt: 'Desenvolvedor de Software Júnior na Zé Registra, com atuação full stack em sistemas internos, novas funcionalidades, APIs, correção de bugs, testes e melhorias de usabilidade. Estudante de Ciência da Computação na Universidade Paulista (UNIP) desde 2024 e desenvolvedor freelancer desde 2025. Comecei a trabalhar aos 16 anos em um negócio familiar do setor alimentício, usando ferramentas digitais para resolver problemas operacionais. Mantenho projetos pessoais de desenvolvimento de software como iniciativas de aprendizado e aplicação prática de engenharia, separados da minha atuação na Zé Registra.',
  en: 'Junior Software Developer at Zé Registra, working full stack on internal systems, new features, APIs, bug fixes, testing and usability improvements. Computer Science student at Universidade Paulista (UNIP) since 2024 and freelance developer since 2025. I started working at 16 in a family food business, using digital tools to solve operational problems. I maintain personal software projects as learning and applied engineering initiatives, separate from my work at Zé Registra.',
};

export const experience = [
  {
    company: { pt: 'Zé Registra', en: 'Zé Registra' },
    title: { pt: 'Desenvolvedor de Software Júnior · Full Stack', en: 'Junior Software Developer · Full Stack' },
    period: { pt: 'Atual', en: 'Current' },
    items: {
      pt: [
        'Desenvolvimento e manutenção de sistemas internos, novas funcionalidades e APIs.',
        'Correção de bugs, testes e melhorias de usabilidade.',
        'Tecnologias: Java, Spring Boot, JavaScript, React e PostgreSQL.',
      ],
      en: [
        'Development and maintenance of internal systems, new features and APIs.',
        'Bug fixes, testing and usability improvements.',
        'Technologies: Java, Spring Boot, JavaScript, React and PostgreSQL.',
      ],
    },
  },
  {
    company: { pt: 'Projetos independentes', en: 'Independent projects' },
    title: { pt: 'Desenvolvedor freelancer', en: 'Freelance developer' },
    period: { pt: 'Desde 2025', en: 'Since 2025' },
    items: {
      pt: ['Desenvolvimento de aplicações web em projetos independentes.'],
      en: ['Web application development in independent projects.'],
    },
  },
  {
    company: { pt: 'Negócio familiar do setor alimentício', en: 'Family business in the food industry' },
    title: { pt: 'Início da trajetória profissional', en: 'Early career' },
    period: { pt: 'Aos 16 anos', en: 'Starting at 16' },
    items: {
      pt: ['Uso de ferramentas digitais para organizar atividades e resolver problemas operacionais.'],
      en: ['Use of digital tools to organize activities and address operational problems.'],
    },
  },
];

export const education = [
  {
    title: { pt: 'Ciência da Computação', en: 'Computer Science' },
    school: { pt: 'Universidade Paulista (UNIP)', en: 'Universidade Paulista (UNIP)' },
    period: { pt: 'Desde 2024, em andamento', en: 'Since 2024, in progress' },
  },
];

export const skills = [
  {
    group: { pt: 'Backend e APIs', en: 'Backend and APIs' },
    items: ['Java', 'Spring Boot', 'Python', 'Django', 'Node.js', 'REST', 'WebSocket'],
  },
  {
    group: { pt: 'Frontend', en: 'Frontend' },
    items: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'HTML', 'CSS', 'Thymeleaf'],
  },
  {
    group: { pt: 'Dados e infraestrutura', en: 'Data and infrastructure' },
    items: ['PostgreSQL', 'Supabase', 'Docker', 'Git', 'Flyway', 'GitHub Actions'],
  },
  {
    group: { pt: 'IA e visão computacional', en: 'AI and computer vision' },
    items: ['Gemini', 'OpenCV', 'YOLOX'],
  },
];

export const projectsIntro = {
  pt: 'Projetos pessoais de aprendizado e engenharia de software, desenvolvidos fora da atuação profissional na Zé Registra. Cada projeto tem estudo de caso público no portfólio, com as decisões técnicas documentadas.',
  en: 'Personal learning and software engineering projects, developed outside my professional work at Zé Registra. Each project has a public case study on the portfolio with its documented technical decisions.',
};

export const projects = [
  {
    name: 'QueueFlow',
    tagline: { pt: 'Sistema de filas e guichês em tempo real', en: 'Real-time queue and service desk system' },
    description: {
      pt: 'Atualização instantânea entre atendimento, totem e display público.',
      en: 'Instant updates across service stations, kiosks and public displays.',
    },
    stack: ['Java 21', 'Spring Boot', 'React', 'TypeScript', 'WebSocket', 'PostgreSQL', 'Flyway'],
    points: {
      pt: [
        'Comunicação WebSocket com STOMP/SockJS mantém os painéis sincronizados, enquanto REST organiza os fluxos tradicionais.',
        'Papéis distintos separam administração, operação e páginas públicas, com autenticação JWT.',
        'Migrações Flyway e testes E2E tornam o sistema reproduzível.',
      ],
      en: [
        'WebSocket communication with STOMP/SockJS keeps panels in sync, while REST organizes the traditional flows.',
        'Distinct roles separate administration, operation and public pages, with JWT authentication.',
        'Flyway migrations and E2E tests make the system reproducible.',
      ],
    },
  },
  {
    name: 'PratoJá',
    tagline: { pt: 'Cardápio digital e operação multiloja', en: 'Digital menus and multi-store operations' },
    description: {
      pt: 'Personalização de pedidos, checkout e painéis de gestão para diferentes restaurantes.',
      en: 'Order customization, checkout and management dashboards for multiple restaurants.',
    },
    stack: ['Java', 'Spring Boot', 'Thymeleaf', 'PostgreSQL', 'Flyway'],
    points: {
      pt: [
        'Monólito Spring Boot MVC com separação por loja nas consultas e entidades operacionais.',
        'Controles de acesso para clientes, administradores de loja e plataforma.',
        'Migrações versionadas apoiam a evolução dos dados.',
      ],
      en: [
        'Spring Boot MVC monolith with per-store separation in operational queries and entities.',
        'Access controls for customers, store administrators and the platform.',
        'Versioned migrations support data evolution.',
      ],
    },
  },
  {
    name: 'ConfereVision',
    tagline: { pt: 'Conferência visual com visão computacional', en: 'Visual verification with computer vision' },
    description: {
      pt: 'Comparação de objetos detectados em imagens e vídeos com as quantidades esperadas de cada kit.',
      en: 'Comparison of objects detected in images and video with the expected quantities of each kit.',
    },
    stack: ['Python', 'Django', 'OpenCV', 'YOLOX', 'PostgreSQL'],
    points: {
      pt: [
        'Inferência no servidor com OpenCV DNN e YOLOX-s ONNX em CPU, sem depender de API de IA paga.',
        'Resultados apresentados para interpretação e revisão humana.',
        'Históricos e imagens anotadas com isolamento por usuário.',
      ],
      en: [
        'Server-side inference with OpenCV DNN and YOLOX-s ONNX on CPU, without relying on a paid AI API.',
        'Results presented for human interpretation and review.',
        'History and annotated images isolated per user.',
      ],
    },
  },
  {
    name: 'AutoCiclo',
    tagline: { pt: 'Prontuário digital de veículos', en: 'Digital vehicle records' },
    description: {
      pt: 'Revisões, despesas, documentos e alertas de manutenção em um histórico fácil de consultar.',
      en: 'Service history, expenses, documents and maintenance reminders in an easy-to-consult record.',
    },
    stack: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL'],
    points: {
      pt: [
        'Row Level Security isola os registros por conta diretamente no banco.',
        'Autenticação, storage privado de documentos e relatórios imprimíveis.',
        'Testes unitários com Vitest e migrações documentadas no repositório.',
      ],
      en: [
        'Row Level Security isolates records per account directly in the database.',
        'Authentication, private document storage and printable reports.',
        'Unit tests with Vitest and migrations documented in the repository.',
      ],
    },
  },
  {
    name: 'EventPass',
    tagline: { pt: 'Eventos, ingressos com QR Code e check-in', en: 'Events, QR-code tickets and check-in' },
    description: {
      pt: 'Inscrições, check-in por QR Code e pontuação concedida somente após presença validada.',
      en: 'Registration, QR-code check-in and points awarded only after attendance is verified.',
    },
    stack: ['React', 'TypeScript', 'Node.js'],
    points: {
      pt: [
        'Área pública de eventos e ranking, com painel protegido e relatórios.',
        'Página de demonstração simula o fluxo com dados fictícios, sem alterar a produção.',
        'CI com lint, testes, typecheck e build.',
      ],
      en: [
        'Public events area and ranking, with a protected dashboard and reports.',
        'A demo page simulates the flow with fictional data, without touching production.',
        'CI with lint, tests, typecheck and build.',
      ],
    },
  },
  {
    name: 'PenteFino',
    tagline: { pt: 'Revisão assistida de documentos PDF', en: 'AI-assisted PDF document review' },
    description: {
      pt: 'Ferramenta em desenvolvimento para apoiar a identificação de inconsistências em PDFs.',
      en: 'A tool in development to support the identification of inconsistencies in PDFs.',
    },
    stack: ['Java', 'Spring Boot', 'React', 'PostgreSQL', 'Gemini'],
    points: {
      pt: [
        'Processamento em segundo plano por fila persistida no banco de dados.',
        'Análise assistida por IA com validação estruturada das respostas e revisão humana.',
        'Projeto privado, em desenvolvimento; repositório e detalhes internos permanecem privados.',
      ],
      en: [
        'Background processing through a queue persisted in the database.',
        'AI-assisted analysis with structured validation of responses and human review.',
        'Private project, in development; the repository and internal details remain private.',
      ],
    },
  },
];

export const documentTitles = {
  premium: { pt: 'Perfil profissional', en: 'Professional Profile' },
  ats: { pt: 'Currículo profissional', en: 'Professional Resume' },
};

export const sectionTitles = {
  profile: { pt: 'Perfil', en: 'Profile' },
  experience: { pt: 'Experiência profissional', en: 'Professional experience' },
  education: { pt: 'Formação', en: 'Education' },
  skills: { pt: 'Competências técnicas', en: 'Technical skills' },
  projects: { pt: 'Projetos pessoais', en: 'Personal projects' },
};
