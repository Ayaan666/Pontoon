import json
from pathlib import Path
from typing import Dict, List, Set


# =========================================================
# DATA LOCATION
# =========================================================

DATA_DIR = Path(__file__).resolve().parents[2] / "data"


# =========================================================
# DATA LOADING
# =========================================================

def load_json(filename: str):
    path = DATA_DIR / filename

    with open(path, "r", encoding="utf-8") as file:
        return json.load(file)


def load_context() -> Dict:
    return {
        "product": load_json("product_context.json"),
        "features": load_json("features.json"),
        "tests": load_json("test_cases.json"),
    }


# =========================================================
# TEXT NORMALIZATION
# =========================================================

def normalize(text: str) -> str:
    return (
        text.lower()
        .replace("-", " ")
        .replace("_", " ")
    )


# =========================================================
# CONTEXT GRAPH
# =========================================================

def build_graph(context: Dict) -> Dict:
    nodes = []
    relationships = []

    product = context["product"]
    features = context["features"]
    tests = context["tests"]

    # -----------------------------------------------------
    # Project
    # -----------------------------------------------------

    nodes.append({
        "id": "PROJECT-001",
        "type": "project",
        "name": product["project"],
    })

    # -----------------------------------------------------
    # Platforms
    # -----------------------------------------------------

    for platform in product["platforms"]:

        nodes.append({
            "id": (
                "PLATFORM-"
                + normalize(platform).replace(" ", "-")
            ),
            "type": "platform",
            "name": platform,
        })

    # -----------------------------------------------------
    # Feature map
    # -----------------------------------------------------

    feature_map = {
        feature["name"]: feature
        for feature in features
    }

    # -----------------------------------------------------
    # Feature nodes + relationships
    # -----------------------------------------------------

    for feature in features:

        feature_id = feature["id"]
        feature_name = feature["name"]

        nodes.append({
            "id": feature_id,
            "type": "feature",
            "name": feature_name,
        })

        # Feature -> platform

        for platform in feature.get("platforms", []):

            platform_id = (
                "PLATFORM-"
                + normalize(platform).replace(" ", "-")
            )

            relationships.append({
                "from": feature_id,
                "to": platform_id,
                "type": "SUPPORTED_ON",
                "evidence": {
                    "source": "features.json",
                    "field": "platforms",
                },
            })

        # Feature -> dependency

        for dependency in feature.get(
            "depends_on",
            []
        ):

            dependency_feature = feature_map.get(
                dependency
            )

            if dependency_feature:

                relationships.append({
                    "from": feature_id,
                    "to": dependency_feature["id"],
                    "type": "DEPENDS_ON",
                    "evidence": {
                        "source": "features.json",
                        "field": "depends_on",
                    },
                })

    # -----------------------------------------------------
    # Test nodes + relationships
    # -----------------------------------------------------

    for test in tests:

        test_id = test["id"]

        nodes.append({
            "id": test_id,
            "type": "test_case",
            "name": test["name"],
            "priority": test["priority"],
        })

        feature = feature_map.get(
            test["feature"]
        )

        if feature:

            relationships.append({
                "from": test_id,
                "to": feature["id"],
                "type": "COVERS_FEATURE",
                "evidence": {
                    "source": "test_cases.json",
                    "field": "feature",
                },
            })

    return {
        "nodes": nodes,
        "relationships": relationships,
    }


# =========================================================
# FEATURE DETECTION
# =========================================================

def find_affected_features(
    change: str,
    features: List[Dict]
) -> Set[str]:

    change_text = normalize(change)

    keyword_map = {

        # Payment
        "payment": "Payment Authorization",
        "biometric": "Payment Authorization",
        "face id": "Payment Authorization",
        "fingerprint": "Payment Authorization",

        # Authentication
        "authentication": "Authentication",
        "authenticate": "Authentication",
        "login": "Authentication",
        "sign in": "Authentication",

        # Session
        "session": "Session Management",

        # Retry
        "retry": "Payment Retry",

        # Orders
        "order": "Order Creation",
        "checkout": "Order Creation",

        # Notifications
        "notification": "Notifications",
        "push notification": "Notifications",

        # Profile
        "profile": "User Profile",
        "avatar": "User Profile",

        # Reporting
        "report": "Reporting",
        "dashboard": "Reporting",
    }

    affected = set()

    for keyword, feature_name in keyword_map.items():

        if keyword in change_text:
            affected.add(feature_name)

    available_features = {
        feature["name"]
        for feature in features
    }

    return {
        feature
        for feature in affected
        if feature in available_features
    }


