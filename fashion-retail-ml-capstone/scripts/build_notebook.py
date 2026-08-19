#!/usr/bin/env python3
"""Assemble and execute notebooks/fashion_retail_capstone.ipynb.

The notebook is generated from the cell definitions in ``_cells_part*.py`` so that
the source of truth is plain, reviewable Python rather than a JSON blob. Run:

    python scripts/build_notebook.py            # build + execute
    python scripts/build_notebook.py --no-exec  # build only
"""
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
sys.path.insert(0, str(HERE))

import nbformat
from nbformat.v4 import new_notebook, new_code_cell, new_markdown_cell

import _cells_part1 as p1
import _cells_part2  # noqa: F401  (registers its cells on import)
import _cells_part3  # noqa: F401
import _cells_part4  # noqa: F401
import _cells_part5  # noqa: F401
import _cells_part6  # noqa: F401
import _cells_part7  # noqa: F401

NB_PATH = ROOT / "notebooks" / "fashion_retail_capstone.ipynb"


def build():
    nb = new_notebook()
    for kind, source in p1.CELLS:
        nb.cells.append(new_markdown_cell(source) if kind == "markdown"
                        else new_code_cell(source))
    nb.metadata["kernelspec"] = {
        "display_name": "Python 3", "language": "python", "name": "python3",
    }
    nb.metadata["language_info"] = {"name": "python", "version": "3.11"}
    NB_PATH.parent.mkdir(parents=True, exist_ok=True)
    nbformat.write(nb, NB_PATH)
    n_code = sum(1 for k, _ in p1.CELLS if k == "code")
    print(f"built {NB_PATH.relative_to(ROOT)}: {len(p1.CELLS)} cells "
          f"({n_code} code, {len(p1.CELLS) - n_code} markdown)")
    return nb


def execute(nb):
    from nbconvert.preprocessors import ExecutePreprocessor
    ep = ExecutePreprocessor(timeout=1800, kernel_name="python3")
    print("executing ...")
    ep.preprocess(nb, {"metadata": {"path": str(ROOT / "notebooks")}})
    nbformat.write(nb, NB_PATH)
    print(f"executed and saved -> {NB_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    notebook = build()
    if "--no-exec" not in sys.argv:
        execute(notebook)
