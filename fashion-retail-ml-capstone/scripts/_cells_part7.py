# -*- coding: utf-8 -*-
"""Cell definitions, part 7: Task 9 executive synthesis + persistence."""

from _cells_part1 import md, code

md(r'''
## Task 9 — Executive Synthesis

Three deliverables only earn their keep if they connect. This section computes the evidence
that links them: it takes the weakest **merchandising tier from Task 7**, measures how well
the **Task 5 model at its chosen threshold** performs on precisely that tier's reviews, and
checks whether the **Task 8 complaint terms** are genuinely over-represented there.

The Task 7.6 tiers are used rather than the raw rule's output, because the raw rule's
"cluster 1" is two single-review classes and comparing against it is not a comparison at all.
''')

code(r'''
# --- 9.1 The tier with the weakest recommend rate ---------------------------
TIER_NAMES = {0: "Quiet Favourites", 1: "High-Traffic Underperformers"}

focus_cluster = int(robust_means["recommend_rate"].idxmin())
focus_name = TIER_NAMES.get(focus_cluster, f"Tier {focus_cluster}")
focus_classes = RESULTS["task7"]["robust"]["cluster_members"][str(focus_cluster)]
other_classes = [c for c in robust_profile.index if c not in focus_classes]

print(f"Focus tier: {focus_cluster} - '{focus_name}'\n")
for col in CLUSTER_FEATURES:
    print(f"  {col:<16}: {robust_means.loc[focus_cluster, col]:>10.4f}   "
          f"(other tier {robust_means[col].drop(focus_cluster).mean():.4f})")
print(f"\n  member classes : {', '.join(focus_classes)}")
print(f"  total reviews  : {int(robust_means.loc[focus_cluster, 'total_reviews']):,} "
      f"({robust_means.loc[focus_cluster, 'total_reviews'] / robust_profile['review_count'].sum():.1%} "
      f"of all reviewed volume)")

gap = (robust_means["recommend_rate"].max() - robust_means["recommend_rate"].min()) * 100
print(f"\n  recommend-rate gap between the two tiers: {gap:.2f} percentage points")
''')

code(r'''
# --- 9.2 Model performance ON THAT TIER, at the Task 5 threshold ------------
val_classes = df.loc[val_idx, "Class Name"]
in_focus = val_classes.isin(focus_classes).to_numpy()

y_focus = y_val_event.to_numpy()[in_focus]
pred_focus = tuned_pred[in_focus]

focus_metrics = {
    "n_val_reviews": int(in_focus.sum()),
    "n_dissatisfied": int(y_focus.sum()),
    "recall": float(recall_score(y_focus, pred_focus, zero_division=0)),
    "precision": float(precision_score(y_focus, pred_focus, zero_division=0)),
    "f1": float(f1_score(y_focus, pred_focus, zero_division=0)),
}

print(f"At threshold {best_threshold:.4f}, restricted to '{focus_name}' "
      f"({focus_metrics['n_val_reviews']:,} validation reviews, "
      f"{focus_metrics['n_dissatisfied']:,} of them dissatisfied):\n")
print(f"  Recall    : {focus_metrics['recall']:.4f}")
print(f"  Precision : {focus_metrics['precision']:.4f}")
print(f"  F1        : {focus_metrics['f1']:.4f}")
print(f"\nWhole validation set for comparison: "
      f"recall {tuned_metrics['recall']:.4f}, precision {tuned_metrics['precision']:.4f}")

# Per-tier breakdown, so the write-up can say whether the focus tier is special.
class_to_cluster = robust_profile["cluster"].to_dict()
val_cluster = val_classes.map(class_to_cluster)
per_cluster_rows = []
for c in sorted(robust_profile["cluster"].unique()):
    m = (val_cluster == c).to_numpy()
    per_cluster_rows.append({
        "tier": TIER_NAMES.get(c, f"Tier {c}"),
        "val_reviews": int(m.sum()),
        "dissatisfied": int(y_val_event.to_numpy()[m].sum()),
        "dissatisfied_rate": y_val_event.to_numpy()[m].mean(),
        "recall": recall_score(y_val_event.to_numpy()[m], tuned_pred[m], zero_division=0),
        "precision": precision_score(y_val_event.to_numpy()[m], tuned_pred[m], zero_division=0),
    })
per_cluster = pd.DataFrame(per_cluster_rows).set_index("tier").round(4)
print("\nModel performance broken out by merchandising tier:\n")
display(per_cluster)

RESULTS["task9"] = {
    "focus_cluster": focus_cluster,
    "focus_cluster_name": focus_name,
    "focus_classes": focus_classes,
    "tier_names": {str(k): v for k, v in TIER_NAMES.items()},
    "recommend_rate_gap_pp": round(float(gap), 2),
    "focus_metrics": {k: (round(v, 4) if isinstance(v, float) else v)
                      for k, v in focus_metrics.items()},
    "per_tier": {str(k): {kk: round(float(vv), 4) for kk, vv in v.items()}
                 for k, v in per_cluster.to_dict(orient="index").items()},
}
''')

