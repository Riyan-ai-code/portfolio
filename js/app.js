import { PORTFOLIO_DATA } from './data.js';
import { PortfolioScene3D } from './scene.js';

/**
 * ============================================================================
 * APPLICATION CONTROLLER: DARK-MODE BERSUS + 3D LINKED CARDS (js/app.js)
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const { profile, skillCategories, skills, projects, experience } = PORTFOLIO_DATA;

  const canvas = document.getElementById('webgl-canvas');
  const labelsContainer = document.getElementById('labels-container');
  const timelineFill = document.getElementById('player-timeline-fill');

  // Initialize 3D Scene
  const scene3D = new PortfolioScene3D({
    canvas,
    labelsContainer,
    skills,
    onSelectSkill: (skill) => updateSkillInspector(skill),
    onHoverSkill: (skill) => updateHoverHUD(skill),
    onSculptureClick: (which) => showSculptureInspector(which, skills, projects, scene3D),
    onTimelineUpdate: (progress) => {
      if (timelineFill) {
        timelineFill.style.width = `${(progress * 100).toFixed(1)}%`;
      }
    }
  });

  // Populate Hero & Profile Data
  initProfileUI(profile);

  // Render 7-Category Overview Grid (3D Linked Chain)
  renderCategoryOverview(skillCategories, skills, scene3D);

  // Populate Interactive 3D Linked Skills Grid
  renderSkillsGrid(skills, 'all', scene3D);

  // Populate 3D Linked Projects Pipeline
  renderProjects(projects, skills, scene3D);

  // Populate Education Timeline
  renderExperience(experience);

  // Initialize 3D HUD & Bersus Player Bar Controls
  initHUDControls(scene3D, skills);

  // Initialize Interactive AI Command Terminal
  initAITerminal(scene3D, profile, skillCategories, skills, projects);

  // Initialize Contact Form
  initContactForm(profile);

  // Attach 3D Perspective Tilt to static cards
  bind3DTiltCards();

  // Initialize Right-Edge Neon Light Sidebar scroll tracking
  initLightSidebar();
});

function initLightSidebar() {
  const rail = document.getElementById('hud-scroller-rail');
  const shuttle = document.getElementById('hud-scroller-shuttle');
  const readout = document.getElementById('hud-shuttle-readout');

  const sections = [
    { id: 'top', code: 'STG' },
    { id: 'about', code: 'ABT' },
    { id: 'skills', code: 'SKL' },
    { id: 'projects', code: 'PRJ' },
    { id: 'ai-terminal', code: 'TRM' },
    { id: 'experience', code: 'EDU' },
    { id: 'contact', code: 'CNT' }
  ];

  const updateScroller = () => {
    const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const ratio = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    const pct = Math.round(ratio * 100);

    if (shuttle) {
      shuttle.style.top = `${(ratio * 100).toFixed(1)}%`;
    }

    let activeCode = 'STG';
    const scrollMid = window.scrollY + window.innerHeight * 0.38;
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el && el.offsetTop <= scrollMid) {
        activeCode = s.code;
      }
    }

    if (readout) {
      readout.textContent = `${String(pct).padStart(2, '0')}% • ${activeCode}`;
    }
  };

  if (rail) {
    let dragging = false;
    const scrollFromPointer = (clientY) => {
      const rect = rail.getBoundingClientRect();
      const r = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
      window.scrollTo({ top: r * maxScroll, behavior: 'auto' });
    };

    rail.addEventListener('pointerdown', (e) => {
      dragging = true;
      scrollFromPointer(e.clientY);
    });
    window.addEventListener('pointermove', (e) => {
      if (dragging) scrollFromPointer(e.clientY);
    });
    window.addEventListener('pointerup', () => {
      dragging = false;
    });
  }

  window.addEventListener('scroll', updateScroller, { passive: true });
  updateScroller();
}

/**
 * Attach real-time 3D perspective tilt (rotateX, rotateY, translateZ & glare)
 * to all .card-3d-tilt elements
 */
function bind3DTiltCards(root = document) {
  const cards = root.querySelectorAll('.card-3d-tilt');
  cards.forEach((card) => {
    if (card.dataset.tiltBound) return;
    card.dataset.tiltBound = 'true';

    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const rotateY = ((x - cx) / cx) * 9.5;
      const rotateX = -((y - cy) / cy) * 9.5;

      card.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`);
      card.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`);
      card.style.setProperty('--tz', `14px`);
      card.style.setProperty('--mx', `${((x / rect.width) * 100).toFixed(1)}%`);
      card.style.setProperty('--my', `${((y / rect.height) * 100).toFixed(1)}%`);
    });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--tz', '0px');
    });
  });
}