# =========================================================
# PLATFORM SCOPE
# =========================================================

def detect_platform_scope(
    change: str
) -> Set[str]:

    change_text = normalize(change)

    platforms = set()

    # Mobile

    if "mobile" in change_text:

        platforms.update({
            "iOS",
            "Android",
        })

    # iOS

    if (
        "ios" in change_text
        or "iphone" in change_text
        or "ipad" in change_text
    ):

        platforms.add("iOS")

    # Android

    if "android" in change_text:

        platforms.add("Android")

    # Web

    if (
        "web" in change_text
        or "browser" in change_text
    ):

        platforms.add("Web")

    # REST API

    if (
        "api" in change_text
        or "rest api" in change_text
        or "backend api" in change_text
    ):

        platforms.add("REST API")

    return platforms


# =========================================================
# DEPENDENCY TRAVERSAL
# =========================================================

def expand_dependencies(
    affected: Set[str],
    features: List[Dict]
) -> Set[str]:

    feature_map = {
        feature["name"]: feature
        for feature in features
    }

    expanded = set(affected)

    changed = True

    while changed:

        changed = False

        for feature_name in list(expanded):

            feature = feature_map.get(
                feature_name
            )

            if not feature:
                continue

            for dependency in feature.get(
                "depends_on",
                []
            ):

                if dependency not in expanded:

                    expanded.add(dependency)
                    changed = True

    return expanded


# =========================================================
# FEATURE CLASSIFICATION
# =========================================================

def classify_feature(
    feature: str,
    directly_affected: Set[str]
) -> str:

    if feature in directly_affected:
        return "DIRECT"

    return "DEPENDENCY"


# =========================================================
# PRIORITY CALCULATION
# =========================================================

def calculate_priority(
    classification: str,
    test_priority: str
) -> str:

    # Direct critical tests are mandatory.

    if (
        classification == "DIRECT"
        and test_priority == "Critical"
    ):

        return "P0"

    # Direct high-priority tests.

    if (
        classification == "DIRECT"
        and test_priority == "High"
    ):

        return "P1"

    # Dependency critical tests.

    if (
        classification == "DEPENDENCY"
        and test_priority == "Critical"
    ):

        return "P1"

    # Everything else.

    return "P2"


# =========================================================
# REGRESSION RECOMMENDATION
# =========================================================

def build_regression_recommendation(
    affected_features: Set[str],
    directly_affected: Set[str],
    tests: List[Dict],
    platform_scope: Set[str]
) -> List[Dict]:

    recommendations = []

    for test in tests:

        feature = test.get("feature")
        platform = test.get("platform")

        # -------------------------------------------------
        # Ignore unrelated features
        # -------------------------------------------------

        if feature not in affected_features:
            continue

        # -------------------------------------------------
        # Apply explicit platform scope
        # -------------------------------------------------

        if (
            platform_scope
            and platform not in platform_scope
        ):
            continue

        # -------------------------------------------------
        # Classify impact
        # -------------------------------------------------

        classification = classify_feature(
            feature,
            directly_affected
        )

        priority = calculate_priority(
            classification,
            test.get("priority", "Medium")
        )

        # -------------------------------------------------
        # Build human-readable reason
        # -------------------------------------------------

        if classification == "DIRECT":

            reason = (
                f"Test directly covers the changed "
                f"feature '{feature}'."
            )

        else:

            reason = (
                f"Test covers dependency feature "
                f"'{feature}' in the impacted flow."
            )

        recommendations.append({

            "test_id":
                test["id"],

            "test_name":
                test["name"],

            "feature":
                feature,

            "platform":
                platform,

            "original_priority":
                test["priority"],

            "classification":
                classification,

            "recommendation":
                "MUST_RUN"
                if priority == "P0"
                else "RECOMMENDED"
                if priority == "P1"
                else "OPTIONAL",

            "priority":
                priority,

            "reason":
                reason,
        })

    # -----------------------------------------------------
    # Sort:
    #
    # P0 first
    # P1 second
    # P2 last
    # -----------------------------------------------------

    priority_order = {
        "P0": 0,
        "P1": 1,
        "P2": 2,
    }

    recommendations.sort(
        key=lambda item: (
            priority_order.get(
                item["priority"],
                99
            ),
            item["test_id"],
        )
    )

    return recommendations


