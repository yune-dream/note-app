import urllib.request, json

def request(method, path, data=None):
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(
        "http://localhost:5000" + path,
        data=body,
        headers={"Content-Type": "application/json"} if body else {},
        method=method,
    )
    return json.loads(urllib.request.urlopen(req).read().decode())

# Create notes
n1 = request("POST", "/api/notes", {
    "title": "Getting Started with Python",
    "content": "Python is a versatile programming language popular for web development, data science, and automation.",
    "tags": "python,programming"
})
print("Created:", n1["id"], "-", n1["title"])

n2 = request("POST", "/api/notes", {
    "title": "React Tips",
    "content": "Use useEffect for side effects and useState for local state management.",
    "tags": "react,javascript,frontend"
})
print("Created:", n2["id"], "-", n2["title"])

n3 = request("POST", "/api/notes", {
    "title": "Flask Web Framework",
    "content": "Flask is a lightweight WSGI web application framework for Python.",
    "tags": "python,flask,backend"
})
print("Created:", n3["id"], "-", n3["title"])

# List all
notes = request("GET", "/api/notes")
print("\nTotal notes:", len(notes))
for n in notes:
    print("  [" + str(n["id"]) + "] " + n["title"] + " (" + n["tags"] + ")")

# Get single
g = request("GET", "/api/notes/2")
print("\nGet note 2:", g["title"])

# Update
u = request("PUT", "/api/notes/1", {
    "title": "Python Guide (Updated)",
    "content": "Updated content about Python programming.",
    "tags": "python"
})
print("Updated note 1:", u["title"])

# Search
s = request("GET", "/api/notes?search=React")
print("\nSearch 'React':", len(s), "results")
for n in s:
    print("  -", n["title"])

# Filter by tag
t = request("GET", "/api/notes?tag=python")
print("\nFilter 'python':", len(t), "results")
for n in t:
    print("  -", n["title"])

# Delete
d = request("DELETE", "/api/notes/3")
print("\nDeleted note 3:", d["message"])

# Final list
final = request("GET", "/api/notes")
print("\nFinal notes count:", len(final))
print("\n=== ALL API TESTS PASSED ===")
