# -*- coding: utf-8 -*-
"""Cell definitions, part 4: Tasks 7-9."""

from _cells_part1 import md, code

md(r'''
## Task 7 — Unsupervised Clustering

The clustering grain is fixed at **`Class Name`**. Each product class is summarised by
exactly five aggregate columns — `avg_rating`, `recommend_rate`, `review_count`,
`avg_sentiment`, `avg_age` — standardised, then clustered with K-Means. K is chosen by
the highest silhouette score over K = 2..8.
''')

code(r'''
# --- 7.1 Aggregate to Class Name level --------------------------------------
# The 'Unknown' bucket created in Task 3 from 14 null rows is not a real product
# class, so it is excluded from the clustering grain.
cluster_source = df[df["Class Name"] != "Unknown"]
n_excluded = len(df) - len(cluster_source)
if n_excluded:
    print(f"Excluded {n_excluded} rows with an unknown Class Name from the clustering grain.\n")

class_profile = cluster_source.groupby("Class Name").agg(
    avg_rating=("Rating", "mean"),
    recommend_rate=("Recommended IND", "mean"),
    review_count=("Rating", "size"),
    avg_sentiment=("sentiment_polarity", "mean"),
    avg_age=("Age", "mean"),
)

CLUSTER_FEATURES = ["avg_rating", "recommend_rate", "review_count", "avg_sentiment", "avg_age"]

print(f"{len(class_profile)} product classes x {len(CLUSTER_FEATURES)} aggregate features:\n")
display(class_profile.sort_values("review_count", ascending=False).round(4))
''')

code(r'''
# --- 7.2 Standardise before clustering --------------------------------------
# review_count spans three orders of magnitude; without scaling it would dominate
# the Euclidean distance entirely.
cluster_scaler = StandardScaler()
X_cluster = cluster_scaler.fit_transform(class_profile[CLUSTER_FEATURES])

print("Raw feature ranges (why scaling is mandatory here):")
print(class_profile[CLUSTER_FEATURES].agg(["min", "max"]).round(3).to_string())
print("\nAfter standardisation - mean ~0, std ~1:")
print(pd.DataFrame(X_cluster, columns=CLUSTER_FEATURES)
      .agg(["mean", "std"]).round(4).to_string())
''')

code(r'''
# --- 7.3 Silhouette score for K = 2..8 --------------------------------------
sil_rows = []
for k in range(2, 9):
    km = KMeans(n_clusters=k, random_state=RANDOM_STATE, n_init=10)
    labels_k = km.fit_predict(X_cluster)
    sil_rows.append({
        "K": k,
        "silhouette_score": silhouette_score(X_cluster, labels_k),
        "inertia": km.inertia_,
    })

sil_table = pd.DataFrame(sil_rows).set_index("K").round(4)
best_k = int(sil_table["silhouette_score"].idxmax())

print("Silhouette score for every K tested (full table, not just the winner):\n")
display(sil_table)
print(f"\nSelected K = {best_k} "
      f"(highest silhouette = {sil_table.loc[best_k, 'silhouette_score']:.4f})")

RESULTS["task7"] = {
    "silhouette_table": {int(k): round(float(v), 4)
                         for k, v in sil_table["silhouette_score"].items()},
    "best_k": best_k,
    "best_silhouette": round(float(sil_table.loc[best_k, "silhouette_score"]), 4),
    "n_classes": int(len(class_profile)),
}
''')

code(r'''
# --- 7.3b Chart: silhouette score by K --------------------------------------
fig, ax = plt.subplots(figsize=(7, 4))
ax.plot(sil_table.index, sil_table["silhouette_score"], color=BLUE,
        linewidth=2, marker="o", markersize=8,
        markeredgecolor="#fcfcfb", markeredgewidth=2, zorder=3)
ax.scatter([best_k], [sil_table.loc[best_k, "silhouette_score"]], s=170,
           facecolor=ORANGE, edgecolor="#fcfcfb", linewidth=2, zorder=4)
for k, v in sil_table["silhouette_score"].items():
    ax.text(k, v + 0.014, f"{v:.3f}", ha="center", va="bottom",
            fontsize=8.5, color="#0b0b0b")
ax.annotate(f"selected K = {best_k}", xy=(best_k, sil_table.loc[best_k, "silhouette_score"]),
            xytext=(best_k + 0.35, sil_table.loc[best_k, "silhouette_score"] - 0.075),
            fontsize=9, color=ORANGE, fontweight="bold",
            arrowprops=dict(arrowstyle="-", color=ORANGE, linewidth=1.2))

ax.set_xticks(list(sil_table.index))
ax.set_ylim(sil_table["silhouette_score"].min() - 0.09,
            sil_table["silhouette_score"].max() + 0.075)
style_axes(ax, xlabel="Number of clusters (K)", ylabel="Silhouette score",
           title="Task 7 - Silhouette score selects K by rule, not by eye",
           subtitle=f"{len(class_profile)} product classes, 5 standardised aggregate features")
save_fig(fig, "task7_silhouette_by_k")
plt.show()
''')

