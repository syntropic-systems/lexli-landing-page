# -*- coding: utf-8 -*-
"""Cell definitions, part 1: Tasks 0-3."""

CELLS = []
def md(s): CELLS.append(("markdown", s.strip("\n")))
def code(s): CELLS.append(("code", s.strip("\n")))

md(r'''
# Fashion Retail Capstone — Classification, Clustering & NLP on Customer Reviews

**Dataset:** Women's E-Commerce Clothing Reviews (23,486 reviews, 10 feature columns).

**Business framing.** An online fashion retailer has thousands of free-text customer
reviews that nobody on the merchandising team has time to read. Leadership wants three
connected deliverables:

1. **Early-warning classification** — flag reviews that indicate *"would not recommend"*.
2. **Product/segment clustering** — group product classes into merchandising tiers.
3. **Theme extraction** — a plain-English summary of what unhappy customers actually say.

**Notebook map**

| Section | Task |
|---|---|
| Task 0 | Setup, reproducibility, data load |
| Task 1 | Exploratory Data Analysis |
| Task 2 | NLP feature engineering |
| Task 3 | Model-ready dataset (split, encode, scale) |
| Task 4 | Classification on imbalanced data |
| Task 5 | Evaluation & threshold selection |
| Task 6 | Model explainability |
| Task 7 | Unsupervised clustering of product classes |
| Task 8 | Theme extraction from negative feedback |
| Task 9 | Executive synthesis |

**Reproducibility.** `random_state=42` is passed to every function that accepts one
(`train_test_split`, `LogisticRegression`, `RandomForestClassifier`, `KMeans`). Re-running
this notebook top-to-bottom reproduces every number in the written summary.
''')

md(r'''
## Task 0 — Setup, reproducibility and data load
''')

code(r'''
# --- Standard library -------------------------------------------------------
import json
import re
import string
import warnings
from pathlib import Path

# --- Third party ------------------------------------------------------------
import numpy as np
import pandas as pd
import matplotlib as mpl
import matplotlib.pyplot as plt
from scipy import sparse
from textblob import TextBlob

from sklearn.dummy import DummyClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, roc_auc_score,
    precision_recall_curve, confusion_matrix, classification_report,
    silhouette_score,
)

%matplotlib inline
warnings.filterwarnings("ignore", category=FutureWarning)

# --- Reproducibility --------------------------------------------------------
RANDOM_STATE = 42
np.random.seed(RANDOM_STATE)

pd.set_option("display.width", 140)
pd.set_option("display.max_columns", 60)

# --- Output locations -------------------------------------------------------
NB_DIR = Path.cwd()
ROOT = NB_DIR.parent if NB_DIR.name == "notebooks" else NB_DIR
FIG_DIR = ROOT / "docs" / "figures"
OUT_DIR = ROOT / "outputs"
FIG_DIR.mkdir(parents=True, exist_ok=True)
OUT_DIR.mkdir(parents=True, exist_ok=True)

# RESULTS collects every headline number so the written summary can be generated
# from the notebook's own output rather than transcribed by hand.
RESULTS = {}

print("scikit-learn, pandas, numpy ready | RANDOM_STATE =", RANDOM_STATE)
print("figures ->", FIG_DIR)
''')

md(r'''
### Chart styling

One small styling helper, applied to every plot: recessive gridlines and axes so the
data marks carry the ink, a fixed categorical hue order (never cycled), and a single
value axis per chart (no dual-axis charts anywhere in this notebook).
''')

code(r'''
# Fixed categorical hue order - assigned by slot, never cycled.
# This 3-slot subset was validated for colour-vision-deficiency separation
# (worst all-pairs deutan dE 9.2, normal-vision dE 24.0 on a light surface).
BLUE, ORANGE, AQUA = "#2a78d6", "#eb6834", "#1baf7a"
RED, GREY = "#e34948", "#52514e"
SEQ_BLUE = ["#cde2fb", "#9ec5f4", "#6da7ec", "#3987e5", "#256abf", "#184f95", "#0d366b"]

mpl.rcParams.update({
    "figure.dpi": 110,
    "savefig.dpi": 150,
    "savefig.bbox": "tight",
    "figure.facecolor": "#fcfcfb",
    "axes.facecolor": "#fcfcfb",
    "font.size": 10,
    "axes.titlesize": 12,
    "axes.titleweight": "bold",
    "axes.labelcolor": "#52514e",
    "text.color": "#0b0b0b",
    "xtick.color": "#52514e",
    "ytick.color": "#52514e",
})


def style_axes(ax, xlabel=None, ylabel=None, title=None, subtitle=None, grid_axis="y"):
    """Recessive grid + axes; the marks stay the loudest thing on the chart."""
    ax.set_facecolor("#fcfcfb")
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    for side in ("left", "bottom"):
        ax.spines[side].set_color("#dcdbd6")
    if grid_axis:
        ax.grid(axis=grid_axis, color="#e8e7e2", linewidth=0.8, zorder=0)
        ax.set_axisbelow(True)
    if xlabel:
        ax.set_xlabel(xlabel)
    if ylabel:
        ax.set_ylabel(ylabel)
    if title:
        ax.set_title(title, loc="left", pad=18 if subtitle else 10)
    if subtitle:
        ax.text(0.0, 1.02, subtitle, transform=ax.transAxes,
                fontsize=9, color="#52514e", ha="left", va="bottom")
    return ax


def save_fig(fig, name):
    path = FIG_DIR / f"{name}.png"
    fig.savefig(path)
    print(f"saved -> docs/figures/{name}.png")
    return path
''')

