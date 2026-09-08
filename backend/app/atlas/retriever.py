from typing import Dict, List
from sentence_transformers import SentenceTransformer
import numpy as np


# =========================================================
# MODEL
# =========================================================

MODEL_NAME = "all-MiniLM-L6-v2"

_model = None


def get_model():
    """
    Load the embedding model once and reuse it.
    """
    global _model

    if _model is None:
        _model = SentenceTransformer(MODEL_NAME)

    return _model


# =========================================================
# DOCUMENT REPRESENTATION
# =========================================================

def build_document_text(item: Dict, item_type: str) -> str:

    if item_type == "feature":

        return " ".join([
            item.get("name", ""),
            item.get("description", ""),
            "Supported platforms: "
            + ", ".join(item.get("platforms", [])),
            "Dependencies: "
            + ", ".join(item.get("depends_on", [])),
        ])

    if item_type == "test":

        return " ".join([
            item.get("name", ""),
            item.get("description", ""),
            "Feature: " + item.get("feature", ""),
            "Platform: " + item.get("platform", ""),
            "Priority: " + item.get("priority", ""),
        ])

    if item_type == "product":

        return " ".join([
            item.get("project", ""),
            item.get("description", ""),
            "Platforms: "
            + ", ".join(item.get("platforms", [])),
        ])

    return ""


# =========================================================
# EMBEDDING SIMILARITY
# =========================================================

def calculate_similarity(
    query_embedding,
    document_embeddings
):

    return np.dot(
        document_embeddings,
        query_embedding
    )


# =========================================================
# SEMANTIC RETRIEVAL
# =========================================================

def retrieve_context(
    query: str,
    context: Dict,
    top_k: int = 10
) -> Dict:

    model = get_model()

    feature_documents = []
    test_documents = []

    # ---------------------------------------------------------
    # Feature documents
    # ---------------------------------------------------------

    for feature in context.get("features", []):

        feature_documents.append({
            "type": "feature",
            "id": feature.get("id"),
            "name": feature.get("name"),
            "text": build_document_text(
                feature,
                "feature"
            ),
            "evidence": {
                "source": "features.json",
                "entity_id": feature.get("id")
            }
        })

    # ---------------------------------------------------------
    # Test documents
    # ---------------------------------------------------------

    for test in context.get("tests", []):

        test_documents.append({
            "type": "test_case",
            "id": test.get("id"),
            "name": test.get("name"),
            "text": build_document_text(
                test,
                "test"
            ),
            "evidence": {
                "source": "test_cases.json",
                "entity_id": test.get("id")
            }
        })

    # ---------------------------------------------------------
    # Nothing to search
    # ---------------------------------------------------------

    if not feature_documents and not test_documents:

        return {
            "features": [],
            "tests": []
        }

    # ---------------------------------------------------------
    # Query embedding
    # ---------------------------------------------------------

    query_embedding = model.encode(
        query,
        normalize_embeddings=True
    )

    # =========================================================
    # FEATURE RETRIEVAL
    # =========================================================

    feature_results = []

    if feature_documents:

        feature_embeddings = model.encode(
            [
                document["text"]
                for document in feature_documents
            ],
            normalize_embeddings=True
        )

        feature_scores = calculate_similarity(
            query_embedding,
            feature_embeddings
        )

        feature_indexes = np.argsort(
            feature_scores
        )[::-1]

        for index in feature_indexes[:top_k]:

            document = feature_documents[index]

            feature_results.append({
                "type": document["type"],
                "id": document["id"],
                "name": document["name"],
                "score": round(
                    float(feature_scores[index]),
                    4
                ),
                "matched_context": document["text"],
                "evidence": document["evidence"]
            })

    # =========================================================
    # TEST RETRIEVAL
    # =========================================================

    test_results = []

    if test_documents:

        test_embeddings = model.encode(
            [
                document["text"]
                for document in test_documents
            ],
            normalize_embeddings=True
        )

        test_scores = calculate_similarity(
            query_embedding,
            test_embeddings
        )

        test_indexes = np.argsort(
            test_scores
        )[::-1]

        for index in test_indexes[:top_k]:

            document = test_documents[index]

            test_results.append({
                "type": document["type"],
                "id": document["id"],
                "name": document["name"],
                "score": round(
                    float(test_scores[index]),
                    4
                ),
                "matched_context": document["text"],
                "evidence": document["evidence"]
            })

    # ---------------------------------------------------------
    # Return separated retrieval results
    # ---------------------------------------------------------

    return {
        "features": feature_results,
        "tests": test_results
    }