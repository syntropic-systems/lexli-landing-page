#!/usr/bin/env python3
"""Render the executed notebook as a single self-contained HTML page.

Every code cell gets a copy button; the whole notebook can be copied as a
clean .ipynb (outputs stripped) or as one Python script. Images and tables are
embedded, so the page has no external dependencies beyond Google Fonts.

    python scripts/build_artifact.py [-o OUT.html]
"""
from __future__ import annotations

import argparse
import html
import json
import re
from pathlib import Path

import nbformat
import markdown as md

ROOT = Path(__file__).resolve().parent.parent
NB_PATH = ROOT / "notebooks" / "fashion_retail_capstone.ipynb"

KEYWORDS = {
    "False", "None", "True", "and", "as", "assert", "async", "await", "break",
    "class", "continue", "def", "del", "elif", "else", "except", "finally",
    "for", "from", "global", "if", "import", "in", "is", "lambda", "nonlocal",
    "not", "or", "pass", "raise", "return", "try", "while", "with", "yield",
}
BUILTINS = {
    "abs", "all", "any", "bool", "dict", "display", "enumerate", "float",
    "format", "int", "len", "list", "max", "min", "print", "range", "round",
    "set", "sorted", "str", "sum", "tuple", "type", "zip", "isinstance",
    "getattr", "open", "map", "filter", "reversed", "super", "next", "iter",
}
STR_PREFIX = re.compile(r"[rRbBuUfF]{0,2}$")


def tokenize(src: str):
    """Yield (kind, text) spans of Python source. Raw text, never HTML."""
    i, n, out = 0, len(src), []

    def push(kind, text):
        if text:
            out.append((kind, text))

    while i < n:
        ch = src[i]

        if ch == "#":                                   # comment to end of line
            j = src.find("\n", i)
            j = n if j == -1 else j
            push("com", src[i:j])
            i = j
            continue

        if ch in "\"'":                                 # string, with prefix
            k = i
            while k > 0 and STR_PREFIX.fullmatch(src[k - 1:i]):
                k -= 1
            if out and out[-1][0] == "name" and k < i:
                out.pop()                               # the prefix was mis-read as a name
            quote = src[i:i + 3] if src[i:i + 3] in ('"""', "'''") else ch
            j = i + len(quote)
            while j < n:
                if src[j] == "\\":
                    j += 2
                    continue
                if src.startswith(quote, j):
                    j += len(quote)
                    break
                j += 1
            else:
                j = n
            push("str", src[k:j])
            i = j
            continue

        if ch.isdigit():                                # number
            j = i
            while j < n and (src[j].isalnum() or src[j] in "._"):
                j += 1
            push("num", src[i:j])
            i = j
            continue

        if ch.isalpha() or ch == "_":                   # identifier / keyword
            j = i
            while j < n and (src[j].isalnum() or src[j] == "_"):
                j += 1
            word = src[i:j]
            if j < n and src[j] in "\"'" and STR_PREFIX.fullmatch(word):
                i = j                                   # string prefix: let the string branch take it
                continue
            if word in KEYWORDS:
                kind = "kw"
            elif word in BUILTINS:
                kind = "bi"
            elif j < n and src[j] == "(":
                kind = "fn"
            else:
                kind = "name"
            push(kind, word)
            i = j
            continue

        if ch == "%" and (i == 0 or src[i - 1] == "\n"):   # IPython magic
            j = src.find("\n", i)
            j = n if j == -1 else j
            push("magic", src[i:j])
            i = j
            continue

        if ch in "+-*/=<>!&|^~@":                       # operator run
            j = i
            while j < n and src[j] in "+-*/=<>!&|^~@":
                j += 1
            push("op", src[i:j])
            i = j
            continue

        push("plain", ch)
        i += 1

    return out


def highlight(src: str) -> str:
    return "".join(
        html.escape(text) if kind == "plain"
        else f'<span class="t-{kind}">{html.escape(text)}</span>'
        for kind, text in tokenize(src)
    )


