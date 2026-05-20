import os
import glob

banner_html = """
<style>
.global-banner {
  background: var(--accent);
  color: var(--white);
  text-align: center;
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 500;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.global-banner a {
  color: var(--white);
  text-decoration: underline;
  margin-left: 8px;
}
nav {
  top: 40px !important;
}
body {
  padding-top: 40px !important;
}
</style>
<div class="global-banner">
  <span>🚀 ¡Nueva actualización disponible! <a href="/test">Descubre /test</a> 🚀</span>
</div>
"""

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if '<div class="global-banner">' in content:
        return # already added

    if '<body>' in content:
        content = content.replace('<body>', '<body>\n' + banner_html, 1)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Added banner to {filepath}")

files = glob.glob('blog/**/*.html', recursive=True)
files.append('index.html')

for f in files:
    process_file(f)
