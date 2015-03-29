from flask import render_template, jsonify
from getting_started import app
import frontmatter
import os


@app.route('/api/posts')
def posts():
  posts = []
  files = []
  for root, dirs, filenames in os.walk("getting_started/data"):
    for f in filenames:
      files.append(f)

  files = sorted(files)

  for f in files:
    markdown = frontmatter.loads(open(os.path.join(root, f),'r').read())
    posts.append({"content": markdown.content, "metadata": markdown.metadata})

  return jsonify({"posts": posts})