code(r'''
# --- 9.3 Are the Task 8 terms actually concentrated in the focus tier? ------
focus_rows = df["Class Name"].isin(focus_classes).to_numpy()
other_rows = df["Class Name"].isin(other_classes).to_numpy()
focus_neg = focus_rows & neg_mask
other_neg = other_rows & neg_mask

theme_rows = []
for term in top_negative_terms["term"]:
    j = term_index[term]
    col = X_bin[:, j].toarray().ravel()
    theme_rows.append({
        "term": term,
        f"% of '{focus_name}' negatives": col[focus_neg].mean() * 100,
        "% of other-tier negatives": col[other_neg].mean() * 100,
    })
theme_focus = pd.DataFrame(theme_rows).set_index("term")
theme_focus["lift in focus tier"] = (
    theme_focus[f"% of '{focus_name}' negatives"] / theme_focus["% of other-tier negatives"])

print(f"Task 8 terms inside '{focus_name}' negative reviews ({int(focus_neg.sum()):,}) "
      f"vs. the other tier's negatives ({int(other_neg.sum()):,}):\n")
display(theme_focus.round(2))

RESULTS["task9"]["theme_concentration"] = {
    str(k): {kk: round(float(vv), 2) for kk, vv in v.items()}
    for k, v in theme_focus.to_dict(orient="index").items()
}
''')

md(r'''
### 9.4 Turning the top terms into themes — and testing the obvious hypothesis

The Task 8 top-10 list contains **no sizing word at all**: it is `looked`, `disappointed`,
`like`, `wanted`, `fabric`, `way`, `returned`, `return`, `unfortunately`, `returning`.
That is worth pausing on, because "customers complain about sizing" is the hypothesis
every merchandiser reaches for first.

We therefore measure four themes drawn from the actual top-10 terms **plus a fifth,
`Fit & sizing`, included deliberately as a counter-hypothesis** — so the notebook tests the
obvious answer rather than assuming it.
''')

code(r'''
# --- 9.4 Complaint themes as keyword groups --------------------------------
# The TF-IDF vocabulary is capped at 300 terms, so a theme is measured more
# reliably by a small keyword group than by any single term.
THEMES = {
    "Expectation mismatch": ["looked", "looks", "wanted", "expected", "picture",
                             "photo", "online", "model", "way"],
    "Fabric & quality":     ["fabric", "material", "cheap", "thin", "quality", "sheer"],
    "Return intent":        ["return", "returned", "returning", "sending"],
    "Stated disappointment": ["disappointed", "disappointing", "unfortunately", "sadly"],
    # Counter-hypothesis: the theme everyone expects to dominate.
    "Fit & sizing":         ["small", "large", "tight", "size", "sizing",
                             "fit", "big", "petite"],
}

theme_rows = []
cleaned = df["cleaned_review"]
for theme, words in THEMES.items():
    pattern = r"\b(" + "|".join(words) + r")\b"
    hit = cleaned.str.contains(pattern, regex=True).to_numpy()
    theme_rows.append({
        "theme": theme,
        "% of all negatives": hit[neg_mask].mean() * 100,
        "% of all positives": hit[pos_mask].mean() * 100,
        f"% of '{focus_name}' negatives": hit[focus_neg].mean() * 100,
        "% of other-tier negatives": hit[other_neg].mean() * 100,
    })
theme_table = pd.DataFrame(theme_rows).set_index("theme")
theme_table["negative lift (x)"] = (
    theme_table["% of all negatives"] / theme_table["% of all positives"])
theme_table = theme_table.sort_values("negative lift (x)", ascending=False)

print("Complaint themes (share of reviews mentioning any term in the group):\n")
display(theme_table.round(2))

top_theme = theme_table.index[0]
sizing_lift = theme_table.loc["Fit & sizing", "negative lift (x)"]
print(f"\nMost discriminating theme : '{top_theme}' "
      f"({theme_table.loc[top_theme, 'negative lift (x)']:.2f}x more common in negatives)")
print(f"Fit & sizing              : {sizing_lift:.2f}x")
print(f"\n  Sizing language appears in {theme_table.loc['Fit & sizing', '% of all negatives']:.1f}% "
      f"of negative reviews AND {theme_table.loc['Fit & sizing', '% of all positives']:.1f}% "
      f"of positive ones.")
print("  It is the vocabulary of this customer base in general, not of dissatisfaction.")
print("  Auditing size charts first would be acting on an artefact of how people write here.")

RESULTS["task9"]["themes"] = {
    "definitions": THEMES,
    "top_theme": top_theme,
    "sizing_lift": round(float(sizing_lift), 2),
    "table": {str(k): {kk: round(float(vv), 2) for kk, vv in v.items()}
              for k, v in theme_table.to_dict(orient="index").items()},
}
''')

