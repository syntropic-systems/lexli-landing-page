# Written Summary — Fashion Retail ML Capstone

**Author:** _[your name]_
**Dataset:** Women's E-Commerce Clothing Reviews (23,486 raw rows → 22,641 modelled)
**Notebook:** `notebooks/fashion_retail_capstone.ipynb` — every number below is produced by that
notebook and mirrored in `outputs/results.json`. `random_state=42` throughout.

---

## Task 1 — Cross-tab disagreement count + explanation

Dropping rows with a missing `Review Text` removed **845 rows** (3.60%), leaving **22,641**.
The target splits **81.89% recommend (18,540) / 18.11% do not recommend (4,101)** — a 4.52 : 1
imbalance.

**2×2 cross-tab of Rating group against `Recommended IND`:**

| | Not recommended (0) | Recommended (1) |
|---|---:|---:|
| **Rating 1–3** | 3,914 | **1,279** |
| **Rating 4–5** | **187** | 17,261 |

Both disagreement cells are non-zero. The large one is **1,279 reviews rated 1–3 that are still
flagged "would recommend"** (5.6% of the corpus); the mirror cell holds 187.

**Explanation.** The disagreement is almost entirely a 3-star phenomenon: of those 1,279 reviews,
**1,170 are 3-star**, 94 are 2-star and only 15 are 1-star. A 3-star rating is the customer saying
*"this was fine, with caveats"* — but the recommend flag is binary, with no lukewarm option. Faced
with a yes/no question about a product that was acceptable rather than disappointing, a net-positive
but unenthusiastic customer answers "yes". The two fields are also answering different questions:
the star rating scores *my experience of this garment*, while the recommend flag scores *whether
someone else should buy it* — and reviewers routinely resolve a personal disappointment
("beautiful top, but too short on me") into a recommendation for a differently-shaped shopper.

The practical consequence for this capstone is that `Recommended IND` is a **noisier** target than
`Rating`, and roughly a quarter of the 1–3 star population is mislabelled relative to naive
expectation. That noise puts a real ceiling on achievable precision in Task 5.

---

## Task 2 — Sentiment vs. rating disagreement example

**Case A — 5 stars, most negative polarity in the corpus** (`Class Name`: Sweaters):

> "I would have bought this had it not been for the way the pockets are sewn in. they are attached
> on the inside by a string. if the string broke the pockets would dangle. for the price you would
> think they would have sewn pockets in to the vest. too bad."

| Field | Value |
|---|---|
| `review_length` (words) | **51** |
| `sentiment_polarity` | **−0.7000** |
| `sentiment_subjectivity` | 0.6667 |
| `Rating` | **5** |
| `Recommended IND` | 1 |

**Case B — 1 star, most positive polarity** (`Class Name`: Lounge), for the mirror direction:

> "This is a great dress if you don't want to leave the house or you want the world to see your nipples."

| Field | Value |
|---|---|
| `review_length` (words) | **22** |
| `sentiment_polarity` | **+0.8000** |
| `sentiment_subjectivity` | 0.7500 |
| `Rating` | **1** |
| `Recommended IND` | 0 |

Clear disagreement of this kind covers **718 reviews (3.17%)** of the corpus.

**Why a model benefits from having both signals rather than just one:** the rating is the customer's
*summary verdict* while polarity measures the *language they actually used*, so the two are
independent views of the same event — and their disagreement is itself the signal, since Case A
("too bad", "if the string broke") is a genuine product defect report that the 5-star rating hides
completely, while Case B is sarcasm that the raw words score as glowing.

> **Two spec notes recorded honestly.** (1) Task 2 names *five* derived numeric columns
> (`review_length`, `exclam_count`, `question_count`, `sentiment_polarity`,
> `sentiment_subjectivity`) while Tasks 3 and 6 refer to "the 4 numeric columns"; all five are
> included. (2) Sentiment is computed on the **original** review text rather than the cleaned text,
> because TextBlob's pattern analyser uses casing and punctuation (`!` as an intensifier) that
> cleaning would destroy. `exclam_count` and `question_count` are, as required, counted before
> punctuation is stripped.

---

## Task 3 — Why a random split is OK here + why stratify matters

