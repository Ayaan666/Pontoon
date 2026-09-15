import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

interface AIReasoningData {
  summary: string;

  impact_reasoning: string[];

  risk_areas: string[];

  qa_focus: string[];

  ambiguities: string[];
}

interface AIReasoningProps {
  reasoning: AIReasoningData | null;
  loading?: boolean;
}

function AIReasoning({
  reasoning,
  loading = false,
}: AIReasoningProps) {

  if (loading) {
    return (
      <div className="ai-reasoning-card">

        <div className="ai-header">

          <div className="ai-title">

            <div className="ai-icon">
              <Brain size={18} />
            </div>

            <div>

              <span className="card-label">
                GPT-5.6 SOL
              </span>

              <h2>
                AI reasoning
              </h2>

            </div>

          </div>

          <span className="ai-status">
            Analyzing evidence...
          </span>

        </div>


        <div className="ai-loading">

          <div className="skeleton-line large" />
          <div className="skeleton-line" />
          <div className="skeleton-line short" />

        </div>

      </div>
    );
  }


  if (!reasoning) {
    return (
      <div className="ai-reasoning-card ai-empty">

        <div className="ai-header">

          <div className="ai-title">

            <div className="ai-icon">
              <Brain size={18} />
            </div>

            <div>

              <span className="card-label">
                AI REASONING
              </span>

              <h2>
                Evidence-backed reasoning
              </h2>

            </div>

          </div>

        </div>


        <p>
          Atlas analysis is complete. AI reasoning
          will appear here once the reasoning layer
          is available.
        </p>

      </div>
    );
  }


  return (
    <div className="ai-reasoning-card">


      {/* HEADER */}

      <div className="ai-header">

        <div className="ai-title">

          <div className="ai-icon">
            <Brain size={18} />
          </div>

          <div>

            <span className="card-label">
              GPT-5.6 SOL
            </span>

            <h2>
              AI reasoning
            </h2>

          </div>

        </div>


        <span className="ai-status live">

          <span className="status-dot" />

          Evidence-backed

        </span>

      </div>


      {/* SUMMARY */}

      <div className="ai-summary">

        <span className="ai-section-label">
          SUMMARY
        </span>

        <p>
          {reasoning.summary}
        </p>

      </div>


      {/* WHY IMPACTED */}

      <div className="ai-section">

        <div className="ai-section-heading">

          <CheckCircle2 size={16} />

          WHY THIS CHANGE MATTERS

        </div>


        <div className="ai-list">

          {reasoning.impact_reasoning.map(
            (item, index) => (

              <div
                className="ai-list-item"
                key={index}
              >

                <span className="bullet" />

                <span>
                  {item}
                </span>

              </div>

            )
          )}

        </div>

      </div>


      {/* RISK AREAS */}

      <div className="ai-section">

        <div className="ai-section-heading risk">

          <ShieldAlert size={16} />

          RISK AREAS

        </div>


        <div className="ai-list">

          {reasoning.risk_areas.map(
            (item, index) => (

              <div
                className="ai-list-item"
                key={index}
              >

                <span className="bullet risk-bullet" />

                <span>
                  {item}
                </span>

              </div>

            )
          )}

        </div>

      </div>


      {/* QA FOCUS */}

      <div className="ai-section">

        <div className="ai-section-heading">

          <CheckCircle2 size={16} />

          QA FOCUS

        </div>


        <div className="ai-focus-grid">

          {reasoning.qa_focus.map(
            (item, index) => (

              <div
                className="ai-focus-item"
                key={index}
              >

                <span>
                  {index + 1}
                </span>

                <p>
                  {item}
                </p>

              </div>

            )
          )}

        </div>

      </div>


      {/* AMBIGUITIES */}

      {reasoning.ambiguities.length > 0 && (

        <div className="ai-section ambiguity">

          <div className="ai-section-heading">

            <AlertTriangle size={16} />

            AMBIGUITIES / ASSUMPTIONS

          </div>


          <div className="ai-list">

            {reasoning.ambiguities.map(
              (item, index) => (

                <div
                  className="ai-list-item"
                  key={index}
                >

                  <span className="bullet" />

                  <span>
                    {item}
                  </span>

                </div>

              )
            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default AIReasoning;