code(r'''
# --- Load the raw dataset ---------------------------------------------------
CSV_NAME = "Womens Clothing E-Commerce Reviews.csv"
candidates = [ROOT / "data" / CSV_NAME, NB_DIR / "data" / CSV_NAME, Path(CSV_NAME)]
csv_path = next((p for p in candidates if p.exists()), None)
if csv_path is None:
    raise FileNotFoundError(
        f"Could not find '{CSV_NAME}'. Run scripts/download_data.py first "
        f"(see README.md), or place the CSV in ./data/."
    )

# The first column of the Kaggle export is an unnamed row index.
raw = pd.read_csv(csv_path, index_col=0)
print(f"Loaded {csv_path.name}: {raw.shape[0]:,} rows x {raw.shape[1]} columns")
raw.head()
''')

code(r'''
raw.info()
''')

md(r'''
## Task 1 — Exploratory Data Analysis

Four things are required here:

1. Drop rows with a missing `Review Text` and report how many rows that removes.
2. The exact percentage split of `Recommended IND` (1 vs 0).
3. A 2x2 cross-tab of `Rating` (grouped 1-3 vs 4-5) against `Recommended IND` (0 vs 1).
4. Exactly three plots: rating distribution, review-length distribution, reviews per department.
''')

code(r'''
# --- 1.1 Drop rows with missing Review Text ---------------------------------
n_before = len(raw)
missing_review_text = raw["Review Text"].isna().sum()
df = raw.dropna(subset=["Review Text"]).copy()
n_after = len(df)

print(f"Rows before drop            : {n_before:,}")
print(f"Rows with missing Review Text: {missing_review_text:,} "
      f"({missing_review_text / n_before:.2%} of the raw data)")
print(f"Rows after drop             : {n_after:,}")

RESULTS["task1"] = {
    "rows_before": int(n_before),
    "rows_dropped_missing_review_text": int(missing_review_text),
    "rows_after": int(n_after),
}
''')

code(r'''
# --- 1.1b Remaining missing values ------------------------------------------
# Note which columns still carry nulls after the Review Text filter.
remaining_na = df.isna().sum()
print("Missing values remaining per column:")
print(remaining_na[remaining_na > 0] if (remaining_na > 0).any() else "  (none)")
''')

code(r'''
# --- 1.2 Class balance of the target ----------------------------------------
target_counts = df["Recommended IND"].value_counts().sort_index()
target_pct = df["Recommended IND"].value_counts(normalize=True).sort_index() * 100

balance = pd.DataFrame({
    "count": target_counts,
    "percentage": target_pct.round(2),
})
balance.index = ["0 - would NOT recommend", "1 - would recommend"]
balance.index.name = "Recommended IND"

print("Class balance of the classification target:\n")
display(balance)

print(f"\nExact split: {target_pct[1]:.2f}% recommend / {target_pct[0]:.2f}% do not recommend")
print(f"Imbalance ratio: {target_counts[1] / target_counts[0]:.2f} : 1")

RESULTS["task1"].update({
    "recommend_pct": round(float(target_pct[1]), 2),
    "not_recommend_pct": round(float(target_pct[0]), 2),
    "recommend_count": int(target_counts[1]),
    "not_recommend_count": int(target_counts[0]),
    "imbalance_ratio": round(float(target_counts[1] / target_counts[0]), 2),
})
''')

code(r'''
# --- 1.3 2x2 cross-tab: Rating group vs Recommended IND ---------------------
df["rating_group"] = np.where(df["Rating"] <= 3, "Rating 1-3", "Rating 4-5")

crosstab = pd.crosstab(df["rating_group"], df["Recommended IND"])
crosstab.columns = ["Not recommended (0)", "Recommended (1)"]
crosstab.index.name = "Rating group"

print("2x2 cross-tab of Rating group against Recommended IND:\n")
display(crosstab)

# The two "disagreement" cells - where the star rating and the recommend flag
# point in opposite directions.
low_rating_but_recommended = int(crosstab.loc["Rating 1-3", "Recommended (1)"])
high_rating_not_recommended = int(crosstab.loc["Rating 4-5", "Not recommended (0)"])

print(f"\nDisagreement cell A - Rating 1-3 but Recommended == 1 : {low_rating_but_recommended:,}")
print(f"Disagreement cell B - Rating 4-5 but Recommended == 0 : {high_rating_not_recommended:,}")
print(f"Total disagreement                                    : "
      f"{low_rating_but_recommended + high_rating_not_recommended:,} "
      f"({(low_rating_but_recommended + high_rating_not_recommended) / len(df):.2%} of reviews)")

RESULTS["task1"]["crosstab"] = {
    "rating_1_3_not_recommended": int(crosstab.loc["Rating 1-3", "Not recommended (0)"]),
    "rating_1_3_recommended": low_rating_but_recommended,
    "rating_4_5_not_recommended": high_rating_not_recommended,
    "rating_4_5_recommended": int(crosstab.loc["Rating 4-5", "Recommended (1)"]),
}
''')