**Why random is acceptable now but was not in the forecasting case study.** The property that
changes the answer is **independence between rows**. In the retail forecasting problem each row was
one step of a single autocorrelated time series: tomorrow's value is a function of today's, so a
random split puts observations from *after* the test point into training and lets the model
interpolate a gap it would never get to interpolate in production — the reported error is a fiction.
Here each row is a **separate customer's review of a separate purchase**; there is no ordering, no
autocorrelation and no dependence between row *i* and row *i+1*, and the deployed task is to score
a review that already exists, not to extrapolate forward in time. Nothing leaks across a random
boundary because there is no boundary to leak across. (Worth stating plainly: this dataset has no
timestamp column at all, so a chronological split is not even constructible — and if the real
deployment is "score next season's reviews", drift is a risk that *no* split of this data can measure.)

**Why `stratify=y` matters.** Task 1 established an 81.89 / 18.11 imbalance, so an unstratified
20% draw could easily hand the validation set a materially different minority share — and since
every metric that matters here (class-0 precision, recall, F1) is measured against that minority
base rate, the comparison between the five models would be reading split noise as model quality.
Stratifying pins the proportions: train 81.88% / validation 81.89%.

---

## Task 4 — Baseline vs. all 4 models' accuracy, and why accuracy misleads

All metrics are on the 4,529-row held-out validation split. Precision/recall/F1 are computed with
respect to **class 0 ("would not recommend")** — the minority class and the event the business
actually cares about, so a *false negative* means a dissatisfied customer we failed to flag.

| Model | Accuracy | Precision (0) | Recall (0) | F1 (0) | ROC-AUC |
|---|---:|---:|---:|---:|---:|
| Baseline (majority class) | 0.8189 | 0.0000 | 0.0000 | 0.0000 | 0.500 |
| **Logistic Regression (balanced)** | 0.8377 | 0.5326 | **0.8463** | **0.6538** | **0.9082** |
| Logistic Regression (default) | **0.8757** | 0.7282 | 0.5000 | 0.5929 | 0.9065 |
| Random Forest (balanced) | 0.8662 | 0.6430 | 0.5866 | 0.6135 | 0.8910 |
| Random Forest (default) | 0.8567 | 0.7552 | 0.3085 | 0.4381 | 0.8882 |

**Why accuracy alone is a misleading way to judge success here — with these numbers.** The baseline
model contains no intelligence whatsoever: it predicts "would recommend" for every single review
and never once looks at the text. It scores **81.89% accuracy**. That single fact disqualifies
accuracy as a success measure, because 81.89% is not a floor a useful model has to beat — it is
what you get for doing nothing, and it is a direct readout of the class balance rather than of skill.

It gets worse: **the highest-accuracy model in the table is not the most useful one.** Logistic
Regression (default) scores **87.57% accuracy**, a full 3.8 points above the balanced version's
83.77% — and yet it finds only **50.0%** of dissatisfied customers where the balanced model finds
**84.6%**. Ranking by accuracy would have us ship the model that misses **410** of the 820
dissatisfied customers in the validation set instead of the one that misses 126. Random Forest
(default) is the extreme case: 85.67% accuracy, and it catches barely **30.9%** of them.

The reason is arithmetic. Class 0 is only 18.11% of the data, so a model can surrender the *entire*
minority class and still forfeit only 18 accuracy points, while every unflagged happy customer is
scored as a win. Accuracy averages over a population in which the interesting cases are outnumbered
4.5 : 1, which is precisely the population where an average is the wrong summary. **F1 on class 0**
and **ROC-AUC** are the honest measures, and they rank the models differently: the baseline's ROC-AUC
is 0.500 — pure chance — against 0.9082 for the winner.

**Best model by F1 on class 0: Logistic Regression (balanced), F1 = 0.6538.** Carried into Task 5.

---

## Task 5 — F1-optimal threshold, and manual adjustment direction/reasoning

Threshold-selection rule (fixed, not a free choice): sweep every threshold returned by
`precision_recall_curve`, compute `F1 = 2·p·r / (p + r)`, take the `argmax`.

**F1-optimal threshold = 0.5869** on P(would not recommend). ROC-AUC = **0.9082** (threshold-independent).

