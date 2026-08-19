# Fashion Retail ML Capstone

Classification on imbalanced data, unsupervised clustering, and NLP theme extraction —
three different kinds of machine learning applied to one connected business problem, on the
**Women's E-Commerce Clothing Reviews** dataset (23,486 reviews).

An online fashion retailer has thousands of customer reviews that nobody on the merchandising
team has time to read. This project builds three connected deliverables:

1. **Early-warning classification** — flag reviews that indicate *"would not recommend"*.
2. **Product/segment clustering** — group product classes into merchandising tiers with no labels.
3. **Theme extraction** — a plain-English summary of what dissatisfied customers actually say.

---

## Headline results

| | Result |
|---|---|
| Rows modelled | 22,641 (845 dropped for missing `Review Text`) |
| Class balance | 81.89% recommend / 18.11% do not — 4.52 : 1 |
| Majority-class baseline | **81.89% accuracy**, catches **zero** dissatisfied customers |
| Best model (F1 on class 0) | Logistic Regression (`class_weight='balanced'`) — **F1 0.6538**, ROC-AUC **0.9082** |
| F1-optimal threshold | **0.5869** → precision 0.5790, recall 0.7817 |
| Feature importance | **Text-derived 95.50%** vs Structured 4.50% |
| Clustering (required rule) | K = 2, silhouette 0.6263 — **degenerate**: it isolates two single-review classes |
| Clustering (robustness re-run) | K = 2 on 18 classes with ≥ 30 reviews — *Quiet Favourites* (84.7% recommend) vs *High-Traffic Underperformers* (79.6%) |
| Top complaint terms | `looked`, `disappointed`, `like`, `wanted`, `fabric`, `way`, `returned`, `return`, `unfortunately`, `returning` |
| Counter-intuitive finding | Sizing language appears in **58% of negative and 61% of positive** reviews — it carries no satisfaction signal at all |

The full narrative, with every write-up prompt answered, is in
**[`docs/WRITTEN_SUMMARY.md`](docs/WRITTEN_SUMMARY.md)**.

---

## Repository layout

```
.
├── README.md                                  <- you are here
├── requirements.txt                           <- pinned dependencies
├── data/
│   └── Womens Clothing E-Commerce Reviews.csv <- dataset (see "Getting the data")
├── notebooks/
│   └── fashion_retail_capstone.ipynb          <- THE DELIVERABLE: Tasks 1-9, fully executed
├── docs/
│   ├── WRITTEN_SUMMARY.md                     <- every "Write-up" prompt + Task 9 synthesis
│   ├── fashion_retail_capstone.html           <- rendered notebook, opens in any browser
│   ├── figures/                               <- 10 charts saved by the notebook
│   └── screenshots/                           <- screenshots of key steps and results
├── outputs/
│   ├── results.json                           <- every headline number, machine-readable
│   └── *.csv                                  <- the result tables the write-up leans on
└── scripts/
    ├── download_data.py                       <- fetch + verify the dataset
    ├── build_notebook.py                      <- assemble AND execute the notebook
    ├── capture_screenshots.py                 <- render the notebook and screenshot it
    ├── make_submission_zip.py                 <- package everything as the submission .zip
    └── _cells_part*.py                        <- the notebook's cells, as reviewable Python
```

**Why the notebook is generated.** `notebooks/fashion_retail_capstone.ipynb` is assembled from
`scripts/_cells_part*.py` by `scripts/build_notebook.py`, which then executes it end-to-end. The
source of truth is therefore plain, diffable, reviewable Python rather than a JSON blob — and
"the notebook runs top-to-bottom without errors" is enforced by the build, not by hope. The
committed `.ipynb` is a real executed notebook with all outputs visible; you can open and re-run
it directly and never touch the scripts.

---

## Quick start

```bash
# 1. Install dependencies (Python 3.11+)
pip install -r requirements.txt

# 2. Get the dataset into ./data/
python scripts/download_data.py

# 3. Open the already-executed notebook (all outputs are committed)
jupyter notebook notebooks/fashion_retail_capstone.ipynb
```