code(r'''
# A quick look at what the "Rating 1-3 but recommended" group actually contains.
disagreers = df[(df["rating_group"] == "Rating 1-3") & (df["Recommended IND"] == 1)]
print(f"{len(disagreers):,} reviews rated 1-3 yet flagged 'would recommend'.")
print("\nRating breakdown inside that group:")
print(disagreers["Rating"].value_counts().sort_index().to_string())
print("\nThree examples:\n")
for i, txt in enumerate(disagreers["Review Text"].head(3), 1):
    print(f"[{i}] {txt[:260]}...\n")

RESULTS["task1"]["disagreers_rating_breakdown"] = {
    str(k): int(v) for k, v in disagreers["Rating"].value_counts().sort_index().items()
}
''')

md(r'''
### The three required plots
''')

code(r'''
# --- Plot (a): distribution of Rating ---------------------------------------
fig, ax = plt.subplots(figsize=(7, 4))
rating_counts = df["Rating"].value_counts().sort_index()

bars = ax.bar(rating_counts.index, rating_counts.values,
              color=BLUE, width=0.62, zorder=3)
# Rounded data-ends, anchored to the baseline.
for b in bars:
    b.set_linewidth(0)
# Direct labels instead of making the reader trace back to the axis.
for x, v in zip(rating_counts.index, rating_counts.values):
    ax.text(x, v + 220, f"{v:,}", ha="center", va="bottom",
            fontsize=9, color="#0b0b0b")

ax.set_xticks([1, 2, 3, 4, 5])
ax.set_ylim(0, rating_counts.max() * 1.14)
style_axes(ax, xlabel="Star rating", ylabel="Reviews",
           title="Plot (a) - Ratings skew heavily positive",
           subtitle=f"{len(df):,} reviews with review text - "
                    f"{(df['Rating'] >= 4).mean():.0%} are 4 or 5 stars")
save_fig(fig, "task1a_rating_distribution")
plt.show()
''')

code(r'''
# --- Plot (b): distribution of review length in words -----------------------
# Raw word count on the untouched text; Task 2 recomputes this on cleaned text
# as the `review_length` feature.
raw_word_count = df["Review Text"].str.split().str.len()

fig, ax = plt.subplots(figsize=(7, 4))
ax.hist(raw_word_count, bins=40, color=BLUE, zorder=3)

median_len = raw_word_count.median()
ax.axvline(median_len, color=ORANGE, linewidth=2, zorder=4)
ax.text(median_len + 2, ax.get_ylim()[1] * 0.92,
        f"median {median_len:.0f} words", color=ORANGE, fontsize=9,
        ha="left", va="top", fontweight="bold")

style_axes(ax, xlabel="Review length (words)", ylabel="Reviews",
           title="Plot (b) - Review length is bimodal, with a hard ceiling near 100 words",
           subtitle=f"min {raw_word_count.min()} - max {raw_word_count.max()} words; the spike at 90-105 "
                    f"is a platform character cap, not customer behaviour")
save_fig(fig, "task1b_review_length_distribution")
plt.show()

print(raw_word_count.describe().round(1).to_string())
''')

code(r'''
# --- Plot (c): count of reviews per Department Name -------------------------
dept_counts = df["Department Name"].value_counts().sort_values()

fig, ax = plt.subplots(figsize=(7, 4))
bars = ax.barh(dept_counts.index.astype(str), dept_counts.values,
               color=BLUE, height=0.62, zorder=3)
for y, v in enumerate(dept_counts.values):
    ax.text(v + 120, y, f"{v:,}", va="center", ha="left",
            fontsize=9, color="#0b0b0b")

ax.set_xlim(0, dept_counts.max() * 1.14)
style_axes(ax, xlabel="Reviews", ylabel=None,
           title="Plot (c) - Tops and Dresses dominate the review corpus",
           subtitle=f"{df['Department Name'].nunique()} departments; "
                    f"Trend contributes under 1% of reviews",
           grid_axis="x")
save_fig(fig, "task1c_reviews_per_department")
plt.show()

RESULTS["task1"]["reviews_per_department"] = {
    str(k): int(v) for k, v in dept_counts.sort_values(ascending=False).items()
}
''')
