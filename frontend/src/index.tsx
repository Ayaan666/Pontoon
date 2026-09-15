@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

:root {
  font-family: "Inter", sans-serif;
  color: #e8edf3;
  background: #080b10;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 1100px;
  background: #080b10;
}

button,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

.app-shell {
  display: flex;
  min-height: 100vh;
  background:
    radial-gradient(circle at 75% 0%, rgba(25, 72, 80, 0.13), transparent 30%),
    #080b10;
}

/* =========================
   SIDEBAR
========================= */

.sidebar {
  width: 245px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 22px 14px;
  border-right: 1px solid #1b222b;
  background: #0a0e13;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px 26px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.brand-mark {
  width: 29px;
  height: 29px;
  display: grid;
  place-items: center;
  border: 1px solid #1d9fa4;
  border-radius: 8px;
  color: #67e1df;
  font-size: 16px;
  font-weight: 700;
  background: rgba(34, 175, 180, 0.08);
}

.workspace {
  padding: 0 6px 20px;
}

.workspace-label,
.nav-section,
.card-label,
.eyebrow {
  color: #697582;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.13em;
}

.workspace-label {
  padding: 0 7px 8px;
}

.project-selector {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px;
  border: 1px solid #202832;
  border-radius: 8px;
  color: #dce3e9;
  background: #10151c;
  text-align: left;
}

.project-selector:hover {
  border-color: #2a3641;
}

.project-icon {
  width: 27px;
  height: 27px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  background: #18383c;
  color: #72d7d4;
  font-size: 12px;
  font-weight: 700;
}

.project-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.project-info span {
  font-size: 11px;
  font-weight: 600;
}

.project-info small {
  color: #687581;
  font-size: 9px;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.nav-section {
  padding: 14px 9px 6px;
}

.nav-section.secondary {
  margin-top: 8px;
}

.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 9px 10px;
  border: 0;
  border-radius: 7px;
  color: #7f8b97;
  background: transparent;
  font-size: 12px;
  text-align: left;
}

.nav-item:hover {
  color: #cdd5dc;
  background: #11171e;
}

.nav-item.active {
  color: #e4f7f6;
  background: #123033;
  box-shadow: inset 2px 0 0 #38bfc0;
}

.sidebar-bottom {
  margin-top: auto;
}

.system-status {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 15px 6px 0;
  padding: 11px;
  border: 1px solid #192229;
  border-radius: 8px;
  background: #0d1318;
}

.system-status strong {
  display: block;
  color: #a8b5be;
  font-size: 9px;
  font-weight: 600;
}

.system-status small {
  display: block;
  margin-top: 3px;
  color: #56636e;
  font-size: 9px;
}

.status-dot,
.environment-dot,
.badge-dot {
  width: 6px;
  height: 6px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #43c99a;
  box-shadow: 0 0 8px rgba(67, 201, 154, 0.45);
}

/* =========================
   MAIN
========================= */

.main {
  flex: 1;
  min-width: 0;
}

.topbar {
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 34px;
  border-bottom: 1px solid #1a2129;
  background: rgba(8, 11, 16, 0.86);
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #697581;
  font-size: 11px;
}

.breadcrumbs strong {
  color: #c9d1d8;
  font-weight: 500;
}

.separator {
  color: #303943;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 18px;
}

.environment {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #7f8b95;
  font-size: 10px;
}

.avatar {
  width: 29px;
  height: 29px;
  display: grid;
  place-items: center;
  border: 1px solid #27303a;
  border-radius: 50%;
  color: #aeb9c1;
  background: #131920;
  font-size: 9px;
  font-weight: 600;
}

.content {
  width: min(1100px, calc(100% - 80px));
  margin: 0 auto;
  padding: 58px 0 40px;
}

.hero {
  margin-bottom: 30px;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #54c9c7;
  margin-bottom: 13px;
}

.hero h1 {
  margin: 0;
  color: #f1f5f7;
  font-size: 31px;
  font-weight: 600;
  letter-spacing: -0.035em;
}

.hero p {
  max-width: 570px;
  margin: 9px 0 0;
  color: #788590;
  font-size: 13px;
  line-height: 1.7;
}

/* =========================
   CHANGE CARD
========================= */

.change-card {
  border: 1px solid #202832;
  border-radius: 11px;
  background: #0d1218;
  overflow: hidden;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.16);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 21px 23px 14px;
}

.card-header h2,
.section-heading h2 {
  margin: 6px 0 0;
  color: #dce3e8;
  font-size: 14px;
  font-weight: 600;
}

.context-badge {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 8px;
  border: 1px solid #1c3a36;
  border-radius: 5px;
  color: #6bc9ac;
  background: #0d1c19;
  font-size: 9px;
}

.change-input {
  width: calc(100% - 46px);
  min-height: 145px;
  margin: 0 23px;
  padding: 17px;
  resize: vertical;
  outline: none;
  border: 1px solid #1d2630;
  border-radius: 7px;
  color: #dce4e9;
  background: #090d12;
  font-size: 12px;
  line-height: 1.7;
}

.change-input::placeholder {
  color: #4d5964;
}

.change-input:focus {
  border-color: #28686a;
  box-shadow: 0 0 0 2px rgba(46, 166, 166, 0.07);
}

.input-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 14px 23px 20px;
}

.input-footer > span {
  color: #56636e;
  font-size: 9px;
}