| Threshold rule | Threshold | Precision | Recall | F1 |
|---|---:|---:|---:|---:|
| Default | 0.5000 | 0.5326 | **0.8463** | 0.6538 |
| F1-optimal (argmax over PR curve) | **0.5869** | **0.5790** | 0.7817 | **0.6653** |

At the F1-optimal threshold the confusion matrix is 641 true positives, **179 dissatisfied customers
missed**, 466 happy customers needlessly double-checked, 3,243 correctly left alone. The F1 argmax
buys +4.6 points of precision for −6.5 points of recall — a trade that maximises the *statistic* and
loses on the *business objective*.

**Direction of manual adjustment: move the threshold LOWER than the F1-optimal 0.5869.**

**Justification (one sentence):** F1 is the harmonic mean of precision and recall and therefore
weights a missed dissatisfied customer exactly as heavily as an unnecessary double-check, which is
not the stated cost structure — since a false negative (a churning customer, an unflagged product
defect, a return we could have prevented) costs more than a false positive (a few minutes of a
merchandiser's attention on a happy review), the threshold should be pushed down until the marginal
precision loss finally outweighs the recall gain.

**Concretely, using the numbers above:** dropping from 0.5869 back to 0.5000 recovers recall from
**78.2% → 84.6%** — catching **53 more** of the 820 dissatisfied customers in the validation set —
at a precision cost of 57.9% → 53.3%, i.e. roughly 100 extra happy reviews landing in the queue.
If the merchandising team can absorb that review volume, and on this cost asymmetry it plainly can,
0.50 or lower is the better operating point than the F1 argmax.

---

## Task 6 — Structured vs. text-derived importance percentages

Importances from the Task 4 **Random Forest (balanced)** model (the balanced variant is the
deployable one; the default-weighted forest barely flags the minority class at all).

**Top 10 individual features**

| # | Feature | Importance | % of total |
|---:|---|---:|---:|
| 1 | `sentiment_polarity` | 0.08990 | **8.99%** |
| 2 | `exclam_count` | 0.02596 | 2.60% |
| 3 | `tfidf__love` | 0.02078 | 2.08% |
| 4 | `sentiment_subjectivity` | 0.01987 | 1.99% |
| 5 | `tfidf__perfect` | 0.01985 | 1.99% |
| 6 | `tfidf__comfortable` | 0.01834 | 1.83% |
| 7 | `review_length` | 0.01752 | 1.75% |
| 8 | `tfidf__great` | 0.01518 | 1.52% |
| 9 | `Age` | 0.01414 | 1.41% |
| 10 | `tfidf__looked` | 0.01401 | 1.40% |

**Two families**

| Family | Features | Total importance | **% of total** |
|---|---:|---:|---:|
| Text-derived (5 NLP numeric + 300 TF-IDF) | 305 | 0.9550 | **95.50%** |
| Structured (Age, Positive Feedback Count, 26 one-hot) | 28 | 0.0450 | **4.50%** |

**Which family is higher: Text-derived, 95.50% against 4.50% — a factor of 21.**

**Does that match the Task 1 intuition?** Yes, and the EDA said so in advance. Task 1's three plots
described *volume and shape* — how many reviews per department, how long they are, how ratings
distribute — and none of them showed a structured field that separates recommenders from
non-recommenders. Departments differ by only a few points of recommend rate; the Task 1 cross-tab
showed even `Rating`, the strongest structured signal available, disagreeing with the target 1,466
times. The discriminating information was always going to be in the words.

**One honest caveat, and it is checked rather than waved at.** 95.50% vs 4.50% is partly an artefact
of counting: the text family has **305 features to the structured family's 28**, and Gini importance
is diluted across correlated columns and inflated for high-cardinality ones. Normalising for family
size, average importance per feature is **0.313% (text-derived) vs 0.161% (structured)** — text is
still ahead, but by roughly **2×, not 21×**. Both statements are true and the second is the one to
quote in a modelling discussion. It does not change the conclusion: the top-ranked feature by a
factor of 3.5 is `sentiment_polarity`, a text-derived feature, and the highest-ranked structured
feature (`Age`) sits 9th at 1.41%.

---

## Task 7 — Cluster names, grounded in per-cluster averages, + one action each

Grain: `Class Name`, 20 classes, five standardised aggregates. The 13 rows with a null Class Name
were excluded from the clustering grain (they are a null bucket, not a product class).

**Silhouette score for every K tested (the required full table):**

| K | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Silhouette | **0.6263** | 0.4415 | 0.4644 | 0.4882 | 0.2560 | 0.2550 | 0.2412 |

The rule selects **K = 2**. Per-cluster means:

| Cluster | n classes | avg_rating | recommend_rate | review_count | avg_sentiment | avg_age |
|---|---:|---:|---:|---:|---:|---:|
| 0 | 18 | 4.2154 | 0.8304 | 1,257.0 | 0.2481 | 42.79 |
| 1 | 2 | 4.0000 | 1.0000 | 1.0 | 0.4650 | 32.00 |

**Named — from the required rule**

* **Cluster 0 — "The Reviewed Assortment"** (18 classes, 22,626 reviews, avg_rating 4.22,
  recommend_rate 83.0%). Every product class customers actually write about.
  *Action:* none specific — this cluster is the business, so it cannot be acted on as a segment;
  see the tiers below for a partition that can.
* **Cluster 1 — "The Single-Review Long Tail"** (2 classes — `Casual bottoms`, `Chemises` —
  with **one review each**, recommend_rate 1.000 off a single respondent, avg_age 32.0).
  *Action:* suppress these classes from any ranking, dashboard or automated alert, and set a
  minimum-review-volume gate (say 30) before a class is scored at all — a 100% recommend rate from
  one customer is noise that will otherwise top every "best performing" list.

**This result is honest but degenerate**, and the summary says so rather than dressing it up:
K-Means found the two singleton outliers, the silhouette score rewarded that split handsomely
(0.626), and the "winning" partition puts 18 of 20 classes in one bucket. It tells merchandising
nothing.

**Robustness re-run.** The *identical* procedure — same five features, same `StandardScaler`, same
K = 2..8 sweep, same `random_state=42`, `n_init=10` — applied to the 18 classes with ≥ 30 reviews.
This is the only judgement call in Task 7, it is stated rather than hidden, and it is insensitive to
the cut-off: the two singletons are the only classes below 118 reviews, so any threshold from 2 to
118 gives identical clusters.

| K | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Silhouette | **0.3555** | 0.3051 | 0.3084 | 0.3208 | 0.2412 | 0.2448 | 0.2518 |

| Tier | n classes | avg_rating | recommend_rate | review_count | avg_sentiment | avg_age |
|---|---:|---:|---:|---:|---:|---:|
| 0 | 12 | 4.2717 | 0.8473 | 587.9 | 0.2533 | 42.20 |
| 1 | 6 | 4.1028 | 0.7965 | 2,595.2 | 0.2379 | 43.96 |

* **Tier 0 — "Quiet Favourites"** — 12 classes (`Fine gauge`, `Intimates`, `Jackets`, `Jeans`,
  `Layering`, `Legwear`, `Lounge`, `Pants`, `Shorts`, `Skirts`, `Sleep`, `Swim`), averaging 588
  reviews each, **avg_rating 4.27**, **recommend_rate 84.7%**, avg_sentiment 0.253.
  *Action:* stop treating these as filler. They out-recommend the headline categories by 5.1 points
  on a fifth of the traffic — give the best of them (`Jeans` at 88.0%, `Layering` at 87.9%) homepage
  and email placement they currently do not get, and read the volume gap as a merchandising
  opportunity rather than as weak demand.
* **Tier 1 — "High-Traffic Underperformers"** — 6 classes (`Blouses`, `Dresses`, `Knits`,
  `Outerwear`, `Sweaters`, `Trend`), averaging 2,595 reviews each — **69% of all reviewed volume** —
  but **avg_rating 4.10** and the **lowest recommend_rate at 79.6%**, with the lowest avg_sentiment
  (0.238) and the oldest shoppers (44.0).
  *Action:* this is where the returns budget is being spent, so put the product-page work here first
  — on-body photography across a range of sizes, fabric drape and weight detail, explicit composition
  callouts — and start with `Trend` (74.6% recommend rate, the worst class in the assortment) and
  `Sweaters` (79.7%).

**The headline: the classes that generate the most reviews are the ones customers recommend least** —
a 5.08-point recommend-rate gap on 4.4× the volume.

---

## Task 8 — Complaint theme and suggested action

Method: the Task 2 vectoriser **fitted on the training split only**, applied with `.transform()`;
mean TF-IDF weight per term computed separately within the 4,101 negative and 18,540 positive
reviews; `difference = mean_negative − mean_positive`, sorted descending.

| # | Term | Mean TF-IDF (neg) | Mean TF-IDF (pos) | Difference | % of neg reviews | % of pos reviews | Lift |
|---:|---|---:|---:|---:|---:|---:|---:|
| 1 | looked | 0.03499 | 0.00829 | 0.026698 | 12.90% | 3.60% | 3.6× |
| 2 | disappointed | 0.02749 | 0.00302 | 0.024472 | 9.02% | 1.11% | **8.2×** |
| 3 | like | 0.06154 | 0.03929 | 0.022251 | 33.87% | 23.39% | 1.4× |
| 4 | wanted | 0.02868 | 0.00733 | 0.021356 | 10.92% | 3.06% | 3.6× |
| 5 | fabric | 0.05228 | 0.03110 | 0.021178 | 24.68% | 16.76% | 1.5× |
| 6 | way | 0.03413 | 0.01353 | 0.020593 | 13.85% | 6.14% | 2.3× |
| 7 | returned | 0.02379 | 0.00347 | 0.020313 | 6.95% | 1.24% | 5.6× |
| 8 | return | 0.02549 | 0.00629 | 0.019196 | 8.34% | 2.30% | 3.6× |
| 9 | unfortunately | 0.02329 | 0.00421 | 0.019082 | 8.10% | 1.53% | 5.3× |
| 10 | returning | 0.02123 | 0.00296 | 0.018268 | 6.22% | 0.97% | **6.4×** |

**Translated into four plain-English complaint themes.** Several of the top terms are ambiguous in
isolation, so each was checked against its most frequent phrasings in the negative corpus:

1. **Thwarted expectation** — `wanted`, `looked`, `like`, `way`. The single most common phrase in
   the entire negative corpus is **"i wanted to love" (131 occurrences)**, followed by "really
   wanted to love" (69) and "really wanted to like" (39); `looked` appears as "it looked like a…",
   "looked like a sack", "looked like a maternity…"; `way` as "was way too big / too short".
   These are customers who chose the item deliberately and found the garment that arrived was not
   the one they thought they were buying. Present in **53.3%** of negative vs 31.9% of positive
   reviews (**1.67×**).
2. **Return intent** — `return`, `returned`, `returning`. **22.3%** of negative vs 4.7% of positive
   reviews (**4.78×**) — an explicitly stated outcome, not a mood.
3. **Fabric and quality** — `fabric`, plus `material`, `cheap`, `thin`, `sheer`. **49.7%** vs 34.8%
   (**1.43×**).
4. **Stated disappointment** — `disappointed`, `unfortunately`. **21.7%** vs 3.5% (**6.23×**), the
   sharpest separator of all, though a symptom marker rather than a cause anyone can fix.

**The non-finding that matters.** No sizing word appears anywhere in the top 10. Tested explicitly
as a counter-hypothesis, fit/sizing vocabulary (`small`, `large`, `tight`, `size`, `fit`, `big`,
`petite`) appears in **58.5% of negative reviews — and 61.4% of positive ones**, a lift of **0.95×**.
Sizing is simply how this customer base writes about clothing; it carries no information about
satisfaction. "Audit the size charts", the instinctive first move, would be chasing an artefact of
the register these reviewers write in.

**Theme chosen: Thwarted expectation.** **Concrete action:** for the six "High-Traffic
Underperformers" classes, mandate a product-page standard before any further sizing work — at least
three on-body photographs spanning a range of body types and sizes, a stated fabric composition and
weight, and a short drape/stretch descriptor. "I wanted to love this" is a pre-purchase information
failure, not a manufacturing one: the customer's expectation was set by the product page, and it is
the product page that is cheapest to fix. Measure it as a fortnightly A/B on the recommend rate of
the treated classes, with `Trend` and `Sweaters` first.

---

## Task 9 — Executive Synthesis

**For: merchandising and commercial leadership. One page, no modelling background assumed.**

We now have a model that reads a customer review and tells us whether that customer would recommend
the product — before enough star ratings pile up for the problem to become visible the slow way.
On reviews it had never seen, it correctly identifies **78% of dissatisfied customers** while being
right **58% of the time** it raises a flag (ROC-AUC 0.908). For comparison, the do-nothing
alternative — assume every customer is happy — is "right" **81.9%** of the time and catches
**precisely zero** unhappy customers. That contrast is the whole argument for this project: the
headline accuracy number is the one that flatters doing nothing, and the recall number is the one
that pays.

**Where the problem sits.** Grouping our 18 reviewed product classes purely on customer behaviour —
no labels, no prior assumptions — the data splits cleanly into two tiers. **"Quiet Favourites"**
(12 classes: Jeans, Layering, Intimates, Skirts, Pants and others) average a **4.27** rating and an
**84.7%** recommend rate. **"High-Traffic Underperformers"** (6 classes: Dresses, Knits, Blouses,
Sweaters, Outerwear, Trend) carry **69% of all our review volume** and post the **lowest recommend
rate at 79.6%**. The uncomfortable headline is that **the products customers engage with most are the
ones they recommend least** — a 5.1-point gap concentrated exactly where the volume is. `Trend` is
the worst class in the assortment at a **74.6%** recommend rate.

**What those customers are actually saying.** Reading 4,101 negative reviews at scale, the language
that separates a complaint from a compliment is not what we would have guessed. The strongest marker
is plain disappointment (**6.2×** more common in negative reviews), and **22%** of unhappy reviewers
state outright that they are returning the item (**4.8×**). But the actionable theme is
**"Thwarted expectation"** — present in **53%** of negative reviews against 32% of positive ones.
The most common phrase in the entire negative corpus is **"I wanted to love"** (131 occurrences),
followed by "really wanted to love" (69). These are not customers who bought by accident; they are
customers who chose deliberately and found that what arrived was not what the product page promised.

**The finding that should change our first move.** Sizing is the thing everyone assumes drives
fashion complaints. It does not, here. Sizing language appears in **58% of negative reviews and 61%
of positive ones** — it is how this customer base writes about clothing generally, and it carries no
signal about satisfaction whatsoever. Had we started with a size-chart audit, the instinctive first
move, we would have spent a quarter on a metric that cannot move.

**The connected action.** The three pieces line up on one target. The weakest tier is
**"High-Traffic Underperformers"**; the model performs *better* there than anywhere else —
**80.7% recall** against 72.0% on the other tier — so we can monitor precisely the six classes that
need monitoring; and expectation-mismatch language is at its densest in those same classes
(**54.9%** of their negative reviews). The highest-leverage action is therefore a **product-page
standard for those six classes**: on-body photography across a range of sizes, fabric weight and
drape stated explicitly, composition called out. Deploy the classifier at a threshold **below** its
statistically optimal point — missing an unhappy customer costs us more than double-checking a happy
one — and route flagged reviews to merchandising as a weekly queue, starting with `Trend` and
`Sweaters`.

**What this does not claim.** The tier split is real but modest — a 5-point recommend-rate gap, not
a chasm — and the two tiers separate primarily on volume, so part of the effect may be that
high-traffic classes attract a broader, harder-to-please audience rather than that the garments are
worse. The expectation-mismatch theme is measured by keyword groups, which is a blunt instrument.
And the model's 58% precision means roughly two flags in five are false alarms. This is a credible,
modest, checkable link between three analyses — not a dramatic conclusion, and the numbers do not
support forcing one.

---

### Reproducibility

Every figure quoted above appears in `notebooks/fashion_retail_capstone.ipynb` with its output
visible, is written to `outputs/results.json` by the final cell, and is regenerated exactly by
`python scripts/build_notebook.py`. `random_state=42` is passed to `train_test_split`,
`LogisticRegression`, `RandomForestClassifier`, `DummyClassifier` and every `KMeans`.
