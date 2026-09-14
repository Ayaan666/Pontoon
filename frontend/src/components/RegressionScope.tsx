import {
  ShieldCheck,
} from "lucide-react";

import type {
  TestRecommendation,
} from "../services/api";

interface RegressionScopeProps {
  recommendations: TestRecommendation[];
  totalRecommended: number;
}

function RegressionScope({
  recommendations,
  totalRecommended,
}: RegressionScopeProps) {
  const mustRunTests =
    recommendations.filter(
      (test) =>
        test.recommendation === "MUST_RUN"
    );

  const recommendedTests =
    recommendations.filter(
      (test) =>
        test.recommendation === "RECOMMENDED"
    );

  const optionalTests =
    recommendations.filter(
      (test) =>
        test.recommendation === "OPTIONAL"
    );

  function renderTest(
    test: TestRecommendation,
    index: number,
    type: "must" | "recommended" | "optional"
  ) {
    const priorityClass =
      type === "must"
        ? "priority-p0"
        : type === "recommended"
          ? "priority-p1"
          : "priority-p2";

    const actionLabel =
      type === "must"
        ? "MUST RUN"
        : type === "recommended"
          ? "RECOMMENDED"
          : "OPTIONAL";

    return (
      <div
        className="test-row"
        key={`${type}-${test.test_id}-${index}`}
      >

        <div className="test-id">
          {test.test_id}
        </div>

        <div className="test-main">

          <strong>
            {test.test_name}
          </strong>

          <span>
            {test.feature} · {test.platform}
          </span>

        </div>

        <div
          className={`priority ${priorityClass}`}
        >
          {test.priority}
        </div>

        <div className="test-action">
          {actionLabel}
        </div>

      </div>
    );
  }

  return (
    <div className="result-card">

      <div className="result-card-title">

        <ShieldCheck size={17} />

        <span>
          REGRESSION SCOPE
        </span>

        <span className="result-count">
          {totalRecommended} tests
        </span>

      </div>


      <div className="regression-summary">

        Atlas identified{" "}
        {totalRecommended} regression test
        {totalRecommended === 1
          ? ""
          : "s"} for this change.

      </div>


      <div className="test-list">

        {mustRunTests.map(
          (test, index) =>
            renderTest(
              test,
              index,
              "must"
            )
        )}


        {recommendedTests.map(
          (test, index) =>
            renderTest(
              test,
              index,
              "recommended"
            )
        )}


        {optionalTests.map(
          (test, index) =>
            renderTest(
              test,
              index,
              "optional"
            )
        )}


        {recommendations.length === 0 && (

          <div className="empty-result">

            Atlas did not recommend any
            regression tests.

          </div>

        )}

      </div>

    </div>
  );
}

export default RegressionScope;