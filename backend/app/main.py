from fastapi import FastAPI
from pydantic import BaseModel

from atlas.engine import (
    analyze_change,
    build_graph,
    load_context,
)


app = FastAPI(
    title="Pontoon API",
    description="The AI Operating System for Quality Engineering",
    version="0.2.0",
)


class ChangeRequest(BaseModel):
    change: str


@app.get("/")
def root():
    return {
        "message": "Welcome to Pontoon",
        "status": "running",
        "version": "0.2.0",
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "pontoon-api",
        "version": "0.2.0",
    }


@app.get("/api/context")
def context():

    data = load_context()
    graph = build_graph(data)

    return {
        "project": data["product"]["project"],
        "platforms": data["product"]["platforms"],
        "graph": graph,
    }


@app.post("/api/analyze")
def analyze(request: ChangeRequest):

    return analyze_change(request.change)