# =========================================================
# EXPLANATION
# =========================================================

def build_explanation(
    directly_affected: Set[str],
    affected_features: Set[str],
    platform_scope: Set[str],
    recommendations: List[Dict]
) -> List[str]:

    explanation = []

    # Direct impact

    for feature in sorted(
        directly_affected
    ):

        explanation.append(
            f"'{feature}' was directly identified "
            f"from the change."
        )

    # Dependency impact

    dependencies = (
        affected_features
        - directly_affected
    )

    for feature in sorted(
        dependencies
    ):

        explanation.append(
            f"'{feature}' was included because "
            f"it is a dependency of an affected feature."
        )

    # Platform scope

    if platform_scope:

        explanation.append(
            "The change explicitly targets: "
            + ", ".join(
                sorted(platform_scope)
            )
            + "."
        )

    else:

        explanation.append(
            "No explicit platform scope was detected; "
            "all supported platforms remain in scope."
        )

    # Regression counts

    must_run = sum(
        1
        for item in recommendations
        if item["priority"] == "P0"
    )

    recommended = sum(
        1
        for item in recommendations
        if item["priority"] == "P1"
    )

    optional = sum(
        1
        for item in recommendations
        if item["priority"] == "P2"
    )

    explanation.append(
        f"Regression recommendation: "
        f"{must_run} must-run, "
        f"{recommended} recommended, "
        f"{optional} optional."
    )

    return explanation


# =========================================================
# MAIN ANALYSIS
# =========================================================

def analyze_change(
    change: str
) -> Dict:

    # -----------------------------------------------------
    # Load project context
    # -----------------------------------------------------

    context = load_context()

    features = context["features"]
    tests = context["tests"]

    # -----------------------------------------------------
    # Build graph
    # -----------------------------------------------------

    graph = build_graph(
        context
    )

    # -----------------------------------------------------
    # Identify direct impact
    # -----------------------------------------------------

    directly_affected = find_affected_features(
        change,
        features
    )

    # -----------------------------------------------------
    # Expand dependencies
    # -----------------------------------------------------

    affected_features = expand_dependencies(
        directly_affected,
        features
    )

    # -----------------------------------------------------
    # Detect platform scope
    # -----------------------------------------------------

    platform_scope = detect_platform_scope(
        change
    )

    # -----------------------------------------------------
    # Build recommendations
    # -----------------------------------------------------

    recommendations = build_regression_recommendation(
        affected_features,
        directly_affected,
        tests,
        platform_scope
    )

    # -----------------------------------------------------
    # Platforms represented by recommendations
    # -----------------------------------------------------

    affected_platforms = sorted({
        item["platform"]
        for item in recommendations
        if item.get("platform")
    })

    # -----------------------------------------------------
    # Confidence
    # -----------------------------------------------------

    confidence = (
        "high"
        if directly_affected
        else "low"
    )

    # -----------------------------------------------------
    # Explanation
    # -----------------------------------------------------

    explanation = build_explanation(
        directly_affected,
        affected_features,
        platform_scope,
        recommendations
    )

    # -----------------------------------------------------
    # Summary
    # -----------------------------------------------------

    summary = {

        "total_recommended":
            len(recommendations),

        "must_run":
            sum(
                1
                for item in recommendations
                if item["priority"] == "P0"
            ),

        "recommended":
            sum(
                1
                for item in recommendations
                if item["priority"] == "P1"
            ),

        "optional":
            sum(
                1
                for item in recommendations
                if item["priority"] == "P2"
            ),
    }

    # -----------------------------------------------------
    # Return result
    # -----------------------------------------------------

    return {

        "change":
            change,

        "impact": {

            "directly_affected_features":
                sorted(directly_affected),

            "affected_features":
                sorted(affected_features),

            "platform_scope":
                sorted(platform_scope),

            "affected_platforms":
                affected_platforms,
        },

        "regression": {

            "summary":
                summary,

            "recommendations":
                recommendations,
        },

        "confidence":
            confidence,

        "explanation":
            explanation,

        "graph": {

            "node_count":
                len(graph["nodes"]),

            "relationship_count":
                len(graph["relationships"]),
        },

        "evidence": {

            "product_context":
                "product_context.json",

            "features":
                "features.json",

            "test_cases":
                "test_cases.json",
        },
    }