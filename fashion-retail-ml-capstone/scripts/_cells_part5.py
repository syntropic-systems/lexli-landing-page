# -*- coding: utf-8 -*-
"""Cell definitions, part 5: Task 7 robustness check."""

from _cells_part1 import md, code

md(r'''
### 7.6 Robustness check — the same rule, minus the two singleton classes

The required rule is not wrong, but its answer is **degenerate**. `Casual bottoms` and
`Chemises` have **one review each**, which places them far below every other class on
`review_count` and makes them trivially separable. K-Means splits off the two outliers,
the silhouette score rewards that handsomely (0.626), and the "winning" partition tells
merchandising nothing — cluster 0 is simply *the entire assortment*.

So we re-run the **identical** procedure — same 5 aggregate features, same
`StandardScaler`, same K = 2..8 silhouette sweep, same `random_state=42`, same
`n_init=10` — on classes with at least **30 reviews**. This is the only judgement call in
Task 7 and it is stated rather than hidden. It is also insensitive to the exact cut-off:
the two singletons are the only classes below 118 reviews, so *any* threshold from 2 to
118 produces exactly the same clusters.
''')

code(r'''
MIN_REVIEWS = 30
robust_profile = class_profile[class_profile["review_count"] >= MIN_REVIEWS].copy()
dropped = sorted(set(class_profile.index) - set(robust_profile.index))

print(f"Classes retained: {len(robust_profile)} of {len(class_profile)} "
      f"(>= {MIN_REVIEWS} reviews)")
print(f"Classes dropped : {dropped} "
      f"({int(class_profile.loc[dropped, 'review_count'].sum())} reviews in total)")

robust_scaler = StandardScaler()
X_robust = robust_scaler.fit_transform(robust_profile[CLUSTER_FEATURES])

robust_sil = []
for k in range(2, 9):
    km = KMeans(n_clusters=k, random_state=RANDOM_STATE, n_init=10)
    robust_sil.append({
        "K": k,
        "silhouette_score": silhouette_score(X_robust, km.fit_predict(X_robust)),
    })
robust_sil = pd.DataFrame(robust_sil).set_index("K").round(4)
robust_k = int(robust_sil["silhouette_score"].idxmax())

print(f"\nSilhouette sweep on the {len(robust_profile)} retained classes:\n")
display(robust_sil)
print(f"Selected K = {robust_k} "
      f"(silhouette {robust_sil.loc[robust_k, 'silhouette_score']:.4f})")
''')

code(r'''
robust_km = KMeans(n_clusters=robust_k, random_state=RANDOM_STATE, n_init=10)
robust_profile["cluster"] = robust_km.fit_predict(X_robust)

robust_means = robust_profile.groupby("cluster")[CLUSTER_FEATURES].mean()
robust_means.insert(0, "n_classes", robust_profile.groupby("cluster").size())
robust_means["total_reviews"] = robust_profile.groupby("cluster")["review_count"].sum()

print("Mean of each aggregate column, per merchandising tier:\n")
display(robust_means.round(4))

for c in sorted(robust_profile["cluster"].unique()):
    members = robust_profile[robust_profile["cluster"] == c].sort_values(
        "review_count", ascending=False)
    print(f"Tier {c}  ({len(members)} classes, "
          f"{int(members['review_count'].sum()):,} reviews)")
    for name, row in members.iterrows():
        print(f"    {name:<12} n={int(row['review_count']):>6,}  "
              f"avg_rating={row['avg_rating']:.3f}  "
              f"recommend_rate={row['recommend_rate']:.3f}  "
              f"avg_sentiment={row['avg_sentiment']:.3f}  "
              f"avg_age={row['avg_age']:.1f}")
    print()

RESULTS["task7"]["robust"] = {
    "min_reviews": MIN_REVIEWS,
    "dropped_classes": dropped,
    "n_classes": int(len(robust_profile)),
    "silhouette_table": {int(k): round(float(v), 4)
                         for k, v in robust_sil["silhouette_score"].items()},
    "best_k": robust_k,
    "best_silhouette": round(float(robust_sil.loc[robust_k, "silhouette_score"]), 4),
    "cluster_means": {str(c): {k: round(float(v), 4) for k, v in row.items()}
                      for c, row in robust_means.to_dict(orient="index").items()},
    "cluster_members": {str(c): sorted(robust_profile[robust_profile["cluster"] == c].index.tolist())
                        for c in sorted(robust_profile["cluster"].unique())},
}
robust_profile.to_csv(OUT_DIR / "task7_merchandising_tiers.csv")
''')

