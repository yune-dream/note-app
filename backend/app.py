from flask import Flask, request, jsonify
from flask_cors import CORS
from models import get_db, init_db, now

app = Flask(__name__)
CORS(app)

with app.app_context():
    init_db()


@app.route("/api/notes", methods=["GET"])
def list_notes():
    """List notes with search, tag filter, pagination and sorting"""
    search = request.args.get("search", "").strip()
    tag = request.args.get("tag", "").strip()
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    sort_by = request.args.get("sort_by", "updated_at")
    sort_order = request.args.get("sort_order", "desc")

    valid_sort_fields = {"updated_at", "created_at", "title", "id"}
    if sort_by not in valid_sort_fields:
        sort_by = "updated_at"
    if sort_order not in ("asc", "desc"):
        sort_order = "desc"

    conn = get_db()

    count_query = "SELECT COUNT(*) as total FROM notes WHERE 1=1"
    data_query = "SELECT * FROM notes WHERE 1=1"
    params = []

    if search:
        condition = " AND (title LIKE ? OR content LIKE ?)"
        count_query += condition
        data_query += condition
        params.extend([f"%{search}%", f"%{search}%"])
    if tag:
        condition = " AND tags LIKE ?"
        count_query += condition
        data_query += condition
        params.append(f"%{tag}%")

    total = conn.execute(count_query, params).fetchone()["total"]

    offset = (page - 1) * per_page
    data_query += f" ORDER BY {sort_by} {sort_order} LIMIT ? OFFSET ?"
    rows = conn.execute(data_query, params + [per_page, offset]).fetchall()
    conn.close()

    return jsonify({
        "notes": [dict(r) for r in rows],
        "total": total,
        "page": page,
        "per_page": per_page,
    })


@app.route("/api/notes", methods=["POST"])
def create_note():
    """Create a new note"""
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
    """Get a single note by ID"""
    conn = get_db()
    note = conn.execute("SELECT * FROM notes WHERE id = ?", (note_id,)).fetchone()
    conn.close()
    if not note:
        return jsonify({"error": "Note not found"}), 404
    return jsonify(dict(note))


@app.route("/api/notes/<int:note_id>", methods=["PUT"])
def update_note(note_id):
    """Update an existing note"""
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
    """Delete a note"""
    conn = get_db()
    cursor = conn.execute("DELETE FROM notes WHERE id = ?", (note_id,))
    conn.commit()
    conn.close()
    if cursor.rowcount == 0:
        return jsonify({"error": "Note not found"}), 404
    return jsonify({"message": "Note deleted"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
