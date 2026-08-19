# -*- coding: utf-8 -*-
"""Cell definitions, part 3: Tasks 4-6."""

from _cells_part1 import md, code

md(r'''
## Task 4 — Classification on Imbalanced Data

**Which class counts as the "positive" one?** The label column is `Recommended IND`, exactly
as specified. But the *event the business cares about* is the minority class — the customer
who would **not** recommend. Every precision / recall / F1 number in Tasks 4 and 5 is therefore
computed with respect to **class 0**, and a "false negative" means *a genuinely dissatisfied
customer we failed to flag*. Accuracy and ROC-AUC are class-symmetric and unaffected by that choice.

Five rows are compared: a majority-class baseline, plus Logistic Regression and Random Forest,
each trained twice — once with `class_weight='balanced'` and once with default weighting.
''')

code(r'''
# The event of interest is "would NOT recommend" = class 0.
POS_LABEL = 0
y_val_event = (y_val == POS_LABEL).astype(int)
y_train_event = (y_train == POS_LABEL).astype(int)

print(f"Validation set: {y_val_event.sum():,} 'would not recommend' out of "
      f"{len(y_val_event):,} reviews ({y_val_event.mean():.2%})")


def event_proba(model, X):
    """P(would NOT recommend) for a fitted classifier."""
    col = list(model.classes_).index(POS_LABEL)
    return model.predict_proba(X)[:, col]


def evaluate(name, model, X=None):
    """Accuracy plus class-0 precision/recall/F1 and ROC-AUC on the validation split."""
    X = X_val if X is None else X
    y_pred = model.predict(X)
    proba = event_proba(model, X)
    return {
        "Model": name,
        "Accuracy": accuracy_score(y_val, y_pred),
        "Precision (class 0)": precision_score(y_val, y_pred, pos_label=POS_LABEL, zero_division=0),
        "Recall (class 0)": recall_score(y_val, y_pred, pos_label=POS_LABEL, zero_division=0),
        "F1 (class 0)": f1_score(y_val, y_pred, pos_label=POS_LABEL, zero_division=0),
        "ROC-AUC": roc_auc_score(y_val_event, proba),
    }
''')

code(r'''
# --- 4.1 Baseline: always predict the majority class ------------------------
baseline = DummyClassifier(strategy="most_frequent", random_state=RANDOM_STATE)
baseline.fit(X_train, y_train)

baseline_pred = baseline.predict(X_val)
baseline_acc = accuracy_score(y_val, baseline_pred)

print(f"Baseline always predicts class {baseline.predict(X_val[:1])[0]} ('would recommend').")
print(f"Baseline accuracy : {baseline_acc:.4f}  ({baseline_acc:.2%})")
print(f"Baseline recall on class 0 : "
      f"{recall_score(y_val, baseline_pred, pos_label=0, zero_division=0):.4f}")
print("\nIt never once flags a dissatisfied customer - the entire point of the exercise.")

baseline_row = {
    "Model": "Baseline (majority class)",
    "Accuracy": baseline_acc,
    "Precision (class 0)": precision_score(y_val, baseline_pred, pos_label=0, zero_division=0),
    "Recall (class 0)": recall_score(y_val, baseline_pred, pos_label=0, zero_division=0),
    "F1 (class 0)": f1_score(y_val, baseline_pred, pos_label=0, zero_division=0),
    "ROC-AUC": 0.5,
}
''')

code(r'''
# --- 4.2 Four models: {LogReg, RandomForest} x {balanced, default} ----------
models = {
    "Logistic Regression (balanced)": LogisticRegression(
        class_weight="balanced", max_iter=1000, random_state=RANDOM_STATE),
    "Logistic Regression (default)": LogisticRegression(
        max_iter=1000, random_state=RANDOM_STATE),
    "Random Forest (balanced)": RandomForestClassifier(
        class_weight="balanced", n_estimators=200, random_state=RANDOM_STATE, n_jobs=-1),
    "Random Forest (default)": RandomForestClassifier(
        n_estimators=200, random_state=RANDOM_STATE, n_jobs=-1),
}

fitted = {}
rows = [baseline_row]
for name, model in models.items():
    model.fit(X_train, y_train)
    fitted[name] = model
    rows.append(evaluate(name, model))
    print(f"trained: {name}")
''')

