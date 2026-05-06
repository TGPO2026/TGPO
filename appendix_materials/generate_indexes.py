import os
import json
import re

def update_indexes():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    subdirs = [d for d in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, d))]

    mapping = {}

    for subdir in subdirs:
        subdir_path = os.path.join(base_dir, subdir)
        index_path = os.path.join(subdir_path, 'index.html')
        
        if not os.path.exists(index_path):
            continue
            
        items = sorted(os.listdir(subdir_path))
        rows = []
        for item in items:
            if item == 'index.html' or item.startswith('.'):
                continue
                
            item_path = os.path.join(subdir_path, item)
            rel_path = os.path.relpath(item_path, base_dir)
            mapping[item] = rel_path
            
            is_dir = os.path.isdir(item_path)
            href = item + '/index.html' if is_dir else item
            desc = f"Folder {item}" if is_dir else f"Auto-detected file: {item}"
            
            meta_links = f'<a href="{href}" target="_blank">view</a>'
            if not is_dir:
                meta_links += f'\n          <a href="{href}" download>download</a>'
            
            row_html = f"""      <div class="row">
        <div class="name">
          <a href="{href}">{item}</a>
        </div>
        <div class="desc">
          {desc}
        </div>
        <div class="meta">
          {meta_links}
        </div>
      </div>"""
            rows.append(row_html)
            
        with open(index_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Replace everything between <div class="dirlist"> and </div> before <div class="note">
        pattern = re.compile(r'(<div class="dirlist">)(.*?)(</div>\s*<div class="note">)', re.DOTALL)
        
        if not rows:
            new_inner = """
        <div class="empty-state">
          <p>No files found.</p>
        </div>
    """
        else:
            new_inner = "\n" + "\n".join(rows) + "\n    "
            
        new_content = pattern.sub(lambda m: m.group(1) + new_inner + m.group(3), content)
        
        with open(index_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

    # Save mapping file
    mapping_file = os.path.join(base_dir, 'file_mapping.json')
    with open(mapping_file, 'w', encoding='utf-8') as f:
        json.dump(mapping, f, indent=2)

    print(f"Updated index.html files and generated mapping at {mapping_file}")

if __name__ == "__main__":
    update_indexes()
