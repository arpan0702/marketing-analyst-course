// ---------- Course config ----------
const MODULES = [
  { id: 'm0', file: 'module-0.html', title: 'The Transition Mindset', short: 'M0 Mindset' },
  { id: 'm1', file: 'module-1.html', title: 'Excel & Google Sheets', short: 'M1 Sheets' },
  { id: 'm2', file: 'module-2.html', title: 'SQL for Marketing', short: 'M2 SQL' },
  { id: 'm3', file: 'module-3.html', title: 'Data Viz & Storytelling', short: 'M3 Dataviz' },
  { id: 'm4', file: 'module-4.html', title: 'GA4, GTM & UTMs', short: 'M4 GA4/GTM' },
  { id: 'm5', file: 'module-5.html', title: 'Metrics & A/B Testing', short: 'M5 Metrics' },
];

const moduleBlurbs = {
  m0: 'Reframe marketing judgment as analytical skill before touching a tool.',
  m1: 'Pivot tables, XLOOKUP, dynamic charts — the bridge into SQL logic.',
  m2: 'SELECT, JOIN, GROUP BY, window functions — run real queries in your browser.',
  m3: 'Chart selection and dashboard UX that turns numbers into a decision.',
  m4: 'GA4 events, GTM tags, and a UTM architecture that survives a real launch.',
  m5: 'CAC, LTV, ROAS, and whether your A/B test result actually means anything.',
};

// Roadmap milestones — single source of truth for roadmap.html + the home progress ring.
const ROADMAP_MILESTONES = [
  { id: 'r1', week: 'Weeks 1–3', title: 'Finish Module 0 + Module 1 (foundations)' },
  { id: 'r2', week: 'Weeks 4–7', title: 'Finish Module 2 — SQL fluency (daily practice)' },
  { id: 'r3', week: 'Weeks 8–9', title: 'Ship Portfolio Project 1 — Customer Segmentation' },
  { id: 'r4', week: 'Weeks 10–11', title: 'Finish Module 3 + ship Portfolio Project 2 — A/B Test & CRO' },
  { id: 'r5', week: 'Week 12', title: 'Finish Module 4 + rewrite resume & LinkedIn' },
  { id: 'r6', week: 'Week 12', title: 'Start applying (target titles + first 10 applications)' },
  { id: 'r7', week: 'Weeks 13–14', title: 'Finish Module 5 + ship Portfolio Project 3 — ROI Dashboard' },
  { id: 'r8', week: 'Weeks 15–16', title: 'Mock interviews + outreach ramp-up, applications ongoing' },
];

// Resume/application readiness checklist — shared source of truth for resume.html + the home ring.
const RESUME_CHECKLIST = [
  { id: 'c1', title: 'All 6 modules marked complete' },
  { id: 'c2', title: 'Portfolio Project 1 (Segmentation) published with a written narrative' },
  { id: 'c3', title: 'Portfolio Project 2 (A/B Test) published with a written narrative' },
  { id: 'c4', title: 'Portfolio Project 3 (ROI Dashboard) published — this is the one you lead with' },
  { id: 'c5', title: 'Resume rewritten using the analyst bullet formula, keyword pass done' },
  { id: 'c6', title: 'LinkedIn headline + skills section updated, "Open to Work" set to recruiters only' },
];

// Projects checklist — 6 mini-projects (one per module) + 3 capstone portfolio projects. Shared with projects.html + the home ring.
const PROJECTS_CHECKLIST = [
  { id: 'p0', title: 'Mini-project 0 — Reframe 3 real resume bullets with the analyst formula' },
  { id: 'p1', title: 'Mini-project 1 — Build a weekly channel report (pivot + XLOOKUP + chart)' },
  { id: 'p2', title: 'Mini-project 2 — SQL audit: answer 8 business questions against the live database' },
  { id: 'p3', title: 'Mini-project 3 — Rebuild one bad dashboard with a proper 3-view hierarchy' },
  { id: 'p4', title: 'Mini-project 4 — UTM governance doc + one GA4 demo funnel finding' },
  { id: 'p5', title: 'Mini-project 5 — A/B test read-out memo with a ship/no-ship call' },
  { id: 'cap1', title: 'Capstone — Portfolio Project 1: Customer Segmentation (RFM)' },
  { id: 'cap2', title: 'Capstone — Portfolio Project 2: A/B Test & CRO' },
  { id: 'cap3', title: 'Capstone — Portfolio Project 3: Marketing ROI Dashboard' },
];