function initProfileUI(profile) {
  const setTxt = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setTxt('hero-name', profile.name);
  setTxt('hero-role', profile.role);
  setTxt('hero-tagline', profile.tagline);
  setTxt('hero-availability', profile.availability);
  setTxt('footer-name', profile.name);

  const heroPill = document.querySelector('.hero-intro-pill');
  if (heroPill) heroPill.classList.add('card-3d-tilt');

  const statsContainer = document.getElementById('hero-stats');
  if (statsContainer && profile.stats) {
    statsContainer.innerHTML = profile.stats
      .map(
        (s, i) => `
        <div class="stat-card card-3d-tilt">
          <div class="chain-node-ribbon">
            <span>METRIC 0${i + 1}</span>
            <span class="chain-arrow-pulse"></span>
          </div>
          <div class="stat-value">${s.value}</div>
          <div class="stat-label">${s.label}</div>
        </div>
      `
      )
      .join('');
  }
}

/**
 * Render the 7 Distinct Skill Categories as a 3D Linked Chain
 */
function renderCategoryOverview(skillCategories, skills, scene3D) {
  const container = document.getElementById('category-overview-grid');
  if (!container || !skillCategories) return;

  container.innerHTML = skillCategories
    .map((cat, idx) => {
      const currNum = String(idx + 1).padStart(2, '0');
      const nextNum = String(((idx + 1) % skillCategories.length) + 1).padStart(2, '0');
      return `
      <div class="category-summary-card card-3d-tilt" data-summary-category="${cat.id}" style="--cat-color:${cat.color}">
        <div class="chain-node-ribbon">
          <span>DOMAIN ${currNum}</span>
          <span class="chain-arrow-pulse"></span>
          <span>${nextNum}</span>
        </div>
        <div class="cat-summary-header">
          <div class="cat-summary-title">
            <span>${cat.icon}</span>
            <span>${cat.title}</span>
          </div>
          <span class="cat-summary-count">${cat.items.length} skills</span>
        </div>
        <div class="cat-summary-items">
          ${cat.items.map((item) => `<span class="cat-skill-pill">${item}</span>`).join('')}
        </div>
      </div>
    `;
    })
    .join('');

  bind3DTiltCards(container);

  container.querySelectorAll('.category-summary-card').forEach((card) => {
    card.addEventListener('click', () => {
      const catId = card.dataset.summaryCategory;
      const isAlreadyActive = card.classList.contains('active');
      const nextCat = isAlreadyActive ? 'all' : catId;
      applyCategoryFilterUI(nextCat, skills, scene3D);
    });
  });
}

function applyCategoryFilterUI(cat, skills, scene3D) {
  document.querySelectorAll('[data-filter-category]').forEach((b) =>
    b.classList.toggle('active', b.dataset.filterCategory === cat)
  );
  document.querySelectorAll('.category-summary-card').forEach((c) =>
    c.classList.toggle('active', c.dataset.summaryCategory === cat)
  );
  scene3D.setCategoryFilter(cat);
  renderSkillsGrid(skills, cat, scene3D);
}

function updateHoverHUD(skill) {
  const backdropEl = document.getElementById('backdrop-word');
  const statusEl = document.getElementById('stage-live-status');
  if (skill) {
    if (backdropEl) backdropEl.textContent = skill.categoryLabel.split(' ')[0].toUpperCase();
    if (statusEl) {
      statusEl.innerHTML = `<span class="pulse-dot"></span><span><strong>${skill.name}</strong> (${skill.categoryLabel} — ${skill.level}%) • Click to lock 3D camera</span>`;
    }
  } else {
    if (backdropEl) backdropEl.textContent = 'PARTHIB';
    if (statusEl) {
      statusEl.innerHTML = `<span class="pulse-dot"></span><span><strong>Interactive 3D Stage:</strong> Drag Knight/Statue to spin • Click any #01–#12 node • Scroll to zoom</span>`;
    }
  }
}

