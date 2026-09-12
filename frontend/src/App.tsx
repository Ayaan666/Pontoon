import { useState } from "react";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  FolderKanban,
  GitBranch,
  LayoutDashboard,
  Loader2,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { analyzeChange } from "./services/api";
import type { AnalyzeResponse } from "./services/api";

import "./index.css";

/* =========================================================
   HELPERS
   ========================================================= */

function normalizeTests(value: unknown): any[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;

    if (Array.isArray(obj.tests)) {
      return obj.tests;
    }

    if (Array.isArray(obj.items)) {
      return obj.items;
    }

    return Object.values(obj).filter(
      (item) =>
        item &&
        typeof item === "object" &&
        ("test_id" in item || "name" in item)
    );
  }

  return [];
}

/* =========================================================
   APP
   ========================================================= */

function App() {
  const [change, setChange] = useState("");
  const [analysis, setAnalysis] =
    useState<AnalyzeResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =======================================================
     ANALYZE
     ======================================================= */

  async function handleAnalyze() {
    if (!change.trim() || loading) {
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const result = await analyzeChange(
        change.trim()
      );

      setAnalysis(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to analyze this change."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =======================================================
     DATA
     ======================================================= */

  const impact = analysis?.impact;
  const regression = analysis?.regression;
  const retrieval = analysis?.retrieval;

  /*
   * Atlas regression structure may contain recommendation
   * buckets as arrays or objects.
   */

  const regressionSummary =
    regression?.summary;

  const mustRunTests =
    normalizeTests(
      regressionSummary?.must_run
    );

  const recommendedTests =
    normalizeTests(
      regressionSummary?.recommended
    );

  const optionalTests =
    normalizeTests(
      regressionSummary?.optional
    );

  const calculatedRegressionCount =
    mustRunTests.length +
    recommendedTests.length +
    optionalTests.length;

  const regressionCount =
    typeof regressionSummary?.total_recommended ===
      "number"
      ? regressionSummary.total_recommended
      : calculatedRegressionCount;

  const directFeatures =
    impact?.directly_affected_features ?? [];

  const affectedFeatures =
    impact?.affected_features ?? [];

  const dependentFeatures =
    affectedFeatures.filter(
      (feature) =>
        !directFeatures.includes(feature)
    );

  /* =======================================================
     UI
     ======================================================= */

  return (
    <div className="app-shell">

      {/* ===================================================
          SIDEBAR
          =================================================== */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-mark">
            P
          </div>

          <span>
            PONTOON
          </span>

        </div>


        <div className="workspace">

          <div className="workspace-label">
            WORKSPACE
          </div>

          <button className="project-selector">

            <div className="project-icon">
              C
            </div>

            <div className="project-info">

              <span>
                Commerce Platform
              </span>

              <small>
                Production
              </small>

            </div>

            <ChevronDown size={15} />

          </button>

        </div>


        <nav className="nav">

          <div className="nav-section">
            OPERATE
          </div>


          <button className="nav-item">

            <LayoutDashboard size={17} />

            Overview

          </button>


          <button className="nav-item active">

            <Sparkles size={17} />

            Analyze Change

          </button>


          <button className="nav-item">

            <FolderKanban size={17} />

            Projects

          </button>


          <button className="nav-item">

            <GitBranch size={17} />

            Context

          </button>


          <div className="nav-section secondary">
            OBSERVE
          </div>


          <button className="nav-item">

            <Activity size={17} />

            Activity

          </button>


          <button className="nav-item">

            <BarChart3 size={17} />

            Analytics

          </button>

        </nav>


        <div className="sidebar-bottom">

          <button className="nav-item">

            <CircleHelp size={17} />

            Help

          </button>


          <button className="nav-item">

            <Settings size={17} />

            Settings

          </button>


          <div className="system-status">

            <span className="status-dot" />

            <div>

              <strong>
                Systems operational
              </strong>

              <small>
                Atlas v0.4
              </small>

            </div>

          </div>

        </div>

      </aside>


      {/* ===================================================
          MAIN
          =================================================== */}

      <main className="main">


        {/* =================================================
            TOP BAR
            ================================================= */}

        <header className="topbar">

          <div className="breadcrumbs">

            <span>
              Commerce Platform
            </span>

            <span className="separator">
              /
            </span>

            <strong>
              Analyze Change
            </strong>

          </div>


          <div className="topbar-right">

            <div className="environment">

              <span className="environment-dot" />

              Production

            </div>


            <div className="avatar">
              AA
            </div>

          </div>

        </header>


        {/* =================================================
            CONTENT
            ================================================= */}

        <div className="content">


          {/* =================================================
              HERO
              ================================================= */}

          <section className="hero">

            <div>

              <div className="eyebrow">

                <ShieldCheck size={14} />

                QUALITY ENGINEERING

              </div>


              <h1>
                Analyze a change.
              </h1>


              <p>
                Understand product impact, evidence,
                and regression scope before you test.
              </p>

            </div>

          </section>


          {/* =================================================
              CHANGE INPUT
              ================================================= */}

          <section className="change-card">

            <div className="card-header">

              <div>

                <span className="card-label">
                  PRODUCT CHANGE
                </span>


                <h2>
                  What changed?
                </h2>

              </div>


              <span className="context-badge">

                <span className="badge-dot" />

                Atlas ready

              </span>

            </div>


            <textarea
              className="change-input"
              value={change}
              onChange={(event) =>
                setChange(event.target.value)
              }
              placeholder="Describe the product change you want to analyze..."
              disabled={loading}
            />


            <div className="input-footer">

              <span>
                Example: Add biometric confirmation
                before a customer pays on an iPhone.
              </span>


              <button
                className="analyze-button"
                onClick={handleAnalyze}
                disabled={
                  !change.trim() || loading
                }
              >

                {loading ? (

                  <>

                    <Loader2
                      size={16}
                      className="spin"
                    />

                    Analyzing...

                  </>

                ) : (

                  <>

                    <Sparkles size={16} />

                    Analyze Change

                  </>

                )}

              </button>

            </div>

          </section>


          {/* =================================================
              ERROR
              ================================================= */}

          {error && (

            <div className="error-banner">

              <AlertTriangle size={17} />

              <div>

                <strong>
                  Analysis failed
                </strong>

                <span>
                  {error}
                </span>

              </div>

            </div>

          )}


          {/* =================================================
              EMPTY STATE
              ================================================= */}

          {!analysis &&
            !loading &&
            !error && (

              <section className="results-preview">

                <div className="section-heading">

                  <div>

                    <span className="card-label">
                      ANALYSIS OUTPUT
                    </span>

                    <h2>
                      Impact intelligence
                    </h2>

                  </div>


                  <span className="muted">
                    Awaiting change
                  </span>

                </div>


                <div className="preview-grid">


                  <div className="preview-card">

                    <div className="preview-icon">
                      <GitBranch size={18} />
                    </div>


                    <div>

                      <span>
                        IMPACT
                      </span>

                      <strong>
                        —
                      </strong>

                      <small>
                        Direct & dependent features
                      </small>

                    </div>

                  </div>


                  <div className="preview-card">

                    <div className="preview-icon">
                      <Search size={18} />
                    </div>


                    <div>

                      <span>
                        EVIDENCE
                      </span>

                      <strong>
                        —
                      </strong>

                      <small>
                        Semantic context matches
                      </small>

                    </div>

                  </div>


                  <div className="preview-card">

                    <div className="preview-icon">
                      <ShieldCheck size={18} />
                    </div>


                    <div>

                      <span>
                        REGRESSION
                      </span>

                      <strong>
                        —
                      </strong>

                      <small>
                        Recommended test scope
                      </small>

                    </div>

                  </div>

                </div>

              </section>

            )}


          {/* =================================================
              LOADING
              ================================================= */}

          {loading && (

            <div className="loading-state">

              <Loader2
                size={22}
                className="spin"
              />

              <div>

                <strong>
                  Atlas is analyzing the change
                </strong>

                <span>
                  Retrieving semantic context,
                  evaluating dependencies, and
                  calculating regression scope.
                </span>

              </div>

            </div>

          )}


          {/* =================================================
              ANALYSIS RESULTS
              ================================================= */}

          {analysis && (

            <section className="analysis-results">


              {/* =================================================
                  RESULT HEADER
                  ================================================= */}

              <div className="result-header">

                <div>

                  <span className="card-label">
                    ATLAS ANALYSIS
                  </span>

                  <h2>
                    Impact intelligence
                  </h2>

                </div>


                <div
                  className={`confidence ${
                    analysis.confidence === "high"
                      ? "confidence-high"
                      : "confidence-low"
                  }`}
                >

                  <span />

                  {analysis.confidence}
                  {" "}
                  confidence

                </div>

              </div>


              {/* =================================================
                  IMPACT
                  ================================================= */}

              <div className="result-card">

                <div className="result-card-title">

                  <GitBranch size={17} />

                  <span>
                    IMPACT
                  </span>

                </div>


                <div className="impact-layout">


                  {/* DIRECT */}

                  <div>

                    <label>
                      DIRECTLY AFFECTED
                    </label>


                    {directFeatures.length > 0 ? (

                      directFeatures.map(
                        (feature) => (

                          <div
                            className="feature-chip primary"
                            key={feature}
                          >
                            {feature}
                          </div>

                        )
                      )

                    ) : (

                      <span className="empty-value">
                        No direct impact identified
                      </span>

                    )}

                  </div>


                  {/* DEPENDENCIES */}

                  <div>

                    <label>
                      DEPENDENCIES
                    </label>


                    {dependentFeatures.length > 0 ? (

                      dependentFeatures.map(
                        (feature) => (

                          <div
                            className="feature-chip"
                            key={feature}
                          >
                            {feature}
                          </div>

                        )
                      )

                    ) : (

                      <span className="empty-value">
                        No dependent features
                      </span>

                    )}

                  </div>


                  {/* PLATFORMS */}

                  <div>

                    <label>
                      PLATFORMS
                    </label>


                    {impact?.affected_platforms?.length ? (

                      <div className="platform-list">

                        {impact.affected_platforms.map(
                          (platform) => (

                            <span
                              className="platform-chip"
                              key={platform}
                            >
                              {platform}
                            </span>

                          )
                        )}

                      </div>

                    ) : (

                      <span className="empty-value">
                        No platform scope identified
                      </span>

                    )}

                  </div>

                </div>

              </div>


              {/* =================================================
                  SEMANTIC EVIDENCE
                  ================================================= */}

              <div className="result-card">

                <div className="result-card-title">

                  <Search size={17} />

                  <span>
                    SEMANTIC EVIDENCE
                  </span>

                </div>


                <div className="evidence-header">

                  <span>
                    Context retrieved from the
                    product knowledge base
                  </span>


                  {retrieval?.threshold !== undefined && (

                    <span>
                      Threshold{" "}
                      {retrieval.threshold}
                    </span>

                  )}

                </div>


                <div className="evidence-list">

                  {retrieval?.matches?.map(
                    (match) => (

                      <div
                        className="evidence-row"
                        key={`${match.name}-${match.score}`}
                      >

                        <div className="evidence-main">

                          <strong>
                            {match.name}
                          </strong>


                          {match.description && (

                            <span>
                              {match.description}
                            </span>

                          )}

                        </div>


                        <div className="similarity">

                          <span>
                            {match.score.toFixed(4)}
                          </span>


                          <div className="similarity-bar">

                            <div
                              style={{
                                width: `${Math.min(
                                  match.score * 100,
                                  100
                                )}%`,
                              }}
                            />

                          </div>

                        </div>

                      </div>

                    )
                  )}


                  {!retrieval?.matches?.length && (

                    <div className="empty-result">
                      No semantic matches were returned.
                    </div>

                  )}

                </div>

              </div>


              {/* =================================================
                  REGRESSION
                  ================================================= */}

              <div className="result-card">

                <div className="result-card-title">

                  <ShieldCheck size={17} />

                  <span>
                    REGRESSION SCOPE
                  </span>


                  <span className="result-count">
                    {regressionCount} tests
                  </span>

                </div>


                <div className="regression-summary">

                  Atlas identified{" "}
                  {regressionCount} regression test
                  {regressionCount === 1
                    ? ""
                    : "s"} for this change.

                </div>


                <div className="test-list">


                  {/* =================================================
                      MUST RUN
                      ================================================= */}

                  {mustRunTests.map(
                    (test, index) => (

                      <div
                        className="test-row"
                        key={`must-${
                          test.test_id ?? index
                        }`}
                      >

                        <div className="test-id">

                          {test.test_id ??
                            "TEST"}

                        </div>


                        <div className="test-main">

                          <strong>

                            {test.name ??
                              "Unnamed test"}

                          </strong>


                          {test.platform && (

                            <span>
                              {test.platform}
                            </span>

                          )}

                        </div>


                        <div className="priority priority-p0">
                          P0
                        </div>


                        <div className="test-action">
                          MUST RUN
                        </div>

                      </div>

                    )
                  )}


                  {/* =================================================
                      RECOMMENDED
                      ================================================= */}

                  {recommendedTests.map(
                    (test, index) => (

                      <div
                        className="test-row"
                        key={`recommended-${
                          test.test_id ?? index
                        }`}
                      >

                        <div className="test-id">

                          {test.test_id ??
                            "TEST"}

                        </div>


                        <div className="test-main">

                          <strong>

                            {test.name ??
                              "Unnamed test"}

                          </strong>


                          {test.platform && (

                            <span>
                              {test.platform}
                            </span>

                          )}

                        </div>


                        <div className="priority priority-p1">
                          P1
                        </div>


                        <div className="test-action">
                          RECOMMENDED
                        </div>

                      </div>

                    )
                  )}


                  {/* =================================================
                      OPTIONAL
                      ================================================= */}

                  {optionalTests.map(
                    (test, index) => (

                      <div
                        className="test-row"
                        key={`optional-${
                          test.test_id ?? index
                        }`}
                      >

                        <div className="test-id">

                          {test.test_id ??
                            "TEST"}

                        </div>


                        <div className="test-main">

                          <strong>

                            {test.name ??
                              "Unnamed test"}

                          </strong>


                          {test.platform && (

                            <span>
                              {test.platform}
                            </span>

                          )}

                        </div>


                        <div className="priority priority-p2">
                          P2
                        </div>


                        <div className="test-action">
                          OPTIONAL
                        </div>

                      </div>

                    )
                  )}


                  {/* =================================================
                      EMPTY REGRESSION
                      ================================================= */}

                  {regressionCount === 0 && (

                    <div className="empty-result">

                      Atlas did not recommend any
                      regression tests.

                    </div>

                  )}

                </div>

              </div>


              {/* =================================================
                  QA REVIEW
                  ================================================= */}

              <div className="qa-review">

                <div>

                  <span className="card-label">
                    QA REVIEW
                  </span>


                  <h2>
                    Review Atlas's recommendation
                  </h2>


                  <p>
                    Atlas provides evidence and
                    recommendations. The QA engineer
                    remains in control.
                  </p>

                </div>


                <div className="review-actions">

                  <button className="review-button secondary">
                    Modify
                  </button>


                  <button className="review-button secondary">
                    Reject
                  </button>


                  <button className="review-button primary">

                    <CheckCircle2 size={15} />

                    Accept Scope

                  </button>

                </div>

              </div>

            </section>

          )}


          {/* =================================================
              FOOTER
              ================================================= */}

          <div className="footer-note">

            <span className="status-dot" />

            Atlas deterministic engine connected

            <span className="footer-separator">
              •
            </span>

            Semantic retrieval enabled

            <span className="footer-separator">
              •
            </span>

            {analysis
              ? "Live Atlas analysis"
              : "LLM reasoning coming next"}

          </div>

        </div>

      </main>

    </div>
  );
}

export default App;