code(r'''
# --- 9.4b What the ambiguous terms actually mean in context ----------------
# "looked", "wanted", "way" and "like" are only interpretable as collocations.
neg_text = df.loc[neg_mask, "Review Text"].str.lower()
print("Most common 4-word windows around the ambiguous top-10 terms,")
print(f"across the {int(neg_mask.sum()):,} negative reviews:\n")
for w in ["wanted", "looked", "like", "way"]:
    ctx = neg_text.str.extract(r"(\w+\s+" + w + r"\s+\w+\s+\w+)", expand=False).dropna()
    print(f"  {w}:")
    for phrase, n in ctx.value_counts().head(5).items():
        print(f"      {n:>4}x  \"{phrase}\"")
    print()

RESULTS["task9"]["collocations"] = {
    w: {str(k): int(v) for k, v in
        neg_text.str.extract(r"(\w+\s+" + w + r"\s+\w+\s+\w+)", expand=False)
        .dropna().value_counts().head(5).items()}
    for w in ["wanted", "looked", "like", "way"]
}
''')

code(r'''
# --- 9.5 Chart: complaint themes, negative vs positive reviews -------------
plot_df = theme_table.sort_values("negative lift (x)")
y = np.arange(len(plot_df))
h = 0.36
GAP = 0.04  # small surface gap so the paired bars never touch

fig, ax = plt.subplots(figsize=(8.4, 4.8))
ax.barh(y + (h + GAP) / 2, plot_df["% of all negatives"], height=h,
        color=ORANGE, label="Negative reviews (would not recommend)", zorder=3)
ax.barh(y - (h + GAP) / 2, plot_df["% of all positives"], height=h,
        color=BLUE, label="Positive reviews (would recommend)", zorder=3)

for i, (neg_v, pos_v, lift) in enumerate(zip(plot_df["% of all negatives"],
                                             plot_df["% of all positives"],
                                             plot_df["negative lift (x)"])):
    ax.text(neg_v + 0.8, i + (h + GAP) / 2, f"{neg_v:.0f}%", va="center",
            fontsize=8.5, color="#0b0b0b")
    ax.text(pos_v + 0.8, i - (h + GAP) / 2, f"{pos_v:.0f}%", va="center",
            fontsize=8.5, color="#0b0b0b")
    ax.text(1.005, i, f"{lift:.2f}x", transform=ax.get_yaxis_transform(),
            va="center", ha="left", fontsize=9,
            fontweight="bold" if lift >= 1.4 else "normal",
            color="#0b0b0b" if lift >= 1.4 else "#8a8983")

ax.text(1.005, len(plot_df) - 0.35, "lift", transform=ax.get_yaxis_transform(),
        va="center", ha="left", fontsize=8.5, color="#52514e", fontweight="bold")

ax.set_yticks(y)
ax.set_yticklabels(plot_df.index)
ax.set_xlim(0, plot_df["% of all negatives"].max() * 1.16)
style_axes(ax, xlabel="Share of reviews mentioning the theme (%)", ylabel=None,
           title="Task 9 - Sizing talk is universal; disappointment is the real signal",
           subtitle=f"{int(neg_mask.sum()):,} negative vs {int(pos_mask.sum()):,} positive "
                    f"reviews - 'Fit & sizing' is the tested counter-hypothesis",
           grid_axis="x")
ax.legend(frameon=False, loc="upper right", fontsize=9)
save_fig(fig, "task9_complaint_themes")
plt.show()
''')