function showSculptureInspector(which, skills, projects, scene3D) {
  const inspector = document.getElementById('skill-inspector');
  if (!inspector) return;

  inspector.classList.add('is-open');

  if (which === 'knight') {
    document.getElementById('inspector-category').textContent = 'AI, ML & Languages Core';
    document.getElementById('inspector-title').textContent = '⚔️ Cyber-Obsidian AI Knight';
    document.getElementById('inspector-level-text').textContent = 'Nodes #01–#06';
    document.getElementById('inspector-bar-fill').style.width = '96%';
    document.getElementById('inspector-desc').textContent =
      'Represents Parthib Dey’s Generative AI (LLMs, RAG, GraphRAG, Guardrails), ML & Fundamentals (OpenCV, TFLite, SHAP, Scikit-Learn), and Programming Languages (Python, C++, Java, SQL). Drag the Knight to spin it or click a node below:';
    document.getElementById('inspector-tags').innerHTML =
      ['GraphRAG', 'LLMs', 'Guardrails', 'OpenCV', 'TFLite', 'SHAP', 'Python', 'C++']
        .map((t) => `<span class="tech-pill">${t}</span>`)
        .join('');

    const aiNodes = skills.slice(0, 6);
    const connEl = document.getElementById('inspector-connections');
    connEl.innerHTML = aiNodes
      .map(
        (s, i) => `<button class="connected-node-btn" data-target-skill="${s.id}">#0${i + 1} ${s.name}</button>`
      )
      .join('');
    connEl.querySelectorAll('.connected-node-btn').forEach((btn) => {
      btn.addEventListener('click', () => scene3D.selectSkill(btn.dataset.targetSkill));
    });
  } else {
    document.getElementById('inspector-category').textContent = 'Full-Stack, DB & Cloud Core';
    document.getElementById('inspector-title').textContent = '⚡ Cyber-Chrome Architect Statue';
    document.getElementById('inspector-level-text').textContent = 'Nodes #07–#12';
    document.getElementById('inspector-bar-fill').style.width = '95%';
    document.getElementById('inspector-desc').textContent =
      'Represents Parthib Dey’s Full-Stack Web Engineering (Next.js 15, React.js, FastAPI, Node.js, Express, Redis), Database (PostgreSQL, Supabase), and DevOps (Docker, Azure, Vercel, Render, CI/CD). Drag the Statue to spin it or click a node below:';
    document.getElementById('inspector-tags').innerHTML =
      ['Next.js 15', 'FastAPI', 'Node.js', 'Redis', 'PostgreSQL', 'Supabase', 'Docker', 'Azure']
        .map((t) => `<span class="tech-pill">${t}</span>`)
        .join('');

    const webNodes = skills.slice(6, 12);
    const connEl = document.getElementById('inspector-connections');
    connEl.innerHTML = webNodes
      .map(
        (s, i) => `<button class="connected-node-btn" data-target-skill="${s.id}">#${String(i + 7).padStart(2, '0')} ${s.name}</button>`
      )
      .join('');
    connEl.querySelectorAll('.connected-node-btn').forEach((btn) => {
      btn.addEventListener('click', () => scene3D.selectSkill(btn.dataset.targetSkill));
    });
  }
}

function updateSkillInspector(skill) {
  const inspector = document.getElementById('skill-inspector');
  if (!inspector) return;

  if (!skill) {
    inspector.classList.remove('is-open');
    document.querySelectorAll('.skill-card').forEach((c) => c.classList.remove('is-selected'));
    return;
  }

  inspector.classList.add('is-open');
  inspector.style.setProperty('--inspector-accent', skill.color);

  document.getElementById('inspector-category').textContent = skill.categoryLabel;
  document.getElementById('inspector-title').textContent = skill.name;
  document.getElementById('inspector-level-text').textContent = `${skill.level}%`;
  document.getElementById('inspector-bar-fill').style.width = `${skill.level}%`;
  document.getElementById('inspector-desc').textContent = skill.description;

  const tagsEl = document.getElementById('inspector-tags');
  tagsEl.innerHTML = skill.tags.map((t) => `<span class="tech-pill">${t}</span>`).join('');

  // Render connected neural nodes + Next Sequential Node in 3D Chain
  const connEl = document.getElementById('inspector-connections');
  const connectedSkills = (skill.connections || [])
    .map((id) => PORTFOLIO_DATA.skills.find((s) => s.id === id))
    .filter(Boolean);

  connEl.innerHTML = connectedSkills
    .map(
      (cs) => `
      <button class="connected-node-btn" data-target-skill="${cs.id}">
        <span>→ ${cs.name}</span>
      </button>
    `
    )
    .join('');

  connEl.querySelectorAll('.connected-node-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.targetSkill;
      window.__portfolioScene3D?.selectSkill(targetId);
    });
  });

  document.querySelectorAll('.skill-card').forEach((c) => {
    c.classList.toggle('is-selected', c.dataset.skillId === skill.id);
  });
}