code(r'''
# --- 4.3 Comparison table ---------------------------------------------------
comparison = pd.DataFrame(rows).set_index("Model").round(4)

print("Task 4 - baseline vs. all four models (validation split, n = "
      f"{len(y_val):,}):\n")
display(comparison.style.format("{:.4f}")
        .background_gradient(subset=["F1 (class 0)"], cmap="Blues"))

print("\nPlain table:\n")
print(comparison.to_string())

best_model_name = comparison.drop(index="Baseline (majority class)")["F1 (class 0)"].idxmax()
best_model = fitted[best_model_name]
print(f"\nBest model by F1 on class 0: {best_model_name} "
      f"(F1 = {comparison.loc[best_model_name, 'F1 (class 0)']:.4f})")

RESULTS["task4"] = {
    "table": {k: {kk: round(float(vv), 4) for kk, vv in v.items()}
              for k, v in comparison.to_dict(orient="index").items()},
    "baseline_accuracy": round(float(baseline_acc), 4),
    "best_model_name": best_model_name,
}
''')

code(r'''
# --- 4.4 Why accuracy misleads: the confusion matrices side by side ---------
print("The baseline and the best model have similar-looking accuracy, but they do "
      "completely different things:\n")
for label, pred in [("Baseline (majority class)", baseline_pred),
                    (best_model_name, best_model.predict(X_val))]:
    cm = confusion_matrix(y_val, pred, labels=[0, 1])
    cm_df = pd.DataFrame(
        cm,
        index=["actual: NOT recommend (0)", "actual: recommend (1)"],
        columns=["pred: NOT recommend (0)", "pred: recommend (1)"],
    )
    print(f"--- {label} | accuracy {accuracy_score(y_val, pred):.4f} ---")
    print(cm_df.to_string())
    print(f"    dissatisfied customers caught: {cm[0, 0]:,} of {cm[0].sum():,}\n")
''')

md(r'''
## Task 5 — Evaluation for Imbalanced Classification

The best model by F1 is carried forward. The threshold-selection rule is fixed and
well-defined, not a free choice: sweep every threshold returned by
`precision_recall_curve`, compute `F1 = 2·p·r / (p + r)` at each, and take the `argmax`.
''')

code(r'''
# --- 5.1 Metrics for the best model at the default 0.5 threshold ------------
proba_event = event_proba(best_model, X_val)     # P(would NOT recommend)

default_pred = (proba_event >= 0.5).astype(int)  # 1 = flagged as "would not recommend"

default_metrics = {
    "threshold": 0.5,
    "precision": precision_score(y_val_event, default_pred, zero_division=0),
    "recall": recall_score(y_val_event, default_pred, zero_division=0),
    "f1": f1_score(y_val_event, default_pred, zero_division=0),
}
roc_auc = roc_auc_score(y_val_event, proba_event)

print(f"Best model: {best_model_name}\n")
print(f"At the default 0.5 threshold:")
print(f"  Precision : {default_metrics['precision']:.4f}")
print(f"  Recall    : {default_metrics['recall']:.4f}")
print(f"  F1-score  : {default_metrics['f1']:.4f}")
print(f"  ROC-AUC   : {roc_auc:.4f}   (threshold-independent)")
print("\nFull classification report:\n")
print(classification_report(y_val, best_model.predict(X_val),
                            target_names=["NOT recommend (0)", "recommend (1)"],
                            digits=4))
''')

