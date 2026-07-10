from flask import Flask, request, jsonify
from flask_cors import CORS
from models import get_db, init_db, now

app = Flask(__name__)
CORS(app)

# 启动时初始化数据库
with app.app_context():
    init_db()


@app.route("/api/notes", methods=["GET"])
def list_notes():
    """获取笔记列表，支持搜索和标签筛选"""
    search = request.args.get("search", "").strip()
    tag = request.args.get("tag", "").strip()

    conn = get_db()
    query = "SELECT * FROM notes WHERE 1=1"
    params = []

    if search:
        query += " AND (title LIKE ? OR content LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%"])
    if tag:
        query += " AND tags LIKE ?"
        params.append(f"%{tag}%")

    query += " ORDER BY updated_at DESC"
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route("/api/notes", methods=["POST"])
def create_note():
    """创建笔记"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    title = data.get("title", "").strip()
    content = data.get("content", "").strip()
    tags = data.get("tags", "").strip()

    if not title:
        return jsonify({"error": "Title is required"}), 400

    timestamp = now()
    conn = get_db()
    cursor = conn.execute(
        "INSERT INTO notes (title, content, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
        (title, content, tags, timestamp, timestamp),
    )
    note_id = cursor.lastrowid
    conn.commit()
    note = conn.execute("SELECT * FROM notes WHERE id = ?", (note_id,)).fetchone()
    conn.close()
    return jsonify(dict(note)), 201


@app.route("/api/notes/<int:note_id>", methods=["GET"])
def get_note(note_id):
    """获取单条笔记"""
    conn = get_db()
    note = conn.execute("SELECT * FROM notes WHERE id = ?", (note_id,)).fetchone()
    conn.close()
    if not note:
        return jsonify({"error": "Note not found"}), 404
    return jsonify(dict(note))


@app.route("/api/notes/<int:note_id>", methods=["PUT"])
def update_note(note_id):
    """更新笔记"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    title = data.get("title", "").strip()
    content = data.get("content", "").strip()
    tags = data.get("tags", "").strip()

    if not title:
        return jsonify({"error": "Title is required"}), 400

    timestamp = now()
    conn = get_db()
    cursor = conn.execute(
        "UPDATE notes SET title=?, content=?, tags=?, updated_at=? WHERE id=?",
        (title, content, tags, timestamp, note_id),
    )
    conn.commit()

    if cursor.rowcount == 0:
        conn.close()
        return jsonify({"error": "Note not found"}), 404

    note = conn.execute("SELECT * FROM notes WHERE id = ?", (note_id,)).fetchone()
    conn.close()
    return jsonify(dict(note))


@app.route("/api/notes/<int:note_id>", methods=["DELETE"])
def delete_note(note_id):
    """删除笔记"""
    conn = get_db()
    cursor = conn.execute("DELETE FROM notes WHERE id = ?", (note_id,))
    conn.commit()
    conn.close()
    if cursor.rowcount == 0:
        return jsonify({"error": "Note not found"}), 404
    return jsonify({"message": "Note deleted"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