function initHUDControls(scene3D, skills) {
  window.__portfolioScene3D = scene3D;

  const closeBtn = document.getElementById('inspector-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => scene3D.selectSkill(null));
  }

  const filterBtns = document.querySelectorAll('[data-filter-category]');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.filterCategory;
      applyCategoryFilterUI(cat, skills, scene3D);
    });
  });

  document.querySelectorAll('[data-camera-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const preset = btn.dataset.cameraPreset;
      document.querySelectorAll('[data-camera-preset]').forEach((b) =>
        b.classList.toggle('active', b === btn)
      );
      scene3D.setCameraPreset(preset);
    });
  });

  // Bersus Bottom Player Bar: Play / Pause Toggle
  const playToggleBtn = document.getElementById('btn-player-toggle');
  const iconPause = document.getElementById('icon-pause');
  const iconPlay = document.getElementById('icon-play');
  if (playToggleBtn) {
    playToggleBtn.addEventListener('click', () => {
      const playing = scene3D.togglePlayPause();
      if (iconPause) iconPause.style.display = playing ? 'block' : 'none';
      if (iconPlay) iconPlay.style.display = playing ? 'none' : 'block';
    });
  }

  // Bersus Bottom Player Bar: Interactive Timeline Scrubber
  const timelineTrack = document.getElementById('player-timeline-track');
  if (timelineTrack) {
    let isScrubbing = false;
    const scrubTo = (clientX) => {
      const rect = timelineTrack.getBoundingClientRect();
      const ratio = (clientX - rect.left) / rect.width;
      scene3D.setTimelineProgress(ratio);
    };
    timelineTrack.addEventListener('pointerdown', (e) => {
      isScrubbing = true;
      scrubTo(e.clientX);
    });
    window.addEventListener('pointermove', (e) => {
      if (isScrubbing) scrubTo(e.clientX);
    });
    window.addEventListener('pointerup', () => {
      isScrubbing = false;
    });
  }

  const pulseBtn = document.getElementById('btn-neural-pulse');
  if (pulseBtn) {
    pulseBtn.addEventListener('click', () => {
      scene3D.triggerNeuralPulse();
    });
  }

  // Interactive 3D Chain Stepper Buttons (Prev / Next / Auto-Tour)
  const prevBtns = [
    document.getElementById('btn-chain-prev'),
    document.getElementById('btn-inspector-prev')
  ];
  prevBtns.forEach((b) => {
    if (b) b.addEventListener('click', () => scene3D.stepSkillChain(-1));
  });

  const nextBtns = [
    document.getElementById('btn-chain-next'),
    document.getElementById('btn-inspector-next')
  ];
  nextBtns.forEach((b) => {
    if (b) b.addEventListener('click', () => scene3D.stepSkillChain(1));
  });

  const autoTourBtn = document.getElementById('btn-auto-tour');
  if (autoTourBtn) {
    autoTourBtn.addEventListener('click', () => {
      const active = scene3D.toggleAutoTour();
      autoTourBtn.textContent = active ? '⏸ Stop Auto-Tour' : '▶ Auto-Tour 12 Nodes';
      autoTourBtn.classList.toggle('active', active);
    });
  }

  // Stage Quick Project Launchers (Illuminate Project in 3D + Open Inspector)
  document.querySelectorAll('[data-stage-project]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const projId = btn.dataset.stageProject;
      const proj = PORTFOLIO_DATA.projects.find((p) => p.id === projId);
      if (!proj) return;

      scene3D.highlightProjectSkills(proj.skillIds);

      const inspector = document.getElementById('skill-inspector');
      if (inspector) {
        inspector.classList.add('is-open');
        document.getElementById('inspector-category').textContent = proj.badge;
        document.getElementById('inspector-title').textContent = proj.title;
        document.getElementById('inspector-level-text').textContent = `${proj.skillIds.length} Linked Nodes`;
        document.getElementById('inspector-bar-fill').style.width = '98%';
        document.getElementById('inspector-desc').textContent =
          `${proj.description} • Metrics: ${proj.metrics.join(' | ')}`;
        document.getElementById('inspector-tags').innerHTML = proj.tech
          .map((t) => `<span class="tech-pill">${t}</span>`)
          .join('');

        const connEl = document.getElementById('inspector-connections');
        const linkedSkills = proj.skillIds
          .map((id) => skills.find((s) => s.id === id))
          .filter(Boolean);
        connEl.innerHTML = linkedSkills
          .map(
            (cs) =>
              `<button class="connected-node-btn" data-target-skill="${cs.id}">→ ${cs.name}</button>`
          )
          .join('');
        connEl.querySelectorAll('.connected-node-btn').forEach((nb) => {
          nb.addEventListener('click', () => scene3D.selectSkill(nb.dataset.targetSkill));
        });
      }
    });
  });

  const ZenBtn = document.getElementById('btn-zen-mode');
  if (ZenBtn) {
    ZenBtn.addEventListener('click', () => {
      document.body.classList.toggle('zen-3d-mode');
      const isZen = document.body.classList.contains('zen-3d-mode');
      ZenBtn.innerHTML = isZen ? 'Exit Pure 3D' : 'Pure 3D View';
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      scene3D.selectSkill(null);
    }
  });
}

