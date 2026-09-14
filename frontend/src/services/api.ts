const API_BASE_URL = "http://127.0.0.1:8000";

export interface TestRecommendation {
  test_id: string;
  test_name: string;
  feature: string;
  platform: string;
  original_priority: string;
  classification: string;
  recommendation: string;
  priority: string;
  reason: string;
}

export interface RegressionSummary {
  total_recommended: number;
  must_run: number;
  recommended: number;
  optional: number;
}

export interface RegressionResult {
  summary: RegressionSummary;
  recommendations: TestRecommendation[];
}

export interface RetrievalMatch {
  type: string;
  id: string;
  name: string;
  score: number;
  matched_context?: string;
  evidence?: {
    source: string;
    entity_id: string;
  };
}

export interface AnalyzeResponse {
  change: string;

  impact: {
    directly_affected_features: string[];
    affected_features: string[];
    platform_scope: string[];
    affected_platforms: string[];
  };

  regression: RegressionResult;

  confidence: string;

  explanation: string[];

  retrieval?: {
    method?: string;
    threshold?: number;
    matches?: RetrievalMatch[];
  };

  graph?: {
    node_count: number;
    relationship_count: number;
  };

  evidence?: {
    product_context: string;
    features: string;
    test_cases: string;
  };
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