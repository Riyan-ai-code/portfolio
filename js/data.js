/**
 * ============================================================================
 * PARTHIB DEY — 3D AI & FULL-STACK PORTFOLIO DATA (js/data.js)
 * ============================================================================
 */

export const PORTFOLIO_DATA = {
  profile: {
    name: "Parthib Dey",
    handle: "parthib.ai.dev",
    role: "Aspiring Full-Stack AI Engineer",
    tagline:
      "Aspiring Full-Stack AI Engineer specializing in scalable applications powered by Machine Learning and Generative AI. Experienced in building end-to-end systems using Next.js, React, Node.js, and FastAPI. Skilled in computer vision, predictive modeling, GraphRAG, and AI-powered automation. Passionate about developing high-performance solutions that solve real-world problems.",
    location: "Mr & Ms Coliving, AECS Layout, Bengaluru – 560037",
    availability: "B.E. AI & ML @ CMRIT Bengaluru (2027) • Open to Internships & Full-Stack AI Roles",
    email: "Parthib100320@gmail.com",
    collegeEmail: "prde23aiml@cmrit.ac.in",
    phone: "+91 7099647523",
    github: "https://github.com/Riyan-ai-code",
    stats: [
      { label: "DisasterRadar ROC-AUC", value: "0.978" },
      { label: "Deepfake Detector ROC-AUC", value: "97.29%" },
      { label: "Flagship AI Systems", value: "3+" },
      { label: "Core Tech Domains", value: "7 Categories" }
    ]
  },

  /**
   * 7 Technical Skill Categories from Resume
   */
  skillCategories: [
    {
      id: "languages",
      title: "Programming Languages",
      icon: "💻",
      color: "#3b82f6",
      items: ["C++", "SQL", "Java", "Python"]
    },
    {
      id: "gen-ai",
      title: "Generative AI",
      icon: "🧠",
      color: "#00f2fe",
      items: ["LLMs", "RAG", "GraphRAG", "Guardrails"]
    },
    {
      id: "ml-fundamentals",
      title: "ML & Fundamentals",
      icon: "📊",
      color: "#ff0844",
      items: ["OpenCV", "TensorFlow Lite", "ML Evaluation", "SHAP", "Scikit-Learn"]
    },
    {
      id: "web-tech",
      title: "Web Technologies",
      icon: "🌐",
      color: "#38ef7d",
      items: ["JavaScript", "React.js", "Express.js", "Node.js", "FastAPI", "Next.js", "REST APIs", "Redis"]
    },
    {
      id: "database",
      title: "Database",
      icon: "🗄️",
      color: "#f59e0b",
      items: ["PostgreSQL", "Supabase", "Database Design"]
    },
    {
      id: "devops",
      title: "DevOps & Deployment",
      icon: "🐳",
      color: "#8b5cf6",
      items: ["Docker", "Azure", "Vercel", "Render", "GitHub Actions", "CI/CD"]
    },
    {
      id: "platforms-tools",
      title: "Platforms & Tools",
      icon: "🛠️",
      color: "#ec4899",
      items: ["Git", "GitHub", "VS Code", "Postman"]
    }
  ],

  /**
   * 3D Constellation Nodes (Mapped across all 7 categories)
   */
  skills: [
    // --- 1. GENERATIVE AI (Inner Neural Orbit) ---
    {
      id: "genai-rag-graphrag",
      name: "RAG & GraphRAG",
      category: "gen-ai",
      categoryLabel: "Generative AI",
      level: 96,
      orbitRadius: 4.6,
      orbitSpeed: 0.36,
      orbitAngle: 0.0,
      yOffset: 1.1,
      geometry: "icosahedron",
      color: "#00f2fe",
      description:
        "Graph-based RAG (GraphRAG) storing AST and entity relationships in PostgreSQL to traverse dependency graphs, minimize hallucination, and generate targeted impact maps.",
      tags: ["GraphRAG", "RAG", "LLMs", "Python AST", "Guardrails"],
      connections: ["genai-llms-guardrails", "lang-python-sql", "db-postgres-supabase", "web-backend-apis"]
    },
    {
      id: "genai-llms-guardrails",
      name: "LLMs & Guardrails",
      category: "gen-ai",
      categoryLabel: "Generative AI",
      level: 95,
      orbitRadius: 4.6,
      orbitSpeed: 0.36,
      orbitAngle: 1.57,
      yOffset: -1.0,
      geometry: "octahedron",
      color: "#00d2ff",
      description:
        "Context-aware prompting, structured outputs with Google Gemini API, and deterministic Prompt/Test Guardrails for zero-hallucination AI assistants and pre-deployment engines.",
      tags: ["LLMs", "Guardrails", "Google Gemini API", "Structured Outputs", "Prompt Engineering"],
      connections: ["genai-rag-graphrag", "ml-sklearn-shap-eval", "web-backend-apis"]
    },

    // --- 2. ML & FUNDAMENTALS (Inner-Mid Orbit) ---
    {
      id: "ml-sklearn-shap-eval",
      name: "Scikit-Learn, SHAP & ML Eval",
      category: "ml-fundamentals",
      categoryLabel: "ML & Fundamentals",
      level: 95,
      orbitRadius: 5.4,
      orbitSpeed: 0.3,
      orbitAngle: 3.14,
      yOffset: 1.3,
      geometry: "dodecahedron",
      color: "#ff0844",
      description:
        "Predictive modeling with Scikit-Learn, XGBoost & Random Forest ensembles (0.978 ROC-AUC), SHAP model explainability, PSI/KS drift detection, and rigorous ML evaluation.",
      tags: ["Scikit-Learn", "SHAP", "ML Evaluation", "XGBoost", "Random Forest", "MLflow"],
      connections: ["ml-opencv-tflite", "lang-python-sql", "genai-llms-guardrails"]
    },
    {
      id: "ml-opencv-tflite",
      name: "OpenCV & TensorFlow Lite",
      category: "ml-fundamentals",
      categoryLabel: "ML & Fundamentals",
      level: 94,
      orbitRadius: 5.4,
      orbitSpeed: 0.3,
      orbitAngle: 4.71,
      yOffset: -1.2,
      geometry: "tetrahedron",
      color: "#ff5e62",
      description:
        "High-performance sequential video frame processing using OpenCV, TensorFlow Lite, and XceptionNet achieving 97.29% ROC-AUC and 94.27% recall on 15K test samples.",
      tags: ["OpenCV", "TensorFlow Lite", "XceptionNet", "Computer Vision", "Edge Inference"],
      connections: ["ml-sklearn-shap-eval", "lang-cpp-java", "lang-python-sql", "web-backend-apis"]
    },

    // --- 3. PROGRAMMING LANGUAGES (Mid Orbit) ---
    {
      id: "lang-python-sql",
      name: "Python & SQL",
      category: "languages",
      categoryLabel: "Programming Languages",
      level: 97,
      orbitRadius: 6.8,
      orbitSpeed: 0.25,
      orbitAngle: 0.6,
      yOffset: 0.8,
      geometry: "octahedron",
      color: "#3b82f6",
      description:
        "Core languages for ML/DL pipelines, Python AST code analysis, FastAPI microservices, NumPy/Pandas data engineering, and complex relational/graph SQL queries.",
      tags: ["Python", "SQL", "Python AST", "NumPy", "Pandas"],
      connections: ["genai-rag-graphrag", "ml-sklearn-shap-eval", "web-backend-apis", "db-postgres-supabase"]
    },
    {
      id: "lang-cpp-java",
      name: "C++ & Java",
      category: "languages",
      categoryLabel: "Programming Languages",
      level: 90,
      orbitRadius: 6.8,
      orbitSpeed: 0.25,
      orbitAngle: 3.7,
      yOffset: -0.9,
      geometry: "box",
      color: "#60a5fa",
      description:
        "Data structures, algorithmic problem solving, object-oriented design, and high-performance systems programming in C++ and Java.",
      tags: ["C++", "Java", "DSA", "OOP"],
      connections: ["ml-opencv-tflite", "lang-python-sql", "tools-git-vscode-postman"]
    },

    // --- 4. WEB TECHNOLOGIES (Outer Orbit) ---
    {
      id: "web-frontend-react-next",
      name: "Next.js 15, React.js & JavaScript",
      category: "web-tech",
      categoryLabel: "Web Technologies",
      level: 95,
      orbitRadius: 8.4,
      orbitSpeed: 0.2,
      orbitAngle: 1.1,
      yOffset: 1.4,
      geometry: "torusKnot",
      color: "#38ef7d",
      description:
        "End-to-end interactive web applications built with Next.js 15, React.js, Vite, and modern JavaScript featuring live risk alerts, 7-day forecast dashboards, and deepfake analysis UIs.",
      tags: ["Next.js", "React.js", "JavaScript", "Vite", "REST APIs"],
      connections: ["web-backend-apis", "devops-vercel-render", "genai-rag-graphrag"]
    },
    {
      id: "web-backend-apis",
      name: "FastAPI, Node.js, Express & Redis",
      category: "web-tech",
      categoryLabel: "Web Technologies",
      level: 96,
      orbitRadius: 8.4,
      orbitSpeed: 0.2,
      orbitAngle: 2.3,
      yOffset: -1.3,
      geometry: "cylinder",
      color: "#10b981",
      description:
        "Scalable microservices separating Node.js / Express.js API layers and Python FastAPI ML engines with JWT cookie-based authentication and low-latency Redis caching.",
      tags: ["FastAPI", "Node.js", "Express.js", "REST APIs", "Redis", "JWT Auth"],
      connections: ["web-frontend-react-next", "db-postgres-supabase", "genai-rag-graphrag", "devops-docker-azure-cicd"]
    },

    // --- 5. DATABASE (Outer Orbit) ---
    {
      id: "db-postgres-supabase",
      name: "PostgreSQL, Supabase & DB Design",
      category: "database",
      categoryLabel: "Database",
      level: 94,
      orbitRadius: 8.4,
      orbitSpeed: 0.2,
      orbitAngle: 3.5,
      yOffset: 1.2,
      geometry: "dodecahedron",
      color: "#f59e0b",
      description:
        "Relational Database Design, Supabase integration, and PostgreSQL graph-relationship storage for code dependency graphs and real-time application state.",
      tags: ["PostgreSQL", "Supabase", "Database Design", "SQL"],
      connections: ["web-backend-apis", "lang-python-sql", "genai-rag-graphrag"]
    },

    // --- 6. DEVOPS & DEPLOYMENT (Outer Orbit) ---
    {
      id: "devops-docker-azure-cicd",
      name: "Docker, Azure & GitHub Actions CI/CD",
      category: "devops",
      categoryLabel: "DevOps & Deployment",
      level: 94,
      orbitRadius: 8.8,
      orbitSpeed: 0.18,
      orbitAngle: 4.7,
      yOffset: -1.1,
      geometry: "octahedron",
      color: "#8b5cf6",
      description:
        "Isolated Docker container execution for automated PR runtime testing, multi-service container orchestration, Azure cloud deployment, and GitHub Actions CI/CD.",
      tags: ["Docker", "Azure", "GitHub Actions", "CI/CD", "Apache Airflow", "MLflow"],
      connections: ["devops-vercel-render", "web-backend-apis", "tools-git-vscode-postman"]
    },
    {
      id: "devops-vercel-render",
      name: "Vercel & Render Cloud Deployment",
      category: "devops",
      categoryLabel: "DevOps & Deployment",
      level: 93,
      orbitRadius: 8.8,
      orbitSpeed: 0.18,
      orbitAngle: 5.5,
      yOffset: 1.5,
      geometry: "icosahedron",
      color: "#a78bfa",
      description:
        "Production cloud hosting for Next.js/Vite frontends on Vercel and FastAPI/Node.js microservices on Render with automated CI/CD triggers.",
      tags: ["Vercel", "Render", "Docker", "CI/CD", "GitHub Actions"],
      connections: ["web-frontend-react-next", "devops-docker-azure-cicd"]
    },

    // --- 7. PLATFORMS & TOOLS (Outer Orbit) ---
    {
      id: "tools-git-vscode-postman",
      name: "Git, GitHub, VS Code & Postman",
      category: "platforms-tools",
      categoryLabel: "Platforms & Tools",
      level: 96,
      orbitRadius: 7.6,
      orbitSpeed: 0.22,
      orbitAngle: 5.9,
      yOffset: -0.4,
      geometry: "box",
      color: "#ec4899",
      description:
        "Version control and PR automation with Git & GitHub, REST API verification with Postman, and AI-assisted development workflows in VS Code.",
      tags: ["Git", "GitHub", "VS Code", "Postman"],
      connections: ["devops-docker-azure-cicd", "web-backend-apis", "lang-cpp-java"]
    }
  ],

  /**
   * Parthib Dey's 3 Featured Projects from Resume
   */
  projects: [
    {
      id: "deepfake-detector",
      title: "Deepfake Detector Web Application",
      category: "Computer Vision & Microservices",
      badge: "97.29% ROC-AUC • 15K Test Set",
      description:
        "High-performance video processing pipeline and scalable microservices-based web application separating the Next.js 15 frontend, Node.js/Express API layer, and Python FastAPI ML engine for real-time deepfake detection.",
      metrics: [
        "97.29% ROC-AUC & 94.27% Recall on 15K held-out test set",
        "89.57% Accuracy & 90.04% F1-Score using XceptionNet + TFLite",
        "Sequential frame reading via OpenCV & JWT cookie-based auth"
      ],
      tech: [
        "Next.js 15",
        "Node.js",
        "Express.js",
        "Python (FastAPI)",
        "OpenCV",
        "TensorFlow Lite",
        "XceptionNet",
        "Scikit-Learn",
        "Supabase",
        "Docker",
        "JWT Auth"
      ],
      skillIds: [
        "ml-opencv-tflite",
        "ml-sklearn-shap-eval",
        "web-frontend-react-next",
        "web-backend-apis",
        "lang-python-sql",
        "db-postgres-supabase",
        "devops-docker-azure-cicd"
      ],
      accentColor: "#ff0844",
      liveUrl: "#projects",
      repoUrl: "https://github.com/Riyan-ai-code",
      architectureSteps: [
        "Next.js 15 client authenticates via JWT Cookie Auth and uploads video stream to Node.js / Express.js API gateway",
        "Python (FastAPI) ML engine executes sequential frame reading and face extraction using OpenCV",
        "Quantized TensorFlow Lite & XceptionNet models run frame-level deepfake inference evaluated with Scikit-Learn",
        "Results and user audit logs persist in Supabase while all services run in isolated Docker containers"
      ]
    },
    {
      id: "impact-iq",
      title: "Impact-IQ: Autonomous Pre-Deployment Intelligence Engine",
      category: "GraphRAG & Autonomous DevOps",
      badge: "GraphRAG + AST + Docker",
      description:
        "Autonomous pre-deployment intelligence engine that automates Pull Request testing inside isolated Docker containers and leverages GraphRAG in PostgreSQL to map code dependency graphs and prevent deployment crashes.",
      metrics: [
        "Automated PR testing in isolated Docker containers to catch runtime crashes",
        "GraphRAG in PostgreSQL maps Python AST code dependency graphs",
        "Minimizes AI hallucination & generates bug-fix prompts/impact maps for Cursor, Claude & VS Code"
      ],
      tech: [
        "Google Gemini API",
        "GraphRAG",
        "Python AST",
        "Prompt Guardrails",
        "PostgreSQL",
        "Redis",
        "Docker",
        "Git / GitHub"
      ],
      skillIds: [
        "genai-rag-graphrag",
        "genai-llms-guardrails",
        "lang-python-sql",
        "db-postgres-supabase",
        "web-backend-apis",
        "devops-docker-azure-cicd",
        "tools-git-vscode-postman"
      ],
      accentColor: "#00f2fe",
      liveUrl: "#projects",
      repoUrl: "https://github.com/Riyan-ai-code",
      architectureSteps: [
        "Python AST parser indexes repository files and stores code relationship graphs in PostgreSQL (GraphRAG)",
        "Isolated Docker sandbox executes Pull Request builds to capture runtime error crashes pre-deployment",
        "GraphRAG queries the dependency graph to jump straight to broken files without scanning the entire codebase",
        "Google Gemini API + Prompt Guardrails generate deterministic bug-fix prompts and impact maps cached in Redis"
      ]
    },
    {
      id: "disaster-radar-ai",
      title: "DisasterRadar.ai: Real-Time Multi-Hazard Prediction & Evacuation Platform",
      category: "MLOps, Predictive Modeling & GenAI (App + Web)",
      badge: "0.978 ROC-AUC • 17K Test Set",
      description:
        "Real-time multi-hazard prediction and AI-driven evacuation platform combining a 25-feature XGBoost + Random Forest ensemble, automated Apache Airflow/MLflow drift recalibration, and a Google Gemini emergency assistant.",
      metrics: [
        "92.3% Accuracy, 89.9% Precision, 92.7% Recall & 0.978 ROC-AUC (17,000-sample test set)",
        "MLOps pipeline with Apache Airflow, MLflow & PSI/KS drift detection for auto-recalibration",
        "7-day future hazard forecasts, live risk alerts & Gemini AI evacuation guidance"
      ],
      tech: [
        "FastAPI",
        "Vite",
        "React.js",
        "XGBoost",
        "Random Forest",
        "Google Gemini API",
        "Test Guardrails",
        "Apache Airflow",
        "MLflow",
        "NumPy",
        "Pandas"
      ],
      skillIds: [
        "ml-sklearn-shap-eval",
        "genai-llms-guardrails",
        "lang-python-sql",
        "web-backend-apis",
        "web-frontend-react-next",
        "devops-docker-azure-cicd"
      ],
      accentColor: "#38ef7d",
      liveUrl: "#projects",
      repoUrl: "https://github.com/Riyan-ai-code",
      architectureSteps: [
        "25-feature XGBoost & Random Forest ensemble predicts multi-hazard risks across 7-day forecast horizons",
        "Apache Airflow & MLflow monitor PSI/KS feature drift and trigger automated ensemble weight recalibration",
        "FastAPI backend serves real-time risk alerts to the Vite/React web & mobile platform",
        "Google Gemini API with Test Guardrails delivers context-aware structured evacuation recommendations"
      ]
    }
  ],

  /**
   * Educational Qualification & Engineering Journey
   */
  experience: [
    {
      period: "2023 — 2027 (Pursuing)",
      role: "Bachelor of Engineering — Artificial Intelligence & Machine Learning",
      company: "CMR Institute of Technology (CMRIT), Bengaluru",
      summary:
        "Specializing in Machine Learning, Generative AI, Computer Vision, GraphRAG, and Full-Stack Web Systems.",
      highlights: [
        "Engineered Deepfake Detector Web App (97.29% ROC-AUC on 15K test set) using OpenCV, TFLite, XceptionNet, Next.js 15 & FastAPI",
        "Built Impact-IQ Autonomous Pre-Deployment Engine using GraphRAG, Python AST, PostgreSQL, Redis, Gemini API & Docker",
        "Developed DisasterRadar.ai Multi-Hazard Platform (0.978 ROC-AUC on 17K test set) with XGBoost, Random Forest, Airflow & MLflow"
      ]
    },
    {
      period: "2022",
      role: "Class 12 — Science (CBSE)",
      company: "Saivikash Senior Secondary School, Guwahati, Assam",
      summary: "Graduated with 76.6% in CBSE Senior Secondary Science stream.",
      highlights: [
        "Strong foundation in Mathematics, Physics, Chemistry, and Computer Science fundamentals"
      ]
    },
    {
      period: "2020",
      role: "10th Grade (CBSE)",
      company: "Mangaldai Maharishi Vidya Mandir, Mangaldai, Assam",
      summary: "Graduated with 80.0% in CBSE Secondary School Examination.",
      highlights: [
        "Academic excellence in science, quantitative reasoning, and analytical problem solving"
      ]
    }
  ]
};
