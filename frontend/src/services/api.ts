const API_BASE_URL = "http://127.0.0.1:8000";

export interface TestRecommendation {
  test_id: string;
  name: string;
  priority?: string;
  action?: string;
  platform?: string;
}

export interface RegressionSummary {
  total_recommended: number;
  must_run: TestRecommendation[];
  recommended: TestRecommendation[];
  optional: TestRecommendation[];
}

export interface AnalyzeResponse {
  confidence: string;

  impact: {
    directly_affected_features: string[];
    affected_features: string[];
    platform_scope: string[];
    affected_platforms: string[];
  };

  regression: {
    summary: RegressionSummary;
  };

  retrieval?: {
    method?: string;
    threshold?: number;
    matches?: Array<{
      name: string;
      score: number;
      description?: string;
      type?: string;
    }>;
  };

  evidence?: Record<string, unknown>;

  graph?: Record<string, unknown>;

  [key: string]: unknown;
}

export async function analyzeChange(
  change: string
): Promise<AnalyzeResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/analyze`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        change,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Atlas analysis failed (${response.status}): ${errorText}`
    );
  }

  return response.json();
}