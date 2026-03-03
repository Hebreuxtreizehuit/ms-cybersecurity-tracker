/* MS Cybersecurity Tracker
   - Offline PWA
   - Course gating: Course 1 unlocked; others unlock when previous is completed.
   - LocalStorage persistence
*/

const STORAGE_KEY = "ms_cyber_tracker_v1";

let deferredPrompt = null;

// ---------- DATA (based on your 3 Word docs + screenshots) ----------
const COURSES = [
  {
    id: "c1",
    number: 1,
    title: "Introduction to Computers and Operating Systems and Security",
    duration: "16 hours",
    statusHint: "You are currently taking Course 1",
    whatYouLearn: [
      "Identify various components of a computer system.",
      "Explain how computer components interact with an operating system.",
      "Describe the basics of the cybersecurity landscape and business computing environments.",
      "NEW [optional] introduction to Generative AI."
    ],
    skills: [
      "Data Storage","Operating Systems","Cybersecurity","Cloud Computing","Information Systems Security",
      "Security Awareness","Computer Hardware","Business Systems","Generative AI","Servers","Enterprise Security",
      "Computer Systems","Computer Architecture","Patch Management"
    ],
    modules: [
      {
        name: "Course introduction",
        items: [
          { name: "Introduction to the program: Microsoft cybersecurity analyst", type: "Video", time: "4 min" },
          { name: "Introduction to the course: Introduction to computers and operating systems and security", type: "Video", time: "3 min" },
          { name: "Meet and greet", type: "Discussion Prompt", time: "10 min" },
          { name: "Skills measured: Exam SC-900", type: "Reading", time: "10 min" },
          { name: "Course syllabus", type: "Reading", time: "10 min" },
          { name: "How to be successful in this course", type: "Reading", time: "10 min" },
          { name: "A day in the life", type: "Video", time: "5 min" },
          { name: "How to open an image in a new tab", type: "Reading", time: "10 min" },
          { name: "How to locate your downloaded files", type: "Reading", time: "10 min" },
          { name: "Additional resources: Microsoft cybersecurity analyst", type: "Reading", time: "5 min" }
        ]
      },
      {
        name: "Introduction to Generative AI (optional)",
        items: [
          { name: "Welcome to Generative AI for everyone", type: "Video", time: "6 min" },
          { name: "Understanding the capabilities of Generative AI for Business Functions", type: "Video", time: "9 min" },
          { name: "Generative AI Terminology", type: "Reading", time: "10 min" },
          { name: "Generative AI – Under the hood", type: "Video", time: "7 min" },
          { name: "The potential pitfalls and shortcomings of GEN AI", type: "Video", time: "6 min" },
          { name: "General Knowledge Quiz", type: "Practice Assignment", time: "15 min" },
          { name: "Generative AI in Business", type: "Reading", time: "10 min" }
        ]
      },
      {
        name: "Threat landscape",
        items: [
          { name: "Threat landscape overview", type: "Video", time: "4 min" },
          { name: "What elements of the threat landscape have you been exposed to before?", type: "Discussion Prompt", time: "10 min" },
          { name: "Threat stats", type: "Reading", time: "10 min" },
          { name: "Linked threats", type: "Video", time: "4 min" },
          { name: "Exercise: Explaining the threat landscape", type: "Reading", time: "30 min" },
          { name: "Self-review: Explaining the threat landscape", type: "Practice Assignment", time: "10 min" },
          { name: "Exemplar: Explaining the threat landscape", type: "Reading", time: "10 min" },
          { name: "Knowledge check: Elements of the threat landscape", type: "Practice Assignment", time: "15 min" },
          { name: "Additional resources: Threat landscape", type: "Reading", time: "5 min" }
        ]
      },
      {
        name: "Introduction to computing devices",
        items: [
          { name: "What is a computer and what is inside it?", type: "Video", time: "4 min" },
          { name: "Hardware versus software", type: "Reading", time: "10 min" },
          { name: "How does a computer operate?", type: "Video", time: "6 min" },
          { name: "Knowledge check: Introduction to computing devices", type: "Practice Assignment", time: "15 min" },
          { name: "Additional resources: Introduction to computing devices", type: "Reading", time: "5 min" }
        ]
      },
      {
        name: "Operating systems",
        items: [
          { name: "What is an operating system and what does it do?", type: "Video", time: "4 min" },
          { name: "Types of operating systems", type: "Reading", time: "10 min" },
          { name: "Popular operating systems", type: "Video", time: "6 min" },
          { name: "Proprietary and open-source software", type: "Reading", time: "10 min" },
          { name: "Knowledge check: Operating systems", type: "Practice Assignment", time: "15 min" },
          { name: "Module summary: Introduction to computers and operating systems", type: "Video", time: "3 min" },
          { name: "Module quiz: Introduction to computers and operating systems", type: "Graded Assignment", time: "30 min", extra: "Due date shown in screenshot: Mar 9, 11:59 PM EDT" },
          { name: "Additional resources: Operating systems", type: "Reading", time: "5 min" }
        ]
      }
    ]
  },

  // Courses 2–9 (high-level info from your earlier extracted “What you'll learn / Skills you'll gain”)
  {
    id: "c2",
    number: 2,
    title: "Introduction to Networking and Cloud Computing",
    duration: "25 hours",
    whatYouLearn: [
      "Set up a cloud computing environment, virtual machines and cloud services.",
      "Set up common network infrastructure and monitoring.",
      "Use network security components, approaches and mitigation.",
      "Produce a coherent expansion plan to take advantage of cloud infrastructure."
    ],
    skills: [
      "Cloud Computing","Network Security","Computer Networking","Virtual Machines","Virtualization",
      "Firewall","Microsoft Azure","Cybersecurity","Network Infrastructure","Digital Transformation",
      "Network Monitoring","Artificial Intelligence and Machine Learning (AI/ML)"
    ],
    modules: []
  },
  {
    id: "c3",
    number: 3,
    title: "Cybersecurity Threat Vectors and Mitigation",
    duration: "19 hours",
    whatYouLearn: [
      "Understand evolving cyber threats, attack types, and vulnerabilities.",
      "Explore encryption algorithms and applications.",
      "Understand risk assessment, defense models, and regulatory requirements."
    ],
    skills: [
      "Encryption","Identity and Access Management","Data Security","Cryptography","Cyber Attacks",
      "Network Security","Threat Detection","Authorization (Computing)","Threat Management",
      "Authentications","Cybersecurity","Security Strategy","Active Directory","Firewall","Multi-Factor Authentication"
    ],
    modules: []
  },
  {
    id: "c4",
    number: 4,
    title: "Cybersecurity Identity and Access Solutions using Azure AD",
    duration: "23 hours",
    whatYouLearn: [
      "Build foundational identity and access management knowledge using Azure AD."
    ],
    skills: [
      "Identity and Access Management","Azure Active Directory","Multi-Factor Authentication",
      "Role-Based Access Control (RBAC)","Single Sign-On (SSO)","User Accounts","Microsoft Azure",
      "Software as a Service","Active Directory","Authorization (Computing)","Enterprise Security",
      "Cloud Services","Authentications"
    ],
    modules: []
  },
  {
    id: "c5",
    number: 5,
    title: "Cybersecurity Solutions and Microsoft Defender",
    duration: "23 hours",
    whatYouLearn: [
      "Learn cloud security policies protecting against DDoS attacks, firewall breaches, and unauthorized access."
    ],
    skills: [
      "Security Information and Event Management (SIEM)","Firewall","Distributed Denial-Of-Service (DDoS) Attacks",
      "Cybersecurity","Cloud Security","Network Security","Virtual Networking","Identity and Access Management",
      "Malware Protection","Cyber Threat Intelligence","Threat Detection","Endpoint Security","Encryption",
      "Microsoft Azure","Cyber Security Policies","Threat Management","Event Management"
    ],
    modules: []
  },
  {
    id: "c6",
    number: 6,
    title: "Cybersecurity Tools and Technologies",
    duration: "20 hours",
    whatYouLearn: [
      "Work with security testing tools in cloud environments.",
      "Execute penetration testing on a cloud platform.",
      "Create a penetration test plan."
    ],
    skills: [
      "Penetration Testing","Microsoft Azure","Vulnerability Scanning","Vulnerability Management",
      "Intrusion Detection and Prevention","Firewall","Virtual Private Networks (VPN)","Security Testing",
      "Cybersecurity","Exploitation Techniques","System Testing","Cloud Security","Vulnerability Assessments","Network Security"
    ],
    modules: []
  },
  {
    id: "c7",
    number: 7,
    title: "Cybersecurity Management and Compliance",
    duration: "—",
    whatYouLearn: [
      "Learn data and record management, information security, standards and policy formation, and implementation.",
      "Explore cloud adoption frameworks and regulatory compliance frameworks.",
      "Use available tools for compliance management."
    ],
    skills: [
      "Cloud Security","Identity and Access Management","Microsoft Azure","Disaster Recovery","Data Management",
      "General Data Protection Regulation (GDPR)","Data Governance","Cloud Computing Architecture","Security Controls",
      "Cloud Computing","Cyber Security Policies","Records Management","Information Privacy","Threat Management","Security Management"
    ],
    modules: []
  },
  {
    id: "c8",
    number: 8,
    title: "Advanced Cybersecurity Concepts and Capstone Project",
    duration: "21 hours",
    whatYouLearn: [
      "Manage and reduce the risk of threats to an organization or system.",
      "Mitigate common cyber threats using tools and strategies.",
      "Develop strategies to protect data and applications from unauthorized access."
    ],
    skills: [
      "Network Security","Cloud Security","Internet of Things","Threat Modeling","MITRE ATT&CK Framework",
      "Application Security","Cyber Security Strategy","Microsoft Azure","Secure Coding","Identity and Access Management",
      "Security Strategy","Vulnerability Assessments","Cybersecurity","Threat Management","Asset Management","Threat Detection"
    ],
    modules: []
  },
  {
    id: "c9",
    number: 9,
    title: "Microsoft SC-900 Exam Preparation and Practice",
    duration: "26 hours",
    whatYouLearn: [
      "Describe security, compliance, and identity concepts.",
      "Describe Microsoft identity and access management solutions.",
      "Describe Microsoft security and compliance solutions.",
      "NEW [optional] introduction to Generative AI."
    ],
    skills: [
      "Multi-Factor Authentication","Identity and Access Management","Azure Active Directory","Cloud Security","Data Governance",
      "Regulatory Compliance","Data Security","Active Directory","Security Controls","Generative AI","Network Security",
      "Threat Detection","Role-Based Access Control (RBAC)","Authentications"
    ],
    modules: []
  }
];

