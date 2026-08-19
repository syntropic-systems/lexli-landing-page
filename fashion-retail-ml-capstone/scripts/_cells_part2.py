# -*- coding: utf-8 -*-
"""Cell definitions, part 2: Tasks 2-3."""

from _cells_part1 import md, code

md(r'''
## Task 2 — NLP Feature Engineering

Order matters here: `exclam_count` and `question_count` are counted on the **original**
text, *before* punctuation is stripped — strip first and the signal is gone.

**Column names created in this section** (kept exactly as specified so they are easy to
locate later): `cleaned_review`, `review_length`, `exclam_count`, `question_count`,
`sentiment_polarity`, `sentiment_subjectivity`.

> **Note on a spec ambiguity.** Task 2 names *five* derived numeric columns, while Tasks 3
> and 6 refer to "the 4 numeric columns". We include all five columns that Task 2 names
> explicitly, and flag the discrepancy rather than silently dropping one.

> **Note on where sentiment is computed.** `sentiment_polarity` / `sentiment_subjectivity`
> are computed on the **original** review text, not the lowercased/de-punctuated version.
> TextBlob's pattern analyser uses punctuation and casing (notably `!` as an intensifier),
> so cleaning first would throw away signal the analyser is designed to use.
''')

code(r'''
# --- 2.1 Counts that must be taken BEFORE punctuation is removed ------------
df["exclam_count"] = df["Review Text"].str.count(r"!")
df["question_count"] = df["Review Text"].str.count(r"\?")

print("Punctuation-signal features (computed on the ORIGINAL text):")
print(df[["exclam_count", "question_count"]].describe().round(3).to_string())
print(f"\nReviews containing at least one '!': {(df['exclam_count'] > 0).mean():.1%}")
print(f"Reviews containing at least one '?': {(df['question_count'] > 0).mean():.1%}")
''')

code(r'''
# --- 2.2 Text cleaning: lowercase, then strip punctuation -------------------
PUNCT_TABLE = str.maketrans("", "", string.punctuation)


def clean_text(text: str) -> str:
    """Lowercase, remove punctuation, and collapse whitespace."""
    text = str(text).lower().translate(PUNCT_TABLE)
    return re.sub(r"\s+", " ", text).strip()


df["cleaned_review"] = df["Review Text"].apply(clean_text)

print("Before / after cleaning:\n")
for original in df["Review Text"].head(2):
    print(f"  raw    : {original[:110]}")
    print(f"  cleaned: {clean_text(original)[:110]}\n")
''')

code(r'''
# --- 2.3 review_length: word count of the CLEANED review text ---------------
df["review_length"] = df["cleaned_review"].str.split().str.len()

print(df["review_length"].describe().round(2).to_string())
''')

code(r'''
# --- 2.4 TextBlob sentiment on the original text ----------------------------
# ~22.6k reviews; this is the slowest cell in the notebook (roughly 20-40 seconds).
sentiment = df["Review Text"].apply(lambda t: TextBlob(str(t)).sentiment)
df["sentiment_polarity"] = sentiment.apply(lambda s: s.polarity)
df["sentiment_subjectivity"] = sentiment.apply(lambda s: s.subjectivity)

NLP_NUMERIC = [
    "review_length", "exclam_count", "question_count",
    "sentiment_polarity", "sentiment_subjectivity",
]

print("Derived NLP numeric features:\n")
display(df[NLP_NUMERIC].describe().round(3))

print("\nMean polarity by Recommended IND:")
print(df.groupby("Recommended IND")["sentiment_polarity"].mean().round(4).to_string())
print("\nMean polarity by Rating:")
print(df.groupby("Rating")["sentiment_polarity"].mean().round(4).to_string())

RESULTS["task2"] = {
    "polarity_mean_by_recommend": {
        str(k): round(float(v), 4)
        for k, v in df.groupby("Recommended IND")["sentiment_polarity"].mean().items()
    },
    "polarity_mean_by_rating": {
        str(k): round(float(v), 4)
        for k, v in df.groupby("Rating")["sentiment_polarity"].mean().items()
    },
}
''')

md(r'''
### Write-up evidence — where sentiment and rating disagree

The required write-up asks for one concrete review where `sentiment_polarity` and
`Rating` clearly point in opposite directions. We pull the most extreme case in each
direction so the example is reproducible rather than cherry-picked by eye.
''')

