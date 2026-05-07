import json
import re
import html
from pathlib import Path


def get_appendix_dir():
    script_dir = Path(__file__).resolve().parent

    # 兼容两种情况：
    # 1. 脚本放在 appendix_materials/ 的上一级
    # 2. 脚本直接放在 appendix_materials/ 里面
    appendix_dir = script_dir / "appendix_materials"
    if appendix_dir.is_dir():
        return appendix_dir

    return script_dir


def title_from_folder(folder_name):
    if folder_name == "appendix_materials":
        return "Appendix Materials"
    return folder_name.replace("_", " ").replace("-", " ").title()


def create_index_html(index_path, folder_name):
    title = title_from_folder(folder_name)

    content = f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{html.escape(title)} - Appendix Materials</title>
    <style>
      body {{
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
        color: #222;
        background: #fff;
        line-height: 1.5;
      }}
      .wrap {{
        max-width: 920px;
        margin: 0 auto;
        padding: 32px 20px 56px;
      }}
      h1 {{
        margin: 0 0 8px;
        font-size: 1.8rem;
        font-weight: 600;
      }}
      p {{
        margin: 0 0 18px;
        color: #444;
      }}
      .nav {{
        margin: 0 0 24px;
        font-size: 0.98rem;
      }}
      .nav a {{
        color: #1a5fb4;
        text-decoration: none;
        margin-right: 14px;
      }}
      .nav a:hover {{
        text-decoration: underline;
      }}
      .section-title {{
        margin: 28px 0 10px;
        font-size: 1.08rem;
        font-weight: 600;
        color: #222;
      }}
      .dirlist {{
        border-top: 1px solid #d8d8d8;
      }}
      .row {{
        display: grid;
        grid-template-columns: minmax(0, 1.7fr) minmax(0, 2.3fr) auto;
        gap: 14px;
        padding: 10px 0;
        border-bottom: 1px solid #e6e6e6;
        align-items: start;
      }}
      .name {{
        min-width: 0;
        overflow-wrap: anywhere;
        word-break: break-word;
      }}
      .name a {{
        color: #1a5fb4;
        text-decoration: none;
      }}
      .name a:hover {{
        text-decoration: underline;
      }}
      .desc {{
        min-width: 0;
        color: #555;
        overflow-wrap: anywhere;
        word-break: break-word;
        font-size: 0.95rem;
      }}
      .meta {{
        text-align: right;
        white-space: nowrap;
        font-size: 0.92rem;
      }}
      .meta a {{
        color: #1a5fb4;
        text-decoration: none;
        margin-left: 10px;
      }}
      .meta a:hover {{
        text-decoration: underline;
      }}
      .note {{
        margin-top: 18px;
        font-size: 0.92rem;
        color: #666;
      }}
      @media (max-width: 760px) {{
        .row {{
          grid-template-columns: 1fr;
          gap: 6px;
        }}
        .meta {{
          text-align: left;
          white-space: normal;
        }}
        .meta a {{
          margin-left: 0;
          margin-right: 10px;
        }}
      }}
    </style>
  </head>
  <body>
    <div class="wrap">
      <h1>{html.escape(title)}</h1>
      <p>
        Auto-generated appendix section for reproducibility materials.
      </p>
      <div class="nav">
        <a href="../index.html">← Back to Parent Directory</a>
      </div>
      <div class="section-title">Files</div>
      <div class="dirlist">
      </div>
      <div class="note">
        Files in this section are automatically listed from the current folder.
      </div>
    </div>
  </body>
