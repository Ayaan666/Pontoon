import json
import os
from typing import Dict

from openai import OpenAI


# =========================================================
# CONFIGURATION
# =========================================================

MODEL_NAME = "gpt-5.6-sol"


# =========================================================
# CLIENT
# =========================================================

def get_client() -> OpenAI:
    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        raise RuntimeError(
            "OPENAI_API_KEY environment variable is not configured."
        )

    return OpenAI(api_key=api_key)


# =========================================================
# REASONING SCHEMA
# =========================================================

REASONING_SCHEMA = {
    "type": "object",
    "properties": {
        "summary": {
            "type": "string"
        },
        "impact_reasoning": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "risk_areas": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "qa_focus": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "ambiguities": {
            "type": "array",
            "items": {
                "type": "string"
            }
        }
    },
    "required": [
        "summary",
        "impact_reasoning",
        "risk_areas",
        "qa_focus",
        "ambiguities"
    ],
    "additionalProperties": False
}


# =========================================================
# SYSTEM INSTRUCTIONS
# =========================================================

SYSTEM_INSTRUCTIONS = """
You are the reasoning layer of Pontoon, an AI operating system
for Quality Engineering.

Your job is to reason over evidence supplied by Atlas.

IMPORTANT RULES:

1. Do not invent product features, dependencies, platforms,
   tests, requirements, or system behavior.

2. Treat the supplied Atlas evidence as the source of truth.

3. Do not decide which regression tests should run.
   Atlas's deterministic regression engine owns that decision.

4. Explain WHY the supplied affected features matter.

5. Identify QA risk areas that are logically supported by
   the supplied change and evidence.

6. Identify ambiguities or assumptions when the evidence
   does not fully establish something.

7. If evidence is weak or ambiguous, say so explicitly.

8. Do not claim certainty beyond the supplied evidence.

9. Keep the reasoning useful to an experienced QA engineer.

10. Your output must strictly follow the supplied JSON schema.
"""


# =========================================================
# EVIDENCE PREPARATION
# =========================================================

def build_reasoning_input(
    change: str,
    analysis: Dict
) -> Dict:

    return {
        "change": change,

        "impact": {
            "directly_affected_features":
                analysis["impact"]["directly_affected_features"],

            "affected_features":
                analysis["impact"]["affected_features"],

            "platform_scope":
                analysis["impact"]["platform_scope"],

            "affected_platforms":
                analysis["impact"]["affected_platforms"],
        },

        "retrieval": analysis.get(
            "retrieval",
            {}
        ),

        "regression": {
            "summary":
                analysis["regression"]["summary"],

            "recommendations":
                analysis["regression"]["recommendations"],
        },

        "graph": analysis.get(
            "graph",
            {}
        ),

        "evidence": analysis.get(
            "evidence",
            {}
        )
    }


# =========================================================
# LLM REASONING
# =========================================================

def reason_about_change(
    change: str,
    analysis: Dict
) -> Dict:

    client = get_client()

    evidence = build_reasoning_input(
        change,
        analysis
    )

    response = client.responses.create(
        model=MODEL_NAME,

        reasoning={
            "effort": "medium"
        },

        instructions=SYSTEM_INSTRUCTIONS,

        input=[
            {
                "role": "user",
                "content": (
                    "Analyze the following Atlas evidence.\n\n"
                    + json.dumps(
                        evidence,
                        indent=2
                    )
                )
            }
        ],

        text={
            "format": {
                "type": "json_schema",
                "name": "atlas_reasoning",
                "strict": True,
                "schema": REASONING_SCHEMA
            }
        }
    )

    return json.loads(
        response.output_text
    )