/**
 * Render 3D Sequential Linked Skills Grid (Node 01 ───► Node 02 ───► Node 03)
 */
function renderSkillsGrid(skills, filterCat, scene3D) {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;

  const filtered =
    filterCat === 'all' ? skills : skills.filter((s) => s.category === filterCat);

  grid.innerHTML = filtered
    .map((skill, idx) => {
      const currSeq = String(idx + 1).padStart(2, '0');
      const nextIdx = (idx + 1) % filtered.length;
      const nextSkill = filtered[nextIdx];
      const nextSeq = String(nextIdx + 1).padStart(2, '0');

      return `
      <article class="skill-card card-3d-tilt" id="card-${skill.id}" data-skill-id="${skill.id}" style="--card-accent:${skill.color}">
        <div class="chain-node-ribbon">
          <span>3D NODE ${currSeq}</span>
          <span class="chain-arrow-pulse"></span>
          <span>LINKED TO ${nextSeq}</span>
        </div>
        <div class="skill-card-header">
          <span class="skill-cat-badge">${skill.categoryLabel}</span>
          <span class="skill-lvl-badge">${skill.level}%</span>
        </div>
        <h3 class="skill-card-title">${skill.name}</h3>
        <p class="skill-card-desc">${skill.description}</p>
        <div class="skill-progress-track">
          <div class="skill-progress-fill" style="width:${skill.level}%;background:${skill.color}"></div>
        </div>
        <div class="skill-tags">
          ${skill.tags.map((t) => `<span class="tech-pill">${t}</span>`).join('')}
        </div>
        <div class="skill-card-footer">
          <button class="skill-locate-btn" data-focus-3d="${skill.id}" type="button">
            <span>Inspect in 3D</span>
            <span aria-hidden="true">↗</span>
          </button>
          <button class="skill-next-chain-btn" data-next-skill="${nextSkill.id}" type="button" title="Hop to next linked 3D card (${nextSkill.name})">
            Next #${nextSeq} →
          </button>
        </div>
      </article>
    `;
    })
    .join('');

  bind3DTiltCards(grid);

  grid.querySelectorAll('[data-focus-3d]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const skillId = btn.dataset.focus3d;
      scene3D.selectSkill(skillId);
    });
  });

  grid.querySelectorAll('[data-next-skill]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const nextId = btn.dataset.nextSkill;
      scene3D.selectSkill(nextId);
      const nextCard = document.getElementById(`card-${nextId}`);
      if (nextCard) {
        nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  grid.querySelectorAll('.skill-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      scene3D.setHoveredSkill(card.dataset.skillId);
    });
    card.addEventListener('mouseleave', () => {
      scene3D.setHoveredSkill(null);
    });
    card.addEventListener('click', () => {
      scene3D.selectSkill(card.dataset.skillId);
    });
  });
}

/**
 * Render 3D Linked Projects Pipeline (Project 01 ───► Project 02 ───► Project 03)
 */
