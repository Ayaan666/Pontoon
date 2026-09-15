from atlas.engine import analyze_change
from atlas.reasoner import reason_about_change
change = "Add biometric confirmation before a customer pays on an iPhone."

print("\nRunning Atlas analysis...\n")

analysis = analyze_change(change)

print("Atlas analysis complete.")
print("Confidence:", analysis["confidence"])
print(
    "Affected features:",
    analysis["impact"]["affected_features"]
)

print("\nRunning LLM reasoning...\n")

reasoning = reason_about_change(
    change,
    analysis
)

print("\n===== LLM REASONING =====\n")

print("SUMMARY:")
print(reasoning["summary"])

print("\nIMPACT REASONING:")
for item in reasoning["impact_reasoning"]:
    print("-", item)

print("\nRISK AREAS:")
for item in reasoning["risk_areas"]:
    print("-", item)

print("\nQA FOCUS:")
for item in reasoning["qa_focus"]:
    print("-", item)

print("\nAMBIGUITIES:")
for item in reasoning["ambiguities"]:
    print("-", item)