from fastapi import FastAPI
from pydantic import BaseModel

from atlas.engine import (
    analyze_change,
    build_graph,
    load_context,
)

from atlas.retriever import retrieve_context


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="Pontoon API",
    description="The AI Operating System for Quality Engineering",
    version="0.4.0",
)


# =========================================================
# REQUEST MODELS
# =========================================================

class ChangeRequest(BaseModel):
    change: str


class ContextSearchRequest(BaseModel):
    query: str
    top_k: int = 5


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():

    return {
        "message": "Welcome to Pontoon",
        "status": "running",
        "version": "0.4.0",
    }


# =========================================================
# HEALTH
# =========================================================

@app.get("/health")
def health():

    return {
        "status": "ok",
        "service": "pontoon-api",
        "version": "0.4.0",
    }


# =========================================================
# PRODUCT CONTEXT
# =========================================================

@app.get("/api/context")
def context():

    data = load_context()
    graph = build_graph(data)

    return {
        "project": data["product"]["project"],
        "platforms": data["product"]["platforms"],
        "graph": graph,
    }


# =========================================================
# SEMANTIC CONTEXT SEARCH
# =========================================================

@app.post("/api/context/search")
def search_context(
    request: ContextSearchRequest
):

    data = load_context()

    results = retrieve_context(
        query=request.query,
        context=data,
        top_k=request.top_k,
    )

    return {
        "query": request.query,
        "features": results["features"],
        "tests": results["tests"],
    }


# =========================================================
# CHANGE ANALYSIS
# =========================================================

@app.post("/api/analyze")
def analyze(
    request: ChangeRequest
):

    return analyze_change(
        request.change
    )