Nothing else is required to read the deliverable. To **re-run everything from scratch**:

```bash
python scripts/build_notebook.py          # rebuild + execute the notebook (~3 minutes)
```

To also regenerate the HTML render and the screenshots:

```bash
python -m nbconvert --to html --output-dir docs notebooks/fashion_retail_capstone.ipynb
python scripts/capture_screenshots.py     # needs playwright + a chromium install
```

To rebuild the submission archive:

```bash
python scripts/make_submission_zip.py    # -> ../fashion-retail-ml-capstone.zip
```

### Getting the data

The canonical source is Kaggle:

```bash
pip install kaggle
# put your API token from kaggle.com/settings into ~/.kaggle/kaggle.json
kaggle datasets download -d nicapotato/womens-ecommerce-clothing-reviews -p ./data
cd data && unzip womens-ecommerce-clothing-reviews.zip
```

`scripts/download_data.py` does exactly this when a Kaggle token is present, and otherwise falls
back to a public GitHub mirror of the identical CSV — so the project runs without a Kaggle
account. Either way it verifies the shape (23,486 × 10) and the required columns before exiting.

---

## Reproducibility

`random_state=42` is passed to every function that accepts one — `train_test_split`,
`DummyClassifier`, `LogisticRegression`, `RandomForestClassifier`, and every `KMeans` — and
`np.random.seed(42)` is set at import. Re-running the notebook top-to-bottom reproduces every
number quoted in `docs/WRITTEN_SUMMARY.md` exactly. Those numbers are also emitted to
`outputs/results.json` by the final cell, so the write-up can be checked against the code without
re-reading the notebook.

**Fit-on-train discipline.** The train/validation split happens *first*; the `TfidfVectorizer`
and the `StandardScaler` are then fitted on the training rows only and applied to validation with
`.transform()`, and the `Age` median used for imputation is computed from the training rows.
One-hot encoding is built on the full frame — it is a fixed category lookup, not a learned
statistic, so building it up front leaks nothing and guarantees train and validation share
identical columns.

---

## Notes on the analysis

Three judgement calls are worth flagging up front; all three are argued in the notebook and the
written summary rather than buried.

**1. Which class is "positive".** The label column is `Recommended IND`, exactly as specified,
but every precision / recall / F1 figure is computed with respect to **class 0** — the minority
class, and the event the business cares about. A *false negative* therefore means a genuinely
dissatisfied customer we failed to flag, which is what makes the Task 5 threshold discussion
coherent. Accuracy and ROC-AUC are class-symmetric and unaffected.

**2. Task 7's required rule produces a degenerate answer.** The specified rule — highest
silhouette over K = 2..8 — selects K = 2, and that split isolates `Casual bottoms` and `Chemises`,
which have **one review each**, from everything else. This is reported honestly as the primary
result. The notebook then re-runs the *identical* procedure on the 18 classes with ≥ 30 reviews,
which yields two genuinely useful merchandising tiers. The threshold is the only judgement call in
Task 7, it is stated rather than hidden, and it is insensitive to the exact value: the two
singletons are the only classes below 118 reviews, so any cut-off from 2 to 118 gives identical
clusters.

**3. A spec ambiguity, resolved in the open.** Task 2 names *five* derived numeric columns
(`review_length`, `exclam_count`, `question_count`, `sentiment_polarity`,
`sentiment_subjectivity`) while Tasks 3 and 6 refer to "the 4 numeric columns". All five are
included, and the discrepancy is flagged in the notebook rather than silently resolved by dropping
one. Separately, sentiment is computed on the **original** review text rather than the cleaned
text, because TextBlob's pattern analyser uses casing and punctuation that cleaning destroys;
`exclam_count` and `question_count` are, as required, counted before punctuation is stripped.

---

## Dataset

Women's E-Commerce Clothing Reviews —
<https://www.kaggle.com/datasets/nicapotato/womens-ecommerce-clothing-reviews>

23,486 rows × 10 feature columns. Real commercial data, anonymised by the publisher, with
references to the retailer replaced by "retailer" in the review text.