// ---------- STATE ----------
function defaultState() {
  const courseState = {};
  for (const c of COURSES) {
    courseState[c.id] = {
      completed: false,
      // checklist completion per item key
      checks: {},
      notes: ""
    };
  }
  // Unlock logic: course 1 unlocked; others locked until previous complete.
  return { selectedCourseId: "c1", courseState };
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState();
  try {
    const s = JSON.parse(raw);
    // minimal shape check
    if (!s.courseState) return defaultState();
    return s;
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();

// ---------- HELPERS ----------
function courseById(id) {
  return COURSES.find(c => c.id === id);
}
function prevCourse(course) {
  const idx = COURSES.findIndex(c => c.id === course.id);
  return idx > 0 ? COURSES[idx - 1] : null;
}
function isUnlocked(course) {
  if (course.number === 1) return true;
  const prev = prevCourse(course);
  if (!prev) return true;
  return !!state.courseState[prev.id]?.completed;
}
function courseChecksTotal(course) {
  // Count module items if present; otherwise 0
  if (!course.modules?.length) return 0;
  let total = 0;
  for (const m of course.modules) total += m.items.length;
  return total;
}
function courseChecksDone(course) {
  const cs = state.courseState[course.id];
  if (!course.modules?.length) return cs.completed ? 1 : 0;
  let done = 0;
  for (const m of course.modules) {
    for (const it of m.items) {
      const key = itemKey(course.id, m.name, it.name);
      if (cs.checks[key]) done += 1;
    }
  }
  return done;
}
function coursePercent(course) {
  const total = courseChecksTotal(course);
  const cs = state.courseState[course.id];
  if (total === 0) return cs.completed ? 100 : 0;
  return Math.round((courseChecksDone(course) / total) * 100);
}
function overallPercent() {
  // simple overall: average of course percents
  const sum = COURSES.reduce((a,c)=>a+coursePercent(c),0);
  return Math.round(sum / COURSES.length);
}
function itemKey(courseId, moduleName, itemName) {
  return `${courseId}::${moduleName}::${itemName}`;
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ---------- UI ----------
const courseListEl = document.getElementById("courseList");
const courseTitleEl = document.getElementById("courseTitle");
const courseStatusEl = document.getElementById("courseStatus");
const courseMetaEl = document.getElementById("courseMeta");

const tabBtns = [...document.querySelectorAll(".tab")];
const tabPanels = {
  modules: document.getElementById("tab_modules"),
  learn: document.getElementById("tab_learn"),
  skills: document.getElementById("tab_skills"),
  notes: document.getElementById("tab_notes"),
};

const overallPctEl = document.getElementById("overallPct");
const overallFillEl = document.getElementById("overallFill");

const markCourseDoneBtn = document.getElementById("markCourseDoneBtn");
const reopenCourseBtn = document.getElementById("reopenCourseBtn");

function renderCourseList() {
  courseListEl.innerHTML = "";

  for (const c of COURSES) {
    const unlocked = isUnlocked(c);
    const completed = state.courseState[c.id]?.completed;
    const pct = coursePercent(c);

    const card = document.createElement("div");
    card.className = "courseCard" + (state.selectedCourseId === c.id ? " active" : "");
    card.setAttribute("role", "listitem");

    const badge = document.createElement("div");
    badge.className = "badge " + (completed ? "done" : (unlocked ? "open" : "lock"));
    badge.textContent = completed ? "Completed" : (unlocked ? "Open" : "Locked");

    const top = document.createElement("div");
    top.className = "courseTop";

    const left = document.createElement("div");
    const name = document.createElement("div");
    name.className = "courseName";
    name.textContent = `Course ${c.number}`;
    const sub = document.createElement("div");
    sub.className = "courseSub";
    sub.textContent = c.title;

    left.appendChild(name);
    left.appendChild(sub);

    top.appendChild(left);
    top.appendChild(badge);

    const miniBar = document.createElement("div");
    miniBar.className = "courseMiniBar";
    const miniFill = document.createElement("div");
    miniFill.className = "courseMiniFill";
    miniFill.style.width = `${pct}%`;
    miniBar.appendChild(miniFill);

    const pctText = document.createElement("div");
    pctText.className = "courseSub";
    pctText.style.marginTop = "6px";
    pctText.textContent = `Progress: ${pct}%`;

    card.appendChild(top);
    card.appendChild(miniBar);
    card.appendChild(pctText);

    card.addEventListener("click", () => {
      if (!unlocked) {
        alert("This course is locked. Complete the previous course to unlock it.");
        return;
      }
      state.selectedCourseId = c.id;
      saveState();
      renderAll();
    });

    courseListEl.appendChild(card);
  }
}

function renderCourseDetail() {
  const c = courseById(state.selectedCourseId);
  if (!c) return;

  const unlocked = isUnlocked(c);
  const completed = state.courseState[c.id]?.completed;
  const pct = coursePercent(c);

  courseTitleEl.textContent = `Course ${c.number}: ${c.title}`;

  courseStatusEl.textContent = completed ? "Completed" : (unlocked ? "In progress" : "Locked");

  courseMetaEl.innerHTML = "";
  const metaBits = [
    `Duration: ${c.duration || "—"}`,
    `Progress: ${pct}%`,
    c.number === 1 ? "Current course: Yes" : "Current course: No (locked until unlocked)"
  ];
  for (const m of metaBits) {
    const span = document.createElement("span");
    span.className = "pill";
    span.textContent = m;
    courseMetaEl.appendChild(span);
  }

  // Tabs content
  renderModulesTab(c);
  renderLearnTab(c);
  renderSkillsTab(c);
  renderNotesTab(c);

  // Buttons
  markCourseDoneBtn.disabled = !unlocked || completed;
  reopenCourseBtn.disabled = !unlocked || !completed;

  markCourseDoneBtn.onclick = () => {
    // For Course 1, ensure checklist is done before allowing completion (quality gate)
    if (c.modules?.length) {
      const total = courseChecksTotal(c);
      const done = courseChecksDone(c);
      if (done < total) {
        const ok = confirm(`You still have ${total - done} unchecked items. Mark course completed anyway?`);
        if (!ok) return;
      }
    }
    state.courseState[c.id].completed = true;
    saveState();
    renderAll();
    const next = COURSES.find(x => x.number === c.number + 1);
    if (next) alert(`Course ${next.number} is now unlocked!`);
  };

  reopenCourseBtn.onclick = () => {
    state.courseState[c.id].completed = false;
    saveState();
    renderAll();
  };
}

function renderModulesTab(course) {
  const panel = tabPanels.modules;
  panel.innerHTML = "";

  if (!course.modules || course.modules.length === 0) {
    panel.innerHTML = `<p class="hint">Modules will appear here once that course opens. For now, this course shows overview only.</p>`;
    return;
  }

  const cs = state.courseState[course.id];

  for (const mod of course.modules) {
    const h = document.createElement("div");
    h.className = "sectionTitle";
    h.textContent = mod.name;
    panel.appendChild(h);

    const list = document.createElement("div");
    list.className = "checklist";

    for (const it of mod.items) {
      const key = itemKey(course.id, mod.name, it.name);
      const row = document.createElement("label");
      row.className = "item";

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = !!cs.checks[key];
      cb.addEventListener("change", () => {
        cs.checks[key] = cb.checked;
        // Auto mark course complete if everything is checked (optional behavior)
        const total = courseChecksTotal(course);
        const done = courseChecksDone(course);
        if (total > 0 && done === total) {
          // don’t auto-complete, just notify readiness
        }
        saveState();
        renderAll(); // update percents
      });

      const text = document.createElement("div");
      text.className = "label";
      const title = document.createElement("div");
      title.textContent = it.name;

      const meta = document.createElement("div");
      meta.className = "meta2";
      meta.textContent = `${it.type} • ${it.time}` + (it.extra ? ` • ${it.extra}` : "");

      text.appendChild(title);
      text.appendChild(meta);

      row.appendChild(cb);
      row.appendChild(text);
      list.appendChild(row);
    }

    panel.appendChild(list);
  }
}

function renderLearnTab(course) {
  const panel = tabPanels.learn;
  panel.innerHTML = "";
  const ul = document.createElement("ul");
  ul.className = "bullets";
  (course.whatYouLearn || []).forEach(x => {
    const li = document.createElement("li");
    li.textContent = x;
    ul.appendChild(li);
  });
  panel.appendChild(ul);
}

function renderSkillsTab(course) {
  const panel = tabPanels.skills;
  panel.innerHTML = "";

  const wrap = document.createElement("div");
  wrap.style.display = "flex";
  wrap.style.flexWrap = "wrap";
  wrap.style.gap = "8px";

  (course.skills || []).forEach(s => {
    const chip = document.createElement("span");
    chip.className = "pill";
    chip.textContent = s;
    wrap.appendChild(chip);
  });

  panel.appendChild(wrap);
}

function renderNotesTab(course) {
  const panel = tabPanels.notes;
  panel.innerHTML = "";

  const cs = state.courseState[course.id];
  const label = document.createElement("div");
  label.className = "hint";
  label.textContent = "Write your notes here (saved on your device).";

  const ta = document.createElement("textarea");
  ta.value = cs.notes || "";
  ta.placeholder = "Example: Key points, tricky terms, quiz mistakes, reminders…";
  ta.addEventListener("input", () => {
    cs.notes = ta.value;
    saveState();
  });

  panel.appendChild(label);
  panel.appendChild(document.createElement("div")).style.height = "8px";
  panel.appendChild(ta);
}

function renderOverall() {
  const pct = overallPercent();
  overallPctEl.textContent = `${pct}% complete`;
  overallFillEl.style.width = `${pct}%`;
}

function setActiveTab(tabName) {
  tabBtns.forEach(b => {
    const isActive = b.dataset.tab === tabName;
    b.classList.toggle("active", isActive);
    b.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  Object.entries(tabPanels).forEach(([k, el]) => {
    el.classList.toggle("active", k === tabName);
  });
}

function bindTabs() {
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => setActiveTab(btn.dataset.tab));
  });
}

function renderAll() {
  renderOverall();
  renderCourseList();
  renderCourseDetail();
}

// ---------- EXPORT / RESET ----------
document.getElementById("exportBtn").addEventListener("click", () => {
  const exportObj = {
    exportedAt: new Date().toISOString(),
    state,
    courses: COURSES.map(c => ({
      id: c.id,
      number: c.number,
      title: c.title,
      duration: c.duration
    }))
  };
  downloadText("ms-cybersecurity-tracker-export.json", JSON.stringify(exportObj, null, 2));
});

document.getElementById("resetBtn").addEventListener("click", () => {
  const ok = confirm("Reset all progress and notes? This cannot be undone.");
  if (!ok) return;
  state = defaultState();
  saveState();
  renderAll();
});

// ---------- INSTALL (Android PWA) ----------
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.hidden = false;
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.hidden = true;
});

// ---------- SERVICE WORKER ----------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

// ---------- INIT ----------
bindTabs();
renderAll();
setActiveTab("modules");