.analyze-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  border: 1px solid #2e9b9d;
  border-radius: 6px;
  color: #e7ffff;
  background: #176568;
  font-size: 11px;
  font-weight: 600;
}

.analyze-button:hover {
  background: #1b7375;
}

/* =========================
   OUTPUT PREVIEW
========================= */

.results-preview {
  margin-top: 42px;
}

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 14px;
}

.muted {
  color: #4e5a65;
  font-size: 9px;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 11px;
}

.preview-card {
  min-height: 115px;
  display: flex;
  gap: 13px;
  padding: 17px;
  border: 1px solid #1b232c;
  border-radius: 9px;
  background: #0b1015;
}

.preview-icon {
  width: 31px;
  height: 31px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border: 1px solid #202b34;
  border-radius: 7px;
  color: #5d8990;
  background: #0f171c;
}

.preview-card div:last-child {
  display: flex;
  flex-direction: column;
}

.preview-card span {
  color: #5e6a75;
  font-size: 9px;
  letter-spacing: 0.1em;
}

.preview-card strong {
  margin-top: 9px;
  color: #697680;
  font-size: 18px;
  font-weight: 500;
}

.preview-card small {
  margin-top: 4px;
  color: #4c5862;
  font-size: 9px;
}

.footer-note {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 30px;
  color: #52606b;
  font-size: 9px;
}

.footer-separator {
  color: #303a43;
}

@media (max-width: 1200px) {
  .content {
    width: calc(100% - 50px);
  }
}

/* =========================================================
   M03 — AI REASONING
   ========================================================= */

.ai-action {
  margin-top: 18px;
  margin-bottom: 12px;
  padding: 18px 20px;

  border: 1px solid #202b35;
  border-radius: 8px;

  background: #0b1015;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.ai-action > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.ai-action strong {
  color: #e8edf3;
  font-size: 14px;
  font-weight: 600;
}

.ai-action span:not(.card-label) {
  color: #6f8291;
  font-size: 11px;
  line-height: 150%;
}


/* =========================================================
   AI REASONING CARD
   ========================================================= */

.ai-reasoning-card {
  margin-top: 12px;
  padding: 20px;

  border: 1px solid #202b35;
  border-radius: 8px;

  background: #0b1015;

  color: #e8edf3;
}

.ai-reasoning-card.ai-empty {
  min-height: 100px;
}


/* =========================================================
   AI HEADER
   ========================================================= */

.ai-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding-bottom: 16px;

  border-bottom: 1px solid #18222b;
}

.ai-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-icon {
  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #164e59;
  border-radius: 6px;

  color: #22c7d6;
  background: #0b171b;
}

.ai-title h2 {
  margin: 2px 0 0;

  color: #e8edf3;
  font-size: 16px;
  font-weight: 600;
}

.ai-status {
  color: #6f8291;
  font-size: 10px;
}

.ai-status.live {
  color: #35c9a4;

  display: flex;
  align-items: center;
  gap: 6px;
}


/* =========================================================
   AI SUMMARY
   ========================================================= */

.ai-summary {
  padding: 18px 0;

  border-bottom: 1px solid #18222b;
}

.ai-summary p {
  margin-top: 8px;

  max-width: 900px;

  color: #a9b6c2;
  font-size: 13px;
  line-height: 165%;
}


/* =========================================================
   AI SECTIONS
   ========================================================= */

.ai-section {
  padding: 18px 0;

  border-bottom: 1px solid #18222b;
}

.ai-section:last-child {
  border-bottom: none;
}

.ai-section-heading {
  display: flex;
  align-items: center;
  gap: 8px;

  margin-bottom: 12px;

  color: #8ea3b2;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.8px;
}

.ai-section-heading svg {
  color: #22c7d6;
}

.ai-section-heading.risk svg {
  color: #d99a45;
}


/* =========================================================
   AI LIST
   ========================================================= */

.ai-list {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.ai-list-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;

  color: #a9b6c2;
  font-size: 12px;
  line-height: 155%;
}

.bullet {
  width: 5px;
  height: 5px;

  margin-top: 6px;

  flex: 0 0 auto;

  border-radius: 50%;
  background: #22c7d6;
}

.risk-bullet {
  background: #d99a45;
}


/* =========================================================
   QA FOCUS
   ========================================================= */

.ai-focus-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.ai-focus-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;

  padding: 10px 12px;

  border: 1px solid #18242d;
  border-radius: 6px;

  background: #090e13;
}

.ai-focus-item > span {
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  border: 1px solid #1d4f59;
  border-radius: 4px;

  color: #22c7d6;
  font-size: 10px;
}

.ai-focus-item p {
  color: #a9b6c2;
  font-size: 11px;
  line-height: 150%;
}


/* =========================================================
   AMBIGUITIES
   ========================================================= */

.ai-section.ambiguity {
  padding-bottom: 4px;
}

.ai-section.ambiguity .ai-section-heading svg {
  color: #d99a45;
}


/* =========================================================
   LOADING
   ========================================================= */

.ai-loading {
  padding-top: 18px;

  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-line {
  height: 10px;

  width: 70%;

  border-radius: 3px;

  background: #17212a;
}

.skeleton-line.large {
  width: 90%;
}

.skeleton-line.short {
  width: 45%;
}


/* =========================================================
   RESPONSIVE
   ========================================================= */

@media (max-width: 800px) {

  .ai-action {
    align-items: flex-start;
    flex-direction: column;
  }

  .ai-focus-grid {
    grid-template-columns: 1fr;
  }

}