code(r'''
# --- 7.4 Fit the selected K-Means and profile each cluster ------------------
kmeans = KMeans(n_clusters=best_k, random_state=RANDOM_STATE, n_init=10)
class_profile["cluster"] = kmeans.fit_predict(X_cluster)

cluster_means = class_profile.groupby("cluster")[CLUSTER_FEATURES].mean()
cluster_means.insert(0, "n_classes", class_profile.groupby("cluster").size())
cluster_means["total_reviews"] = class_profile.groupby("cluster")["review_count"].sum()

print("Mean of each aggregate column, per cluster:\n")
display(cluster_means.round(4))

print("\nWhich product classes landed in each cluster:\n")
for c in sorted(class_profile["cluster"].unique()):
    members = class_profile[class_profile["cluster"] == c].sort_values(
        "review_count", ascending=False)
    print(f"Cluster {c}  ({len(members)} classes, "
          f"{int(members['review_count'].sum()):,} reviews)")
    for name, row in members.iterrows():
        print(f"    {name:<22} n={int(row['review_count']):>5,}  "
              f"avg_rating={row['avg_rating']:.2f}  "
              f"recommend_rate={row['recommend_rate']:.3f}  "
              f"avg_sentiment={row['avg_sentiment']:.3f}")
    print()

RESULTS["task7"]["cluster_means"] = {
    str(c): {k: round(float(v), 4) for k, v in row.items()}
    for c, row in cluster_means.to_dict(orient="index").items()
}
RESULTS["task7"]["cluster_members"] = {
    str(c): sorted(class_profile[class_profile["cluster"] == c].index.tolist())
    for c in sorted(class_profile["cluster"].unique())
}
''')

code(r'''
# --- 7.5 Chart: cluster profile heatmap (z-scores) --------------------------
# Diverging blue<->red with a neutral grey midpoint: the values are signed
# deviations from the corpus average, so zero has to read as "nothing".
z_profile = pd.DataFrame(
    cluster_scaler.transform(cluster_means[CLUSTER_FEATURES]),
    index=[f"Cluster {c}" for c in cluster_means.index],
    columns=CLUSTER_FEATURES,
)

diverging = mpl.colors.LinearSegmentedColormap.from_list(
    "blue_grey_red", ["#0d366b", "#3987e5", "#cde2fb", "#f0efec",
                      "#f6c4c4", "#e34948", "#8f2020"])
vmax = float(np.abs(z_profile.to_numpy()).max())

fig, ax = plt.subplots(figsize=(7.6, 0.9 * len(z_profile) + 2.2))
im = ax.imshow(z_profile.to_numpy(), cmap=diverging, vmin=-vmax, vmax=vmax, aspect="auto")

ax.set_xticks(range(len(CLUSTER_FEATURES)))
ax.set_xticklabels(CLUSTER_FEATURES, rotation=20, ha="right")
ax.set_yticks(range(len(z_profile)))
ax.set_yticklabels(z_profile.index)

# Every cell is directly labelled with its raw value - the colour is a secondary cue.
for i in range(z_profile.shape[0]):
    for j, col in enumerate(CLUSTER_FEATURES):
        z = z_profile.iat[i, j]
        raw = cluster_means[col].iloc[i]
        txt = f"{raw:,.0f}" if col == "review_count" else f"{raw:.2f}"
        ax.text(j, i, txt, ha="center", va="center", fontsize=9.5,
                color="#ffffff" if abs(z) > vmax * 0.55 else "#0b0b0b")

ax.set_xticks(np.arange(-.5, len(CLUSTER_FEATURES), 1), minor=True)
ax.set_yticks(np.arange(-.5, len(z_profile), 1), minor=True)
ax.grid(which="minor", color="#fcfcfb", linewidth=2)
ax.tick_params(which="minor", length=0)
for s in ax.spines.values():
    s.set_visible(False)

cbar = fig.colorbar(im, ax=ax, fraction=0.035, pad=0.03)
cbar.set_label("standard deviations from the all-class mean", fontsize=8.5, color="#52514e")
cbar.outline.set_visible(False)

ax.set_title(f"Task 7 - Cluster profiles (K = {best_k})", loc="left", pad=20)
ax.text(0.0, 1.02, "cells show the raw per-cluster average; colour shows the z-score",
        transform=ax.transAxes, fontsize=9, color="#52514e", ha="left", va="bottom")
save_fig(fig, "task7_cluster_profiles")
plt.show()
''')

