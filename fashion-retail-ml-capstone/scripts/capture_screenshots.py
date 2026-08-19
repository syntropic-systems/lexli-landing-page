#!/usr/bin/env python3
"""Screenshot the key steps and results of the executed notebook.

Renders docs/fashion_retail_capstone.html in headless Chromium and captures one
image per task section, plus a full-page image of the whole notebook. Run after
scripts/build_notebook.py:

    python -m nbconvert --to html --output-dir docs notebooks/fashion_retail_capstone.ipynb
    python scripts/capture_screenshots.py
"""
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
HTML = ROOT / "docs" / "fashion_retail_capstone.html"
SHOTS = ROOT / "docs" / "screenshots"
CHROMIUM = next(
    (str(p) for p in sorted(Path("/opt/pw-browsers").glob("chromium-*/chrome-linux/chrome"))),
    None,
)

# (output name, heading text to anchor on, how many following siblings to include)
SECTIONS = [
    ("01_task1_eda",              "Task 1", 26),
    ("02_task2_nlp_features",     "Task 2", 22),
    ("03_task3_model_ready",      "Task 3", 16),
    ("04_task4_classification",   "Task 4", 14),
    ("05_task5_threshold",        "Task 5", 14),
    ("06_task6_explainability",   "Task 6", 10),
    ("07_task7_clustering",       "Task 7", 26),
    ("08_task8_themes",           "Task 8", 10),
    ("09_task9_synthesis",        "Task 9", 18),
]

CLIP_JS = """
([headingText, nSiblings]) => {
  const heads = [...document.querySelectorAll('h2')];
  const h = heads.find(e => e.textContent.trim().startsWith(headingText));
  if (!h) return null;
  let cell = h.closest('.jp-Cell') || h.parentElement;
  let top = cell.getBoundingClientRect().top + window.scrollY;
  let bottom = top;
  let node = cell;
  for (let i = 0; i < nSiblings && node; i++) {
    node = node.nextElementSibling;
    if (!node) break;
    if (node.querySelector && node.querySelector('h2')) break;
    const r = node.getBoundingClientRect();
    bottom = Math.max(bottom, r.bottom + window.scrollY);
  }
  return {top, bottom};
}
"""


def main():
    if not HTML.exists():
        raise SystemExit(f"{HTML} not found - export the notebook to HTML first.")
    SHOTS.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as pw:
        launch_kwargs = {"executable_path": CHROMIUM} if CHROMIUM else {}
        browser = pw.chromium.launch(**launch_kwargs)
        page = browser.new_page(viewport={"width": 1440, "height": 1000},
                                device_scale_factor=1)
        page.goto(HTML.as_uri(), wait_until="load")
        page.wait_for_timeout(2500)

        full = SHOTS / "00_notebook_full.png"
        page.screenshot(path=str(full), full_page=True)
        print(f"  {full.name}")

        width = page.evaluate("document.documentElement.scrollWidth")
        for name, heading, n in SECTIONS:
            box = page.evaluate(CLIP_JS, [heading, n])
            if not box:
                print(f"  !! heading not found: {heading}")
                continue
            height = min(box["bottom"] - box["top"], 12000)
            out = SHOTS / f"{name}.png"
            # full_page=True is required: without it a clip is confined to the viewport.
            page.screenshot(path=str(out), full_page=True, clip={
                "x": 0, "y": box["top"], "width": width, "height": height})
            print(f"  {out.name}  ({int(height)}px tall)")

        browser.close()
    print(f"\n{len(list(SHOTS.glob('*.png')))} screenshots in docs/screenshots/")


if __name__ == "__main__":
    main()
