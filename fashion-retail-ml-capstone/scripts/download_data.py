#!/usr/bin/env python3
"""Fetch the Women's E-Commerce Clothing Reviews dataset into ./data/.

Two routes, tried in order:

1. **Kaggle** (the canonical source) if the `kaggle` CLI is installed and
   ~/.kaggle/kaggle.json holds a valid API token:

       pip install kaggle
       # put your token from kaggle.com/settings into ~/.kaggle/kaggle.json
       kaggle datasets download -d nicapotato/womens-ecommerce-clothing-reviews -p ./data
       cd data && unzip womens-ecommerce-clothing-reviews.zip

2. **A public GitHub mirror** of the same CSV, for environments without a Kaggle
   account. The file is byte-identical in structure: 23,486 rows x 10 feature
   columns plus the unnamed index column.

The script verifies the shape and the required columns either way.
"""
import subprocess
import sys
import urllib.request
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
CSV = DATA / "Womens Clothing E-Commerce Reviews.csv"

KAGGLE_SLUG = "nicapotato/womens-ecommerce-clothing-reviews"
MIRROR_URL = (
    "https://raw.githubusercontent.com/nethajinirmal13/Training-datasets/main/"
    "Womens%20Clothing%20E-Commerce%20Reviews.csv"
)

REQUIRED_COLUMNS = [
    "Clothing ID", "Age", "Title", "Review Text", "Rating", "Recommended IND",
    "Positive Feedback Count", "Division Name", "Department Name", "Class Name",
]
EXPECTED_ROWS = 23486


def try_kaggle() -> bool:
    token = Path.home() / ".kaggle" / "kaggle.json"
    if not token.exists():
        print("  no ~/.kaggle/kaggle.json - skipping Kaggle route")
        return False
    try:
        subprocess.run(
            ["kaggle", "datasets", "download", "-d", KAGGLE_SLUG, "-p", str(DATA)],
            check=True,
        )
    except (subprocess.CalledProcessError, FileNotFoundError) as exc:
        print(f"  Kaggle download failed ({exc}) - falling back to the mirror")
        return False
    for archive in DATA.glob("*.zip"):
        with zipfile.ZipFile(archive) as zf:
            zf.extractall(DATA)
        archive.unlink()
    return CSV.exists()


def try_mirror() -> bool:
    print(f"  downloading from the public mirror ...")
    try:
        urllib.request.urlretrieve(MIRROR_URL, CSV)
    except Exception as exc:                       # noqa: BLE001
        print(f"  mirror download failed: {exc}")
        return False
    return CSV.exists()


def verify() -> None:
    import pandas as pd

    df = pd.read_csv(CSV, index_col=0)
    missing = [c for c in REQUIRED_COLUMNS if c not in df.columns]
    if missing:
        raise SystemExit(f"FAILED: dataset is missing columns {missing}")
    print(f"\nOK  {CSV.relative_to(ROOT)}")
    print(f"    {df.shape[0]:,} rows x {df.shape[1]} columns")
    if df.shape[0] != EXPECTED_ROWS:
        print(f"    NOTE: expected {EXPECTED_ROWS:,} rows - results will differ "
              f"from those in docs/WRITTEN_SUMMARY.md")
    print(f"    missing Review Text: {df['Review Text'].isna().sum():,}")


def main() -> None:
    DATA.mkdir(parents=True, exist_ok=True)
    if CSV.exists():
        print(f"{CSV.relative_to(ROOT)} already present - verifying only.")
        verify()
        return
    print("Fetching the dataset ...")
    if try_kaggle() or try_mirror():
        verify()
    else:
        sys.exit(
            "Could not obtain the dataset automatically.\n"
            "Download it manually from "
            "https://www.kaggle.com/datasets/nicapotato/womens-ecommerce-clothing-reviews\n"
            f"and place the CSV at {CSV}"
        )


if __name__ == "__main__":
    main()