code(r'''
# Case A: 5-star rating, most NEGATIVE polarity.
# Case B: 1-star rating, most POSITIVE polarity.
five_star = df[df["Rating"] == 5]
one_star = df[df["Rating"] == 1]

case_a = five_star.loc[five_star["sentiment_polarity"].idxmin()]
case_b = one_star.loc[one_star["sentiment_polarity"].idxmax()]


def show_case(label, row):
    print("=" * 78)
    print(label)
    print("=" * 78)
    print(f"Rating                 : {row['Rating']}")
    print(f"Recommended IND        : {row['Recommended IND']}")
    print(f"review_length (words)  : {row['review_length']}")
    print(f"sentiment_polarity     : {row['sentiment_polarity']:.4f}")
    print(f"sentiment_subjectivity : {row['sentiment_subjectivity']:.4f}")
    print(f"Class Name             : {row['Class Name']}")
    print(f"\nReview text:\n{row['Review Text']}\n")


show_case("CASE A - 5 stars, most negative polarity", case_a)
show_case("CASE B - 1 star, most positive polarity", case_b)

RESULTS["task2"]["disagreement_case_a"] = {
    "rating": int(case_a["Rating"]),
    "recommended_ind": int(case_a["Recommended IND"]),
    "review_length": int(case_a["review_length"]),
    "sentiment_polarity": round(float(case_a["sentiment_polarity"]), 4),
    "sentiment_subjectivity": round(float(case_a["sentiment_subjectivity"]), 4),
    "class_name": str(case_a["Class Name"]),
    "text": str(case_a["Review Text"]),
}
RESULTS["task2"]["disagreement_case_b"] = {
    "rating": int(case_b["Rating"]),
    "recommended_ind": int(case_b["Recommended IND"]),
    "review_length": int(case_b["review_length"]),
    "sentiment_polarity": round(float(case_b["sentiment_polarity"]), 4),
    "sentiment_subjectivity": round(float(case_b["sentiment_subjectivity"]), 4),
    "class_name": str(case_b["Class Name"]),
    "text": str(case_b["Review Text"]),
}

# How common is this disagreement overall? (context for the write-up)
disagree_mask = ((df["Rating"] >= 4) & (df["sentiment_polarity"] < 0)) | \
                ((df["Rating"] <= 2) & (df["sentiment_polarity"] > 0.3))
print(f"Reviews where rating and polarity clearly disagree: "
      f"{disagree_mask.sum():,} ({disagree_mask.mean():.2%} of the corpus)")
RESULTS["task2"]["polarity_rating_disagreement_count"] = int(disagree_mask.sum())
RESULTS["task2"]["polarity_rating_disagreement_pct"] = round(float(disagree_mask.mean() * 100), 2)
''')

md(r'''
### TF-IDF configuration

The vectoriser is **configured** here but deliberately **not fitted yet**: fitting it on
the full corpus before the Task 3 split would leak validation vocabulary and validation
document frequencies into training. It is fitted on the training split only in Task 3,
then applied to the validation split with `.transform()`.
''')

code(r'''
tfidf = TfidfVectorizer(
    max_features=300,
    min_df=5,
    max_df=0.8,
    ngram_range=(1, 2),
    stop_words="english",
)
print(tfidf)
print("\nConfigured but NOT fitted - fitting happens on the training split in Task 3.")
''')

md(r'''
## Task 3 — Build a Model-Ready Dataset

Feature table contents:

* `Age`, `Positive Feedback Count`
* one-hot `Department Name` and `Class Name` (`drop_first=True`)
* the 5 Task-2 NLP numeric features
* 300 TF-IDF columns

**Fit-on-train discipline.** The split happens *first*. The TF-IDF vectoriser and the
`StandardScaler` are then fitted on the training rows only and applied to validation with
`.transform()`. One-hot encoding is built on the full frame — it is a fixed category
lookup, not a learned statistic, and doing it up front guarantees train and validation
share identical columns.
''')

code(r'''
# --- 3.1 Target and stratified split ----------------------------------------
y = df["Recommended IND"].astype(int)

train_idx, val_idx = train_test_split(
    df.index,
    test_size=0.2,
    random_state=RANDOM_STATE,
    stratify=y,
)
train_idx = pd.Index(train_idx)
val_idx = pd.Index(val_idx)

y_train = y.loc[train_idx]
y_val = y.loc[val_idx]

print(f"Train rows: {len(train_idx):,}   Validation rows: {len(val_idx):,}")
print("\nClass proportions preserved by stratify=y:")
print(pd.DataFrame({
    "full":  y.value_counts(normalize=True).sort_index().round(4),
    "train": y_train.value_counts(normalize=True).sort_index().round(4),
    "val":   y_val.value_counts(normalize=True).sort_index().round(4),
}).to_string())

RESULTS["task3"] = {
    "n_train": int(len(train_idx)),
    "n_val": int(len(val_idx)),
    "train_pos_rate": round(float(y_train.mean()), 4),
    "val_pos_rate": round(float(y_val.mean()), 4),
}
''')

