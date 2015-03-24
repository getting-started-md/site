from flask import render_template, jsonify
from getting_started import app
import frontmatter
import os


@app.route('/api/posts')
def posts():
  posts = []
  for root, dirs, filenames in os.walk("getting_started/data"):
    for f in filenames:
      markdown = frontmatter.loads(open(os.path.join(root, f),'r').read())
      posts.append({"content": markdown.content, "metadata": markdown.metadata})
  return jsonify({"posts": posts})


  