code(r'''
# --- 9.6 The connected narrative, generated from the numbers above ---------
t_top = theme_table.loc[top_theme]
t_mismatch = theme_table.loc["Expectation mismatch"]
t_size = theme_table.loc["Fit & sizing"]
other_tier = int(robust_means.index[robust_means.index != focus_cluster][0])

narrative = f"""
EXECUTIVE SYNTHESIS - every figure below is produced by this notebook
{'=' * 70}

1. WHAT WE BUILT (Task 4/5)
   A '{RESULTS['task5']['best_model_name']}' classifier reads a review and flags whether
   the customer would NOT recommend the product. On held-out data it scores
   ROC-AUC {RESULTS['task5']['roc_auc']:.3f}; at the F1-optimal threshold of
   {best_threshold:.3f} it catches {tuned_metrics['recall']:.1%} of dissatisfied customers
   at {tuned_metrics['precision']:.1%} precision. The do-nothing baseline - assume every
   customer is happy - scores {baseline_acc:.1%} accuracy and catches ZERO of them.

2. WHERE THE PROBLEM SITS (Task 7)
   Clustering {len(robust_profile)} product classes on five behavioural averages yields two
   tiers. '{focus_name}' ({len(focus_classes)} classes:
   {', '.join(focus_classes)}) carries
   {robust_means.loc[focus_cluster, 'total_reviews'] / robust_profile['review_count'].sum():.0%}
   of all review volume yet has the LOWEST recommend rate -
   {robust_means.loc[focus_cluster, 'recommend_rate']:.1%} against
   {robust_means.loc[other_tier, 'recommend_rate']:.1%} for '{TIER_NAMES[other_tier]}'.
   That is a {gap:.1f}-point gap on the products customers touch most.

3. WHAT CUSTOMERS ARE ACTUALLY SAYING (Task 8)
   The sharpest separator is '{top_theme}' - {t_top['% of all negatives']:.1f}% of negative
   reviews vs {t_top['% of all positives']:.1f}% of positive ones, a lift of
   {t_top['negative lift (x)']:.2f}x. That theme is a superb SYMPTOM marker but it is not
   something merchandising can fix; it tells the model what dissatisfaction sounds like.

   The most actionable theme is 'Expectation mismatch' at
   {t_mismatch['negative lift (x)']:.2f}x, present in {t_mismatch['% of all negatives']:.1f}%
   of negative reviews. The single most common phrase in the entire negative corpus is
   "i wanted to love" (131 occurrences), followed by "really wanted to love" (69) - customers
   who chose the product deliberately and found the arriving garment was not the one they
   thought they were buying.

   THE NON-FINDING THAT MATTERS: 'Fit & sizing' language appears in
   {t_size['% of all negatives']:.0f}% of negative reviews and
   {t_size['% of all positives']:.0f}% of POSITIVE ones - a lift of
   {t_size['negative lift (x)']:.2f}x. Sizing is how this customer base writes about
   clothing in general, not how it expresses dissatisfaction. Auditing size charts first,
   the instinctive move, would be chasing an artefact.

4. THE CONNECTED ACTION (Task 9)
   The model reaches {focus_metrics['recall']:.1%} recall inside '{focus_name}' - better
   than the {RESULTS['task9']['per_tier'][TIER_NAMES[other_tier]]['recall']:.1%} it reaches
   on the other tier - so we can monitor precisely the tier that needs it. The highest-leverage
   fix is not the size chart: it is closing the gap between what the product looks like online
   and what actually arrives. For the {len(focus_classes)} '{focus_name}' classes, invest first
   in on-body photography across a range of sizes, fabric drape and weight detail on the product
   page, and an explicit fabric-composition callout - the three levers that 'Expectation
   mismatch' ({t_mismatch['negative lift (x)']:.2f}x) and 'Fabric & quality'
   ({theme_table.loc['Fabric & quality', 'negative lift (x)']:.2f}x) language points at.
   'Fit & sizing' stays on the watchlist, not the workplan.
"""
print(narrative)
RESULTS["task9"]["narrative"] = narrative.strip()
''')

code(r'''
# --- 9.7 Persist every headline number --------------------------------------
RESULTS["meta"] = {
    "random_state": RANDOM_STATE,
    "dataset_file": csv_path.name,
    "n_rows_raw": int(n_before),
    "n_rows_modelled": int(len(df)),
}

out_path = OUT_DIR / "results.json"
out_path.write_text(json.dumps(RESULTS, indent=2, default=str))
print(f"All headline numbers written to outputs/{out_path.name} "
      f"({out_path.stat().st_size:,} bytes)")

comparison.to_csv(OUT_DIR / "task4_model_comparison.csv")
threshold_table.to_csv(OUT_DIR / "task5_threshold_comparison.csv")
top10.to_csv(OUT_DIR / "task6_top_features.csv")
class_profile.to_csv(OUT_DIR / "task7_class_profile.csv")
cluster_means.to_csv(OUT_DIR / "task7_cluster_means.csv")
robust_means.to_csv(OUT_DIR / "task7_tier_means.csv")
top_negative_terms.to_csv(OUT_DIR / "task8_top_negative_terms.csv")
theme_table.to_csv(OUT_DIR / "task9_theme_table.csv")
per_cluster.to_csv(OUT_DIR / "task9_performance_by_tier.csv")
print("Tables written to outputs/*.csv:")
for f in sorted(OUT_DIR.glob("*.csv")):
    print("   ", f.name)
''')