code(r'''
# --- 3.2 Fit TF-IDF on TRAIN ONLY, transform validation ---------------------
X_text_train = tfidf.fit_transform(df.loc[train_idx, "cleaned_review"])
X_text_val = tfidf.transform(df.loc[val_idx, "cleaned_review"])

tfidf_terms = tfidf.get_feature_names_out()
print(f"TF-IDF matrix: train {X_text_train.shape}, validation {X_text_val.shape}")
print(f"Vocabulary size: {len(tfidf_terms)} terms "
      f"({sum(' ' in t for t in tfidf_terms)} of them bigrams)")
print("\nFirst 30 terms:", ", ".join(tfidf_terms[:30]))
''')

code(r'''
# --- 3.3 Structured numeric features: impute then scale ---------------------
STRUCT_NUMERIC = ["Age", "Positive Feedback Count"]

age_median = df.loc[train_idx, "Age"].median()   # median from TRAIN only
n_age_missing = int(df["Age"].isna().sum())
df["Age"] = df["Age"].fillna(age_median)
print(f"Age missing values filled: {n_age_missing} (train median = {age_median})")

SCALED_COLS = STRUCT_NUMERIC + NLP_NUMERIC
scaler = StandardScaler()
X_num_train = scaler.fit_transform(df.loc[train_idx, SCALED_COLS])
X_num_val = scaler.transform(df.loc[val_idx, SCALED_COLS])

print(f"\nScaled columns ({len(SCALED_COLS)}): {SCALED_COLS}")
print("Train means after scaling (should be ~0):",
      np.round(X_num_train.mean(axis=0), 6))
print("Train stds after scaling  (should be ~1):",
      np.round(X_num_train.std(axis=0), 6))
''')

code(r'''
# --- 3.4 One-hot encode the product hierarchy -------------------------------
# 14 rows carry a null Department/Class Name; label them explicitly rather than
# letting get_dummies silently encode them as an all-zero row.
for col in ["Department Name", "Class Name"]:
    n_null = int(df[col].isna().sum())
    if n_null:
        print(f"{col}: {n_null} null values -> filled with 'Unknown'")
    df[col] = df[col].fillna("Unknown").astype(str)

onehot = pd.get_dummies(
    df[["Department Name", "Class Name"]],
    drop_first=True,
    dtype=float,
)
onehot_cols = list(onehot.columns)
X_cat_train = onehot.loc[train_idx].to_numpy()
X_cat_val = onehot.loc[val_idx].to_numpy()

print(f"\nOne-hot columns: {len(onehot_cols)} "
      f"({df['Department Name'].nunique()} departments + "
      f"{df['Class Name'].nunique()} classes, first level dropped from each)")
print(onehot_cols)
''')

code(r'''
# --- 3.5 Assemble the sparse feature matrix ---------------------------------
X_train = sparse.hstack([
    sparse.csr_matrix(X_num_train),
    sparse.csr_matrix(X_cat_train),
    X_text_train,
], format="csr")

X_val = sparse.hstack([
    sparse.csr_matrix(X_num_val),
    sparse.csr_matrix(X_cat_val),
    X_text_val,
], format="csr")

FEATURE_NAMES = (
    SCALED_COLS
    + onehot_cols
    + [f"tfidf__{t}" for t in tfidf_terms]
)

assert X_train.shape[1] == len(FEATURE_NAMES), "feature name / column count mismatch"
assert not np.isnan(X_train.data).any(), "NaNs present in the training matrix"
assert not np.isnan(X_val.data).any(), "NaNs present in the validation matrix"

print(f"X_train: {X_train.shape}   X_val: {X_val.shape}")
print(f"Total features: {len(FEATURE_NAMES):,}")
print(f"  structured numeric : {len(STRUCT_NUMERIC)}")
print(f"  NLP numeric        : {len(NLP_NUMERIC)}")
print(f"  one-hot            : {len(onehot_cols)}")
print(f"  TF-IDF             : {len(tfidf_terms)}")
print(f"Sparsity: {1 - X_train.nnz / (X_train.shape[0] * X_train.shape[1]):.3%} zeros")

RESULTS["task3"].update({
    "n_features_total": int(len(FEATURE_NAMES)),
    "n_structured_numeric": len(STRUCT_NUMERIC),
    "n_nlp_numeric": len(NLP_NUMERIC),
    "n_onehot": len(onehot_cols),
    "n_tfidf": int(len(tfidf_terms)),
    "age_median_filled": float(age_median),
    "age_missing": n_age_missing,
})
''')
