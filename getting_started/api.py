from flask import render_template, jsonify
from getting_started import app
import frontmatter
import os


@app.route('/api/guides')
def guides():
  guides = []
  files = []
  for root, dirs, filenames in os.walk("getting_started/data"):
    for f in filenames:
      files.append(f)

  files = sorted(files, reverse=True)

  for f in files:
    slug = f.replace(".md", "")
    markdown = frontmatter.loads(open(os.path.join(root, f),'r').read())
    guides.append({"content": markdown.content, "metadata": markdown.metadata, "slug": slug})

  return jsonify({"guides": guides})
