# -*- coding: utf-8 -*-
from _cells_part1 import md, code

md(r'''
## Task 8 — Text Theme Extraction from Negative Feedback

Method (fixed, not an open choice): using the **Task 2 vectoriser fitted on the training
split**, compute the mean TF-IDF weight of every term separately within the negative group
(`Recommended IND == 0`) and the positive group (`== 1`), take
`difference = mean_weight_negative − mean_weight_positive`, sort descending, report the
top 10.
''')

code(r'''
# --- 8.1 Split the corpus and transform with the ALREADY-FITTED vectoriser --
# .transform(), never .fit_transform() - the vocabulary stays the one learned on
# the training split in Task 3.
X_all_text = tfidf.transform(df["cleaned_review"])

neg_mask = (df["Recommended IND"] == 0).to_numpy()
pos_mask = ~neg_mask

print(f"Negative group (Recommended IND == 0): {neg_mask.sum():,} reviews")
print(f"Positive group (Recommended IND == 1): {pos_mask.sum():,} reviews")

mean_neg = np.asarray(X_all_text[neg_mask].mean(axis=0)).ravel()
mean_pos = np.asarray(X_all_text[pos_mask].mean(axis=0)).ravel()

term_scores = pd.DataFrame({
    "term": tfidf_terms,
    "mean_weight_negative": mean_neg,
    "mean_weight_positive": mean_pos,
})
term_scores["difference"] = (
    term_scores["mean_weight_negative"] - term_scores["mean_weight_positive"])

top_negative_terms = term_scores.sort_values("difference", ascending=False).head(10)
top_negative_terms = top_negative_terms.reset_index(drop=True)
top_negative_terms.index = top_negative_terms.index + 1

print("\nTop 10 terms by (mean TF-IDF in negative reviews - mean TF-IDF in positive reviews):\n")
display(top_negative_terms.round(6))

RESULTS["task8"] = {
    "top10_terms": [
        {"rank": int(i), "term": str(row.term),
         "mean_weight_negative": round(float(row.mean_weight_negative), 6),
         "mean_weight_positive": round(float(row.mean_weight_positive), 6),
         "difference": round(float(row.difference), 6)}
        for i, row in top_negative_terms.iterrows()
    ],
    "n_negative": int(neg_mask.sum()),
    "n_positive": int(pos_mask.sum()),
}

# For contrast: the terms most characteristic of POSITIVE reviews.
print("\nFor contrast - top 10 terms skewing positive:\n")
display(term_scores.sort_values("difference").head(10)
        .reset_index(drop=True).round(6))
''')

code(r'''
# --- 8.2 Chart: negative-skewing terms --------------------------------------
plot_terms = top_negative_terms.sort_values("difference")

fig, ax = plt.subplots(figsize=(7.4, 4.8))
ax.barh(plot_terms["term"], plot_terms["difference"], color=BLUE, height=0.62, zorder=3)
for y, v in enumerate(plot_terms["difference"]):
    ax.text(v + max(plot_terms["difference"]) * 0.015, y, f"{v:.4f}",
            va="center", ha="left", fontsize=8.5, color="#0b0b0b")

ax.set_xlim(0, plot_terms["difference"].max() * 1.18)
style_axes(ax, xlabel="mean TF-IDF (negative) - mean TF-IDF (positive)", ylabel=None,
           title="Task 8 - What separates a complaint from a compliment",
           subtitle=f"Top 10 of 300 TF-IDF terms, across "
                    f"{int(neg_mask.sum()):,} negative and {int(pos_mask.sum()):,} positive reviews",
           grid_axis="x")
save_fig(fig, "task8_negative_terms")
plt.show()
''')

code(r'''
# --- 8.3 How often each top term appears in each group ----------------------
# TF-IDF differences are hard to feel; document frequency is not.
freq_rows = []
term_index = {t: i for i, t in enumerate(tfidf_terms)}
X_bin = (X_all_text > 0)
for term in top_negative_terms["term"]:
    j = term_index[term]
    col = X_bin[:, j].toarray().ravel()
    freq_rows.append({
        "term": term,
        "% of negative reviews": col[neg_mask].mean() * 100,
        "% of positive reviews": col[pos_mask].mean() * 100,
    })
freq_table = pd.DataFrame(freq_rows).set_index("term")
freq_table["lift (x)"] = (freq_table["% of negative reviews"]
                          / freq_table["% of positive reviews"])

print("Document frequency of each top term, by group:\n")
display(freq_table.round(2))

RESULTS["task8"]["document_frequency"] = {
    str(k): {kk: round(float(vv), 2) for kk, vv in v.items()}
    for k, v in freq_table.to_dict(orient="index").items()
}
''')