// ---------- Generic checklist store (localStorage) ----------
function getChecklist(key) {
  try { return JSON.parse(localStorage.getItem(key)) || {}; } catch (e) { return {}; }
}
function setChecklistItem(key, id, done) {
  const c = getChecklist(key);
  c[id] = !!done;
  localStorage.setItem(key, JSON.stringify(c));
  renderTopbarNav();
}
function isChecked(key, id) { return !!getChecklist(key)[id]; }

const MODULE_KEY = 'ma-course-progress-v1';
const ROADMAP_KEY = 'ma-roadmap-progress-v1';
const RESUME_KEY = 'ma-resume-progress-v1';
const PROJECTS_KEY = 'ma-projects-progress-v1';

function getProgress() { return getChecklist(MODULE_KEY); }
function setModuleComplete(id, done) { setChecklistItem(MODULE_KEY, id, done); }
function isModuleComplete(id) { return isChecked(MODULE_KEY, id); }

// ---------- Overall progress (drives the home page ring) ----------
function getOverallProgress() {
  const total = MODULES.length + ROADMAP_MILESTONES.length + RESUME_CHECKLIST.length + PROJECTS_CHECKLIST.length;
  const done =
    MODULES.filter(m => isModuleComplete(m.id)).length +
    ROADMAP_MILESTONES.filter(r => isChecked(ROADMAP_KEY, r.id)).length +
    RESUME_CHECKLIST.filter(c => isChecked(RESUME_KEY, c.id)).length +
    PROJECTS_CHECKLIST.filter(p => isChecked(PROJECTS_KEY, p.id)).length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

// ---------- Topbar (shared chrome) ----------
function renderTopbar(currentId) {
  const mount = document.getElementById('topbar-mount');
  if (!mount) return;
  const moduleLinks = MODULES.map(m => {
    const cls = ['', m.id === currentId ? 'current' : '', isModuleComplete(m.id) ? 'done' : '']
      .filter(Boolean).join(' ');
    return `<a href="${m.file}" class="${cls.trim()}">${m.short}</a>`;
  }).join('');
  mount.innerHTML = `
    <a class="topbar-brand" href="index.html">
      <span class="mark">MA COURSE</span>
      <span class="name">Interview-Ready Marketing Analyst</span>
    </a>
    <nav class="topbar-nav">
      <a href="index.html" class="${currentId ? '' : 'current'}">Home</a>
      <a href="roadmap.html" class="${currentId === 'roadmap' ? 'current' : ''}">Roadmap</a>
      ${moduleLinks}
      <a href="projects.html" class="${currentId === 'projects' ? 'current' : ''}">Projects</a>
      <a href="interview-bank.html" class="${currentId === 'interview-bank' ? 'current' : ''}">Interview Bank</a>
      <a href="resume.html" class="${currentId === 'resume' ? 'current' : ''}">Resume &amp; Apply</a>
    </nav>`;
}
function renderTopbarNav() {
  const mount = document.getElementById('topbar-mount');
  if (mount && mount.dataset.current !== undefined) {
    renderTopbar(mount.dataset.current || null);
    renderDashboard();
  }
}

// ---------- SVG progress ring ----------
function renderProgressRing(svgId, pct) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  const r = 54, c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  svg.innerHTML = `
    <circle cx="60" cy="60" r="${r}" fill="none" stroke="var(--line)" stroke-width="10"/>
    <circle cx="60" cy="60" r="${r}" fill="none" stroke="var(--teal)" stroke-width="10"
      stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${offset}"
      transform="rotate(-90 60 60)" style="transition:stroke-dashoffset .5s ease;"/>
    <text x="60" y="56" text-anchor="middle" font-family="var(--mono)" font-size="22" fill="var(--ink)" font-weight="700">${pct}%</text>
    <text x="60" y="74" text-anchor="middle" font-family="var(--mono)" font-size="9" fill="var(--ink-faint)" letter-spacing="1">COMPLETE</text>`;
}

// ---------- Home dashboard ----------
function renderDashboard() {
  const grid = document.getElementById('module-grid');
  if (!grid) return;

  const done = MODULES.filter(m => isModuleComplete(m.id)).length;
  const overall = getOverallProgress();
  const track = document.getElementById('progress-fill');
  const label = document.getElementById('progress-label');
  if (track) track.style.width = Math.round((done / MODULES.length) * 100) + '%';
  if (label) label.textContent = `${done} / ${MODULES.length} modules complete`;
  renderProgressRing('progress-ring', overall.pct);
  const ringLabel = document.getElementById('ring-label');
  if (ringLabel) ringLabel.textContent = `${overall.done} / ${overall.total} steps across modules, roadmap, projects & resume checklist`;

  grid.innerHTML = MODULES.map((m, i) => `
    <a class="mcard" href="${m.file}">
      <span class="status ${isModuleComplete(m.id) ? 'done' : 'todo'}">${isModuleComplete(m.id) ? 'Complete' : 'Not started'}</span>
      <div class="mnum">Module ${i}</div>
      <h3>${m.title}</h3>
      <p>${moduleBlurbs[m.id]}</p>
    </a>`).join('');
}