</html>
"""

    index_path.write_text(content, encoding="utf-8")


def should_skip(path):
    return path.name.startswith(".") or path.name == "__pycache__"


def collect_all_dirs(base_dir):
    all_dirs = [base_dir]

    for path in sorted(base_dir.rglob("*")):
        if not path.is_dir():
            continue

        rel_parts = path.relative_to(base_dir).parts
        if any(part.startswith(".") or part == "__pycache__" for part in rel_parts):
            continue

        all_dirs.append(path)

    return all_dirs


def ensure_indexes(base_dir):
    for dir_path in collect_all_dirs(base_dir):
        index_path = dir_path / "index.html"

        # 顶层 appendix_materials 如果没有 index.html，通常不强行创建；
        # 子文件夹没有 index.html 时自动创建。
        if dir_path == base_dir and not index_path.exists():
            create_index_html(index_path, "appendix_materials")
            continue

        if dir_path != base_dir and not index_path.exists():
            create_index_html(index_path, dir_path.name)


def build_rows(dir_path, base_dir):
    rows = []

    for item_path in sorted(dir_path.iterdir(), key=lambda p: p.name):
        if should_skip(item_path):
            continue

        if item_path.name == "index.html":
            continue

        # 只在 appendix_materials/ 顶层 index 中隐藏这两个文件
        if dir_path == base_dir and item_path.name in {"generate_indexes.py", "file_mapping.json"}:
            continue

        item = item_path.name
        is_dir = item_path.is_dir()

        href = f"{item}/index.html" if is_dir else item
        desc = f"Folder {item}" if is_dir else f"Auto-detected file: {item}"

        safe_item = html.escape(item)
        safe_href = html.escape(href, quote=True)
        safe_desc = html.escape(desc)

        meta_links = f'<a href="{safe_href}" target="_blank">view</a>'
        if not is_dir:
            meta_links += f'\n          <a href="{safe_href}" download>download</a>'

        row_html = f"""      <div class="row">
        <div class="name">
          <a href="{safe_href}">{safe_item}</a>
        </div>
        <div class="desc">
          {safe_desc}
        </div>
        <div class="meta">
          {meta_links}
        </div>
      </div>"""

        rows.append(row_html)

    if not rows:
        return """
        <div class="empty-state">
          <p>No files found.</p>
        </div>
    """

    return "\n" + "\n".join(rows) + "\n    "


def refresh_index(index_path, dir_path, base_dir):
    content = index_path.read_text(encoding="utf-8")
    new_inner = build_rows(dir_path, base_dir)

    pattern = re.compile(
        r'(<div class="dirlist">)(.*?)(</div>\s*<div class="note">)',
        re.DOTALL,
    )

    new_content, count = pattern.subn(
        lambda m: m.group(1) + new_inner + m.group(3),
        content,
        count=1,
    )

    if count == 0:
        raise ValueError(f'Cannot find <div class="dirlist"> block in {index_path}')

    index_path.write_text(new_content, encoding="utf-8")


def update_all_indexes(base_dir):
    for dir_path in collect_all_dirs(base_dir):
        index_path = dir_path / "index.html"

        if not index_path.exists():
            continue

        refresh_index(index_path, dir_path, base_dir)


def build_file_mapping(base_dir):
    mapping = {}

    for path in sorted(base_dir.rglob("*")):
        if should_skip(path):
            continue

        rel_parts = path.relative_to(base_dir).parts
        if any(part.startswith(".") or part == "__pycache__" for part in rel_parts):
            continue

        if path.name == "index.html":
            continue

        rel_path = path.relative_to(base_dir).as_posix()

        # 用相对路径作为 key，避免不同目录下同名文件互相覆盖
        mapping[rel_path] = f"https://tgpo2026.github.io/TGPO/appendix_materials/{rel_path}"

    return mapping


def update_indexes():
    base_dir = get_appendix_dir()

    ensure_indexes(base_dir)
    update_all_indexes(base_dir)

    mapping = build_file_mapping(base_dir)
    mapping_file = base_dir / "file_mapping.json"

    mapping_file.write_text(
        json.dumps(mapping, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    print(f"Updated all index.html files under: {base_dir}")
    print(f"Generated mapping at: {mapping_file}")


if __name__ == "__main__":
    update_indexes()