code(r'''
# --- 5.2 The required threshold rule: maximise F1 over the PR curve ---------
precision_arr, recall_arr, thresholds = precision_recall_curve(y_val_event, proba_event)

# precision/recall have length n+1; thresholds has length n. Align to thresholds.
p = precision_arr[:-1]
r = recall_arr[:-1]
with np.errstate(divide="ignore", invalid="ignore"):
    f1_arr = np.where((p + r) > 0, 2 * p * r / (p + r), 0.0)

best_i = int(np.argmax(f1_arr))
best_threshold = float(thresholds[best_i])

tuned_pred = (proba_event >= best_threshold).astype(int)
tuned_metrics = {
    "threshold": best_threshold,
    "precision": precision_score(y_val_event, tuned_pred, zero_division=0),
    "recall": recall_score(y_val_event, tuned_pred, zero_division=0),
    "f1": f1_score(y_val_event, tuned_pred, zero_division=0),
}

threshold_table = pd.DataFrame([
    {"Threshold rule": "Default 0.50", **{k: v for k, v in default_metrics.items() if k != "threshold"},
     "threshold": 0.5},
    {"Threshold rule": "F1-optimal (argmax over PR curve)",
     **{k: v for k, v in tuned_metrics.items() if k != "threshold"},
     "threshold": best_threshold},
])[["Threshold rule", "threshold", "precision", "recall", "f1"]].set_index("Threshold rule").round(4)

print(f"F1-optimal threshold: {best_threshold:.4f}\n")
display(threshold_table)

print("\nChange from default to F1-optimal:")
print(f"  precision {default_metrics['precision']:.4f} -> {tuned_metrics['precision']:+.4f} "
      f"({tuned_metrics['precision'] - default_metrics['precision']:+.4f})")
print(f"  recall    {default_metrics['recall']:.4f} -> {tuned_metrics['recall']:.4f} "
      f"({tuned_metrics['recall'] - default_metrics['recall']:+.4f})")
print(f"  F1        {default_metrics['f1']:.4f} -> {tuned_metrics['f1']:.4f} "
      f"({tuned_metrics['f1'] - default_metrics['f1']:+.4f})")

RESULTS["task5"] = {
    "best_model_name": best_model_name,
    "roc_auc": round(float(roc_auc), 4),
    "default": {k: round(float(v), 4) for k, v in default_metrics.items()},
    "f1_optimal": {k: round(float(v), 4) for k, v in tuned_metrics.items()},
}
''')

code(r'''
# --- 5.3 Confusion matrix at the F1-optimal threshold -----------------------
cm_tuned = confusion_matrix(y_val_event, tuned_pred, labels=[1, 0])
print(f"Confusion matrix at threshold {best_threshold:.4f} "
      f"(event = 'would NOT recommend'):\n")
print(pd.DataFrame(
    cm_tuned,
    index=["actual: NOT recommend", "actual: recommend"],
    columns=["flagged", "not flagged"],
).to_string())

tp, fn = int(cm_tuned[0, 0]), int(cm_tuned[0, 1])
fp, tn = int(cm_tuned[1, 0]), int(cm_tuned[1, 1])
print(f"\n  {tp:,} dissatisfied customers correctly flagged (true positives)")
print(f"  {fn:,} dissatisfied customers MISSED (false negatives - the costly error)")
print(f"  {fp:,} happy customers flagged for a needless double-check (false positives)")

RESULTS["task5"]["confusion_at_optimal"] = {"tp": tp, "fn": fn, "fp": fp, "tn": tn}
''')

code(r'''
# --- 5.4 Precision / recall / F1 across the threshold sweep -----------------
fig, ax = plt.subplots(figsize=(7.5, 4.4))

ax.plot(thresholds, p, color=BLUE, linewidth=2, label="Precision", zorder=3)
ax.plot(thresholds, r, color=ORANGE, linewidth=2, label="Recall", zorder=3)
ax.plot(thresholds, f1_arr, color=AQUA, linewidth=2, label="F1", zorder=4)

ax.axvline(best_threshold, color=GREY, linewidth=1.4, linestyle="--", zorder=2)
ax.scatter([best_threshold], [f1_arr[best_i]], s=60, color=AQUA,
           edgecolor="#fcfcfb", linewidth=2, zorder=5)
ax.annotate(
    f"F1-optimal\nthreshold {best_threshold:.3f}\nF1 {f1_arr[best_i]:.3f}",
    xy=(best_threshold, f1_arr[best_i]),
    xytext=(best_threshold + 0.12, f1_arr[best_i] + 0.16),
    fontsize=9, color="#0b0b0b",
    arrowprops=dict(arrowstyle="-", color=GREY, linewidth=1),
)
ax.axvline(0.5, color="#c9c8c3", linewidth=1.2, zorder=1)
ax.text(0.492, 0.03, "default 0.5", transform=ax.get_xaxis_transform(),
        ha="right", va="bottom", fontsize=8.5, color="#8a8983", rotation=90)

ax.set_ylim(0, 1.05)
ax.set_xlim(0, 1)
style_axes(ax, xlabel="Decision threshold on P(would not recommend)", ylabel="Score",
           title="Task 5 - Precision, recall and F1 across every threshold",
           subtitle=f"{best_model_name} - the F1 argmax is the required selection rule")
ax.legend(frameon=False, loc="lower left", fontsize=9)
save_fig(fig, "task5_threshold_sweep")
plt.show()
''')

md(r'''
## Task 6 — Model Explainability

`feature_importances_` is taken from the Task 4 **Random Forest (balanced)** model — the
balanced variant is the one intended for deployment, since the default-weighted forest
barely flags the minority class at all.
''')