// ---------- Quiz engine ----------
// questions: [{ q, options: [str,...], correct: idx, explain }]
function initQuiz(mountId, questions, opts = {}) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  const answers = new Array(questions.length).fill(null);

  mount.innerHTML = `
    <div class="quiz">
      ${questions.map((item, qi) => `
        <div class="qitem" data-qi="${qi}">
          <p class="qtext"><span class="qn">Q${qi + 1}</span> ${item.q}</p>
          <div class="qopts">
            ${item.options.map((opt, oi) => `
              <label class="qopt" data-oi="${oi}">
                <input type="radio" name="q${qi}" value="${oi}">
                <span>${opt}</span>
              </label>`).join('')}
          </div>
          <div class="qexplain" data-qi-explain="${qi}">${item.explain}</div>
        </div>`).join('')}
      <div class="quiz-footer">
        <span class="quiz-score" id="${mountId}-score">Answer all questions, then check your score.</span>
        <button id="${mountId}-submit">Check answers</button>
      </div>
    </div>`;

  mount.querySelectorAll('input[type=radio]').forEach(input => {
    input.addEventListener('change', e => {
      const qi = parseInt(e.target.name.slice(1), 10);
      answers[qi] = parseInt(e.target.value, 10);
    });
  });

  document.getElementById(`${mountId}-submit`).addEventListener('click', () => {
    let score = 0;
    questions.forEach((item, qi) => {
      const opts = mount.querySelectorAll(`.qitem[data-qi="${qi}"] .qopt`);
      opts.forEach((optEl, oi) => {
        optEl.classList.remove('correct', 'incorrect');
        if (oi === item.correct) optEl.classList.add('correct');
        else if (oi === answers[qi]) optEl.classList.add('incorrect');
      });
      const ex = mount.querySelector(`[data-qi-explain="${qi}"]`);
      if (ex) ex.classList.add('show');
      if (answers[qi] === item.correct) score++;
    });
    const scoreEl = document.getElementById(`${mountId}-score`);
    scoreEl.textContent = `Score: ${score} / ${questions.length}`;
    if (score === questions.length && opts.onPass) opts.onPass();
  });
}

// ---------- Mark-complete control (modules) ----------
function initCompleteButton(moduleId) {
  const btn = document.getElementById('complete-btn');
  if (!btn) return;
  const sync = () => {
    const done = isModuleComplete(moduleId);
    btn.textContent = done ? '✓ Marked complete' : 'Mark this module complete';
    btn.classList.toggle('ghost', done);
  };
  sync();
  btn.addEventListener('click', () => {
    setModuleComplete(moduleId, !isModuleComplete(moduleId));
    sync();
  });
}

// ---------- Generic checklist renderer (roadmap + resume pages) ----------
function initChecklist(mountId, storageKey, items, opts = {}) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  function draw() {
    mount.innerHTML = items.map(item => `
      <label class="qopt" style="cursor:pointer;">
        <input type="checkbox" data-id="${item.id}" ${isChecked(storageKey, item.id) ? 'checked' : ''}>
        <span>${item.week ? `<b style="font-family:var(--mono); font-size:11px; color:var(--teal); text-transform:uppercase; letter-spacing:.04em; display:block; margin-bottom:2px;">${item.week}</b>` : ''}${item.title}</span>
      </label>`).join('');
    mount.querySelectorAll('input[type=checkbox]').forEach(cb => {
      cb.addEventListener('change', e => {
        setChecklistItem(storageKey, e.target.dataset.id, e.target.checked);
        const row = e.target.closest('.qopt');
        row.style.borderColor = e.target.checked ? 'var(--good)' : 'var(--line)';
        row.style.background = e.target.checked ? 'var(--good-soft)' : 'var(--bg)';
        if (opts.onChange) opts.onChange();
      });
      const row = cb.closest('.qopt');
      if (cb.checked) { row.style.borderColor = 'var(--good)'; row.style.background = 'var(--good-soft)'; }
    });
  }
  draw();
}

document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('topbar-mount');
  const current = mount ? mount.dataset.current : null;
  renderTopbar(current || null);
  renderDashboard();
});