function renderProjects(projects, skills, scene3D) {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  container.innerHTML = projects
    .map((proj, idx) => {
      const currSeq = String(idx + 1).padStart(2, '0');
      const nextIdx = (idx + 1) % projects.length;
      const nextProj = projects[nextIdx];
      const nextSeq = String(nextIdx + 1).padStart(2, '0');

      return `
      <article class="project-card card-3d-tilt" id="proj-card-${proj.id}" data-project-id="${proj.id}" style="--proj-accent:${proj.accentColor}">
        <div class="project-card-top">
          <div class="chain-node-ribbon">
            <span>SYSTEM PIPELINE ${currSeq}</span>
            <span class="chain-arrow-pulse"></span>
            <span>CHAINED TO ${nextSeq} (${nextProj.title.split(':')[0]})</span>
          </div>
          <div class="project-meta">
            <span class="project-badge">${proj.badge}</span>
            <span class="project-category">${proj.category}</span>
          </div>
          <h3 class="project-title">${proj.title}</h3>
          <p class="project-desc">${proj.description}</p>

          <div class="project-metrics">
            ${proj.metrics
              .map((m) => `<div class="metric-item"><span class="metric-check">⚡</span> ${m}</div>`)
              .join('')}
          </div>

          <div class="project-architecture">
            <div class="arch-heading">3D Linked System Architecture Flow</div>
            <ol class="arch-steps">
              ${proj.architectureSteps.map((step) => `<li>${step}</li>`).join('')}
            </ol>
          </div>
        </div>

        <div class="project-card-bottom">
          <div class="project-tech-stack">
            ${proj.tech.map((t) => `<span class="tech-pill">${t}</span>`).join('')}
          </div>

          <div class="project-actions">
            <button class="btn-3d-highlight" data-highlight-project="${proj.id}" type="button">
              <span>🌐 Illuminate 3D Node Chain</span>
            </button>
            <a href="${proj.repoUrl}" target="_blank" rel="noopener" class="btn-outline-sm">GitHub (Riyan-ai-code) ↗</a>
            <button class="btn-outline-sm" data-next-proj="${nextProj.id}" type="button">
              Next System (#${nextSeq}) ↓
            </button>
          </div>
        </div>
      </article>
    `;
    })
    .join('');

  bind3DTiltCards(container);

  container.querySelectorAll('[data-highlight-project]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const projId = btn.dataset.highlightProject;
      const proj = projects.find((p) => p.id === projId);
      if (!proj) return;
      scene3D.highlightProjectSkills(proj.skillIds);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  container.querySelectorAll('[data-next-proj]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextId = btn.dataset.nextProj;
      const nextProj = projects.find((p) => p.id === nextId);
      if (nextProj) {
        scene3D.highlightProjectSkills(nextProj.skillIds);
      }
      const nextEl = document.getElementById(`proj-card-${nextId}`);
      if (nextEl) {
        nextEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
}

function renderExperience(experience) {
  const timeline = document.getElementById('experience-timeline');
  if (!timeline) return;

  timeline.innerHTML = experience
    .map(
      (exp, idx) => `
      <div class="timeline-item card-3d-tilt">
        <div class="timeline-marker"></div>
        <div class="chain-node-ribbon">
          <span>ACADEMIC STAGE 0${idx + 1}</span>
          <span class="chain-arrow-pulse"></span>
        </div>
        <div class="timeline-content">
          <span class="timeline-period">${exp.period}</span>
          <h3 class="timeline-role">${exp.role} <span class="timeline-company">@ ${exp.company}</span></h3>
          <p class="timeline-summary">${exp.summary}</p>
          <ul class="timeline-highlights">
            ${exp.highlights.map((h) => `<li>${h}</li>`).join('')}
          </ul>
        </div>
      </div>
    `
    )
    .join('');

  bind3DTiltCards(timeline);
}

function initAITerminal(scene3D, profile, skillCategories, skills, projects) {
  const output = document.getElementById('terminal-output');
  const input = document.getElementById('terminal-input');
  const form = document.getElementById('terminal-form');
  const quickBtns = document.querySelectorAll('[data-terminal-cmd]');

  if (!output || !input || !form) return;

  const appendLog = (html, type = 'agent') => {
    const line = document.createElement('div');
    line.className = `term-line term-${type}`;
    line.innerHTML = html;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  };

  const runCommand = (rawCmd) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    appendLog(`<span class="term-prompt">parthib@portfolio:~$</span> ${escapeHTML(cmd)}`, 'user');
    const lower = cmd.toLowerCase();

    if (lower === 'help') {
      appendLog(`
        <strong>Parthib Dey's AI Terminal Commands:</strong><br/>
        • <code>project --deepfake</code> : Deepfake Detector Web App (97.29% ROC-AUC, OpenCV, TFLite, Next.js 15, FastAPI)<br/>
        • <code>project --impact-iq</code> : Impact-IQ Pre-Deployment Engine (GraphRAG, Python AST, Gemini API, Docker)<br/>
        • <code>project --disaster-radar</code> : DisasterRadar.ai (0.978 ROC-AUC, XGBoost/RF, Airflow, MLflow, Gemini)<br/>
        • <code>skills --lang</code> | <code>--genai</code> | <code>--ml</code> | <code>--web</code> | <code>--db</code> | <code>--devops</code> | <code>--tools</code><br/>
        • <code>education</code> : View B.E. AI & ML (CMRIT Bengaluru) & academic credentials<br/>
        • <code>contact</code> : View Parthib's emails, phone & Bengaluru address<br/>
        • <code>clear</code> : Clear terminal output
      `);
    } else if (lower === 'clear') {
      output.innerHTML = '';
    } else if (lower.includes('deepfake')) {
      const p = projects.find((x) => x.id === 'deepfake-detector');
      if (p) scene3D.highlightProjectSkills(p.skillIds);
      appendLog(
        `🎬 <strong>Deepfake Detector Web Application [3D Chain Illuminated]:</strong><br/>
        • <strong>Pipeline:</strong> High-performance sequential frame reading with <code>OpenCV</code> & <code>TensorFlow Lite</code> (XceptionNet)<br/>
        • <strong>Architecture:</strong> Microservices separating <code>Next.js 15</code> frontend, <code>Node.js / Express.js</code> API layer & <code>Python FastAPI</code> ML engine with JWT Cookie Auth & <code>Supabase</code><br/>
        • <strong>Metrics (15K Test Set):</strong> <code>89.57% Accuracy</code> | <code>90.04% F1</code> | <code>94.27% Recall</code> | <code>97.29% ROC-AUC</code>`
      );
    } else if (lower.includes('impact-iq') || lower.includes('impact') || lower.includes('graphrag')) {
      const p = projects.find((x) => x.id === 'impact-iq');
      if (p) scene3D.highlightProjectSkills(p.skillIds);
      appendLog(
        `🧠 <strong>Impact-IQ: Autonomous Pre-Deployment Intelligence Engine [3D Chain Illuminated]:</strong><br/>
        • <strong>Sandbox Testing:</strong> Automated PR testing in isolated <code>Docker</code> containers to catch runtime crashes<br/>
        • <strong>GraphRAG Engine:</strong> Stores <code>Python AST</code> code relationships in <code>PostgreSQL</code> & <code>Redis</code> to jump straight to broken files<br/>
        • <strong>Agent Integration:</strong> Uses <code>Google Gemini API</code> + <code>Prompt Guardrails</code> to generate zero-hallucination bug-fix prompts & impact maps for Cursor, Claude & VS Code`
      );
    } else if (lower.includes('disaster') || lower.includes('radar')) {
      const p = projects.find((x) => x.id === 'disaster-radar-ai');
      if (p) scene3D.highlightProjectSkills(p.skillIds);
      appendLog(
        `🌪️ <strong>DisasterRadar.ai: Real-Time Multi-Hazard Prediction & Evacuation Platform [3D Chain Illuminated]:</strong><br/>
        • <strong>Ensemble ML (17K Test Set):</strong> 25-feature <code>XGBoost</code> & <code>Random Forest</code> achieving <code>92.3% Accuracy</code>, <code>89.9% Precision</code>, <code>92.7% Recall</code> & <code>0.978 ROC-AUC</code><br/>
        • <strong>MLOps Pipeline:</strong> <code>Apache Airflow</code>, <code>MLflow</code> & PSI/KS drift detection for automated weight recalibration<br/>
        • <strong>AI Assistant:</strong> <code>Google Gemini API</code> + <code>Test Guardrails</code> + <code>FastAPI</code> + <code>Vite</code> for 7-day forecasts & live evacuation guidance`
      );
    } else if (lower.includes('education') || lower.includes('cmrit')) {
      appendLog(
        `🎓 <strong>Educational Qualification — Parthib Dey:</strong><br/>
        • <strong>B.E. in AI & Machine Learning:</strong> CMR Institute of Technology, Bengaluru (2027 Pursuing)<br/>
        • <strong>Class 12 (Science, CBSE):</strong> Saivikash Senior Secondary School, Guwahati, Assam | <code>76.6%</code> (2022)<br/>
        • <strong>10th Grade (CBSE):</strong> Mangaldai Maharishi Vidya Mandir, Mangaldai, Assam | <code>80.0%</code> (2020)`
      );
    } else if (lower.includes('contact') || lower.includes('email') || lower.includes('phone')) {
      appendLog(
        `📬 <strong>Contact Parthib Dey:</strong><br/>
        • <strong>Emails:</strong> <code>Parthib100320@gmail.com</code> | <code>prde23aiml@cmrit.ac.in</code><br/>
        • <strong>Mobile:</strong> <code>+91 7099647523</code><br/>
        • <strong>GitHub:</strong> <code>https://github.com/Riyan-ai-code</code><br/>
        • <strong>Address:</strong> Mr & Ms Coliving, AECS Layout, Bengaluru – 560037`
      );
    } else if (lower.includes('--lang')) {
      applyCategoryFilterUI('languages', skills, scene3D);
      appendLog(`💻 <strong>Programming Languages Isolated in 3D Chain:</strong> C++, SQL, Java, Python.`);
    } else if (lower.includes('--genai')) {
      applyCategoryFilterUI('gen-ai', skills, scene3D);
      appendLog(`🧠 <strong>Generative AI Isolated in 3D Chain:</strong> LLMs, RAG, GraphRAG, Guardrails.`);
    } else if (lower.includes('--ml')) {
      applyCategoryFilterUI('ml-fundamentals', skills, scene3D);
      appendLog(`📊 <strong>ML & Fundamentals Isolated in 3D Chain:</strong> OpenCV, TensorFlow Lite, ML Evaluation, SHAP, Scikit-Learn.`);
    } else if (lower.includes('--web')) {
      applyCategoryFilterUI('web-tech', skills, scene3D);
      appendLog(`🌐 <strong>Web Technologies Isolated in 3D Chain:</strong> JavaScript, React.js, Express.js, Node.js, FastAPI, Next.js, REST APIs, Redis.`);
    } else if (lower.includes('--db')) {
      applyCategoryFilterUI('database', skills, scene3D);
      appendLog(`🗄️ <strong>Database Isolated in 3D Chain:</strong> PostgreSQL, Supabase, Database Design.`);
    } else if (lower.includes('--devops')) {
      applyCategoryFilterUI('devops', skills, scene3D);
      appendLog(`🐳 <strong>DevOps & Deployment Isolated in 3D Chain:</strong> Docker, Azure, Vercel, Render, GitHub Actions, CI/CD.`);
    } else if (lower.includes('--tools')) {
      applyCategoryFilterUI('platforms-tools', skills, scene3D);
      appendLog(`🛠️ <strong>Platforms & Tools Isolated in 3D Chain:</strong> Git, GitHub, VS Code, Postman.`);
    } else {
      const matched = skills.find(
        (s) =>
          lower.includes(s.name.toLowerCase()) ||
          s.tags.some((t) => lower.includes(t.toLowerCase()))
      );
      if (matched) {
        scene3D.selectSkill(matched.id);
        appendLog(
          `🎯 <strong>Matched 3D Skill Node [${matched.name} — ${matched.categoryLabel}]:</strong><br/>
          ${matched.description}<br/>
          <em>Skills in Node:</em> ${matched.tags.join(' • ')}`
        );
      } else {
        const allCats = skillCategories.map((c) => `${c.icon} ${c.title}`).join(' | ');
        appendLog(
          `🤖 <strong>Parthib's AI Portfolio Agent:</strong> Full 7-category 3D chain active:<br/>${allCats}.<br/>Try running <code>project --deepfake</code>, <code>project --impact-iq</code>, or <code>project --disaster-radar</code>!`
        );
      }
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value;
    input.value = '';
    runCommand(val);
  });

  quickBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      runCommand(btn.dataset.terminalCmd);
    });
  });
}

function initContactForm(profile) {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-status');
  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name')?.value || 'Friend';
    status.textContent = `✓ Message transmitted, ${name}! Ready to connect with Parthib at ${profile.email}.`;
    status.classList.add('visible');
    form.reset();
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
}