code(r'''
rf_for_importance = fitted["Random Forest (balanced)"]
importances = rf_for_importance.feature_importances_

imp = pd.DataFrame({"feature": FEATURE_NAMES, "importance": importances})
imp["importance_pct"] = imp["importance"] / imp["importance"].sum() * 100

# --- 6.1 Top 10 individual features ----------------------------------------
top10 = imp.sort_values("importance", ascending=False).head(10).reset_index(drop=True)
top10.index = top10.index + 1

print("Top 10 features by Random Forest importance:\n")
display(top10.round({"importance": 5, "importance_pct": 3}))

RESULTS["task6"] = {
    "top10": [
        {"rank": int(i), "feature": str(row.feature),
         "importance": round(float(row.importance), 5),
         "importance_pct": round(float(row.importance_pct), 3)}
        for i, row in top10.iterrows()
    ]
}
''')

code(r'''
# --- 6.2 Group into exactly two families ------------------------------------
TEXT_DERIVED = set(NLP_NUMERIC) | {f for f in FEATURE_NAMES if f.startswith("tfidf__")}


def family_of(feature_name):
    return "Text-derived" if feature_name in TEXT_DERIVED else "Structured"


imp["family"] = imp["feature"].map(family_of)

family_summary = imp.groupby("family").agg(
    n_features=("feature", "size"),
    total_importance=("importance", "sum"),
)
family_summary["pct_of_total"] = (
    family_summary["total_importance"] / imp["importance"].sum() * 100
).round(2)

print("Importance by feature family:\n")
display(family_summary.round({"total_importance": 4}))

struct_pct = float(family_summary.loc["Structured", "pct_of_total"])
text_pct = float(family_summary.loc["Text-derived", "pct_of_total"])
print(f"\nStructured   : {struct_pct:.2f}% of total importance "
      f"({int(family_summary.loc['Structured', 'n_features'])} features)")
print(f"Text-derived : {text_pct:.2f}% of total importance "
      f"({int(family_summary.loc['Text-derived', 'n_features'])} features)")
print(f"\nHigher family: {'Text-derived' if text_pct > struct_pct else 'Structured'}")

# Per-feature average, to separate "this family matters" from "this family is big".
family_summary["avg_importance_per_feature"] = (
    family_summary["total_importance"] / family_summary["n_features"])
print("\nAverage importance per feature (guards against a large family winning on count alone):")
print((family_summary["avg_importance_per_feature"] * 100).round(4).to_string())

RESULTS["task6"].update({
    "structured_pct": round(struct_pct, 2),
    "text_derived_pct": round(text_pct, 2),
    "structured_n": int(family_summary.loc["Structured", "n_features"]),
    "text_derived_n": int(family_summary.loc["Text-derived", "n_features"]),
    "higher_family": "Text-derived" if text_pct > struct_pct else "Structured",
    "avg_per_feature": {k: round(float(v) * 100, 4)
                        for k, v in family_summary["avg_importance_per_feature"].items()},
})
''')

code(r'''
# --- 6.3 Chart: top 15 features, coloured by family -------------------------
top15 = imp.sort_values("importance", ascending=True).tail(15)
colors = [BLUE if f == "Text-derived" else ORANGE for f in top15["family"]]

fig, ax = plt.subplots(figsize=(7.5, 5.6))
ax.barh(top15["feature"].str.replace("tfidf__", "", regex=False),
        top15["importance_pct"], color=colors, height=0.62, zorder=3)
for y, (v, fam) in enumerate(zip(top15["importance_pct"], top15["family"])):
    ax.text(v + 0.05, y, f"{v:.2f}%", va="center", ha="left", fontsize=8.5, color="#0b0b0b")

handles = [mpl.patches.Patch(color=BLUE, label="Text-derived"),
           mpl.patches.Patch(color=ORANGE, label="Structured")]
ax.legend(handles=handles, frameon=False, loc="lower right", fontsize=9)

ax.set_xlim(0, top15["importance_pct"].max() * 1.18)
style_axes(ax, xlabel="Share of total Random Forest importance (%)", ylabel=None,
           title="Task 6 - Top 15 features by importance",
           subtitle=f"Text-derived features carry {text_pct:.1f}% of total importance "
                    f"vs {struct_pct:.1f}% for structured",
           grid_axis="x")
save_fig(fig, "task6_feature_importance")
plt.show()
''')