code(r'''
# --- 7.7 Chart: the tiers on their two decisive axes ------------------------
# Volume vs. satisfaction is where the tiers actually separate; both are
# cluster inputs, and one shared value axis carries the comparison.
TIER_COLORS = {0: AQUA, 1: ORANGE}
# Three-way rotation of label placement so neighbouring points never collide.
LABEL_OFFSETS = [(9, 7, "left"), (9, -15, "left"), (-9, -15, "right")]

fig, ax = plt.subplots(figsize=(9.0, 5.6))
# Alternate the label offset by x-rank so neighbouring points never collide.
rank = {name: i for i, name in
        enumerate(robust_profile.sort_values("review_count").index)}
for c in sorted(robust_profile["cluster"].unique()):
    sub = robust_profile[robust_profile["cluster"] == c]
    ax.scatter(sub["review_count"], sub["recommend_rate"] * 100,
               s=120, color=TIER_COLORS[c], edgecolor="#fcfcfb", linewidth=2,
               label=f"Tier {c}  ({len(sub)} classes)", zorder=3)
    # Every point is directly labelled - colour is never the only cue.
    for name, row in sub.iterrows():
        dx, dy, ha = LABEL_OFFSETS[rank[name] % 3]
        ax.annotate(name, (row["review_count"], row["recommend_rate"] * 100),
                    xytext=(dx, dy), textcoords="offset points", ha=ha,
                    fontsize=8.5, color="#52514e")

overall = robust_profile["recommend_rate"].mean() * 100
ax.axhline(overall, color="#c9c8c3", linewidth=1.2, zorder=1)
ax.text(0.995, overall + 0.25, f"class average {overall:.1f}%",
        transform=ax.get_yaxis_transform(), ha="right", va="bottom",
        fontsize=8.5, color="#8a8983")

ax.set_xscale("log")
style_axes(ax, xlabel="Reviews per class (log scale)", ylabel="Recommend rate (%)",
           title="Task 7 - The busiest classes are the least recommended",
           subtitle=f"K = {robust_k} on {len(robust_profile)} classes with "
                    f">= {MIN_REVIEWS} reviews; both axes are cluster inputs",
           grid_axis="both")
ax.set_ylim(73.4, 89.4)
ax.set_xlim(90, 11000)
ax.legend(frameon=False, loc="lower right", fontsize=9)
save_fig(fig, "task7_merchandising_tiers")
plt.show()
''')

md(r'''
### 7.8 Naming the clusters

Names are grounded in the per-cluster averages printed above, not invented.

**From the required rule (all 20 classes, K = 2, silhouette 0.626)**

| Cluster | Business-friendly name | What the averages say |
|---|---|---|
| 0 | **The Reviewed Assortment** | 18 classes, 22,626 reviews, avg_rating 4.22, recommend_rate 83.0% — every product class customers actually write about |
| 1 | **The Single-Review Long Tail** | 2 classes, 1 review each (`Casual bottoms`, `Chemises`) — a data-coverage artefact, not a merchandising tier |

**From the robustness re-run (18 classes with ≥ 30 reviews, K = 2, silhouette 0.356)**

| Tier | Business-friendly name | What the averages say |
|---|---|---|
| 0 | **Quiet Favourites** | 12 classes, 588 reviews each on average, avg_rating **4.27**, recommend_rate **84.7%**, avg_sentiment 0.253 — smaller, niche classes that customers like more |
| 1 | **High-Traffic Underperformers** | 6 classes, 2,595 reviews each on average, avg_rating **4.10**, recommend_rate **79.6%**, avg_sentiment 0.238, avg_age 44.0 — the volume drivers, and the *least* recommended |

The headline is uncomfortable and useful: **the classes that generate the most reviews are
the ones customers recommend least.** A 5.1-point recommend-rate gap on 4.4x the volume is
where the returns actually come from.
''')
