#!/usr/bin/env python3
"""Package the project as the submission .zip.

Includes the notebook, scripts, documentation, screenshots, result tables and the
dataset; excludes git metadata and caches. Run from anywhere:

    python scripts/make_submission_zip.py [-o OUTPUT.zip]
"""
import argparse
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXCLUDE_DIRS = {".git", "__pycache__", ".ipynb_checkpoints", ".venv"}


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("-o", "--output", default=str(ROOT.parent / f"{ROOT.name}.zip"))
    args = ap.parse_args()
    out = Path(args.output).resolve()

    n = 0
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zf:
        for path in sorted(ROOT.rglob("*")):
            if not path.is_file() or path.resolve() == out:
                continue
            if EXCLUDE_DIRS & set(path.relative_to(ROOT).parts):
                continue
            zf.write(path, Path(ROOT.name) / path.relative_to(ROOT))
            n += 1

    print(f"wrote {out}  ({n} files, {out.stat().st_size / 1e6:.1f} MB)")


if __name__ == "__main__":
    main()