def render_outputs(cell) -> str:
    parts = []
    for out in cell.get("outputs", []):
        kind = out.get("output_type")
        if kind == "stream":
            parts.append(f'<pre class="out-text">{html.escape("".join(out.get("text", "")))}</pre>')
        elif kind in ("execute_result", "display_data"):
            data = out.get("data", {})
            if "image/png" in data:
                b64 = data["image/png"].replace("\n", "")
                parts.append(
                    f'<figure class="out-fig"><img alt="Notebook figure" '
                    f'src="data:image/png;base64,{b64}"></figure>')
            elif "text/html" in data:
                parts.append(f'<div class="out-html">{"".join(data["text/html"])}</div>')
            elif "text/plain" in data:
                parts.append(f'<pre class="out-text">{html.escape("".join(data["text/plain"]))}</pre>')
        elif kind == "error":
            tb = html.escape("\n".join(out.get("traceback", [])))
            parts.append(f'<pre class="out-text out-error">{tb}</pre>')
    return "".join(parts)


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def build(nb) -> tuple[str, list[tuple[str, str]]]:
    renderer = md.Markdown(extensions=["tables", "sane_lists"])
    body, toc = [], []

    for cell in nb.cells:
        if cell.cell_type == "markdown":
            renderer.reset()
            rendered = renderer.convert(cell.source)
            # Anchor every h2 so the task index can jump to it.
            def anchor(m):
                inner = m.group(1)
                label = re.sub(r"<[^>]+>", "", inner).strip()
                sid = slugify(label)
                toc.append((sid, label))
                return f'<h2 id="{sid}">{inner}</h2>'
            rendered = re.sub(r"<h2>(.*?)</h2>", anchor, rendered, flags=re.S)
            body.append(f'<section class="prose">{rendered}</section>')
        else:
            count = cell.get("execution_count")
            label = f"In [{count}]" if count is not None else "In [ ]"
            code = cell.source
            outputs = render_outputs(cell)
            body.append(f"""<section class="cell">
  <div class="cell-head">
    <span class="prompt">{html.escape(label)}</span>
    <button class="copy" type="button" data-code="{html.escape(code, quote=True)}">
      <span class="copy-label">Copy</span>
    </button>
  </div>
  <div class="code-wrap"><pre class="code"><code>{highlight(code)}</code></pre></div>
  {f'<div class="outputs">{outputs}</div>' if outputs else ''}
</section>""")

    return "\n".join(body), toc


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("-o", "--output", default=str(ROOT / "docs" / "notebook_artifact.html"))
    args = ap.parse_args()

    nb = nbformat.read(NB_PATH, as_version=4)
    body, toc = build(nb)

    # A clean .ipynb for copying: same cells, outputs stripped, ready to run.
    clean = nbformat.from_dict(json.loads(nbformat.writes(nb)))
    for c in clean.cells:
        if c.cell_type == "code":
            c["outputs"] = []
            c["execution_count"] = None
    clean_json = nbformat.writes(clean)

    all_code = "\n\n".join(c.source for c in nb.cells if c.cell_type == "code")

    n_code = sum(1 for c in nb.cells if c.cell_type == "code")
    toc_html = "\n".join(
        f'<a class="toc-link" href="#{sid}">{html.escape(label)}</a>' for sid, label in toc)

    def js_json(obj) -> str:
        return json.dumps(obj).replace("</", "<\\/")

    page = TEMPLATE
    for token, value in {
        "__BODY__": body,
        "__TOC__": toc_html,
        "__N_CELLS__": str(len(nb.cells)),
        "__N_CODE__": str(n_code),
        "__CLEAN_NB__": js_json(clean_json),
        "__ALL_CODE__": js_json(all_code),
    }.items():
        page = page.replace(token, value)

    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page, encoding="utf-8")
    print(f"wrote {out}  ({out.stat().st_size / 1e6:.2f} MB, "
          f"{len(nb.cells)} cells, {len(toc)} sections)")


TEMPLATE = Path(__file__).with_name("_artifact_template.html").read_text(encoding="utf-8")

if __name__ == "__main__":
    main()
