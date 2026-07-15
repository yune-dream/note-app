## # Prompt Log

Records of prompts used during development and AI-generated outputs.

## 1. Project Setup
- Files: directory structure, package.json, requirements.txt
- Prompt: Check installed tools, install Flask and Next.js, scaffold project
- Result: Created D:\note-app with frontend/ and backend/ directories

**AI Output**:
```bash
# Codex created project structure
mkdir -p D:\note-app\frontend D:\note-app\backend
py -m pip install flask flask-cors
npx create-next-app@latest frontend --typescript --tailwind
npm install antd @ant-design/icons
```

## 2. Backend API
- Files: backend/models.py, backend/app.py
- Prompt: Create Flask backend with SQLite CRUD API
- Result: 5 REST endpoints with search and tag filtering

**AI Output**:
```python
@app.route("/api/notes", methods=["GET"])
def list_notes():
    """List notes with search, tag filter, pagination"""
    ...

@app.route("/api/notes", methods=["POST"])
def create_note():
    """Create a new note"""
    ...

@app.route("/api/notes/<int:note_id>", methods=["GET","PUT","DELETE"])
def get_note(note_id): ...
```

## 3. Frontend Layout + Notes List
- Files: frontend/src/app/layout.tsx, page.tsx, globals.css
- Prompt: Build Next.js layout with Ant Design and notes list page
- Result: Navigation header, notes cards with search and tags

**AI Output**:
```tsx
// layout.tsx - Ant Design Layout with navigation
<ConfigProvider theme={{ algorithm: antdTheme.defaultAlgorithm }}>
  <Layout>
    <Header>
      <Menu items={[
        { key: "/", label: <Link href="/">All Notes</Link> },
        { key: "/notes/new", label: <Link href="/notes/new">New Note</Link> },
      ]} />
    </Header>
    <Content>{children}</Content>
  </Layout>
</ConfigProvider>
```

## 4. Create + Edit Pages
- Files: frontend/src/app/notes/new/page.tsx, notes/[id]/page.tsx
- Prompt: Create note form page and detail/edit page
- Result: Form with validation, view/edit toggle, delete confirmation

**AI Output**:
```tsx
// notes/new/page.tsx - Form with validation
<Form.Item name="title" rules={[{ required: true }]}>
  <Input placeholder="Enter note title..." />
</Form.Item>

// notes/[id]/page.tsx - View/Edit toggle
{editing ? <EditForm /> : <NoteView />}
```

## 5. API Client
- Files: frontend/src/lib/api.ts
- Prompt: Create typed API client for Flask backend
- Result: notesApi with list/get/create/update/delete methods

**AI Output**:
```typescript
// api.ts - Typed API client
export const notesApi = {
  list: (params?) => request<ListNotesResponse>("/api/notes", params),
  get: (id) => request<Note>("/api/notes/" + id),
  create: (data) => request<Note>("/api/notes", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => ...
  delete: (id) => ...
}
```

## 6. Git Setup
- Files: .gitignore, initial commit
- Prompt: Initialize git and push to GitHub
- Result: Repository created and pushed

**AI Output**:
```bash
git init
git remote add origin https://github.com/yune-dream/note-app.git
git add .
git commit -m "chore: init project structure"
git push -u origin main
```

## 7. Code Review
- Files: All project files
- Prompt: Review codebase for bugs, security, performance
- Result: code_review.md with 10 optimization suggestions

**AI Output**:
```markdown
## Code Review Findings
1. SQL Injection: Already using parameterized queries - OK
2. Error Handling: Add @app.errorhandler(Exception)
3. Error Boundaries: Add error.tsx
4. Debounced Search: Add 300ms debounce
...
```

## 8. Pagination + Sorting
- Files: backend/app.py, frontend/src/lib/api.ts, page.tsx
- Prompt: Add pagination and sorting to notes list
- Result: Backend page/per_page/sort params, frontend Pagination + Select

**AI Output**:
```python
# Backend: paginated list query
page = request.args.get("page", 1, type=int)
per_page = request.args.get("per_page", 10, type=int)
offset = (page - 1) * per_page
query += " LIMIT ? OFFSET ?"
return jsonify({"notes": rows, "total": total, "page": page, "per_page": per_page})
```

## 9. Markdown Editor
- Files: frontend/src/app/notes/new/page.tsx, notes/[id]/page.tsx
- Prompt: Add Markdown preview to note create and detail pages
- Result: react-markdown installed, Write/Preview tabs added

**AI Output**:
```tsx
// Write/Preview tabs with ReactMarkdown
<Tabs items={[
  { key: "write", label: "Write", children: <TextArea /> },
  { key: "preview", label: "Preview", children: <ReactMarkdown>{content}</ReactMarkdown> },
]} />
```

## 10. Auto-save Drafts
- Files: frontend/src/lib/draft.ts, notes/new/page.tsx, notes/[id]/page.tsx
- Prompt: Add localStorage auto-save for note drafts
- Result: Draft utility, restore on mount, clear on save, discard option

**AI Output**:
```typescript
// draft.ts - localStorage auto-save utility
export function saveDraft(key, data) {
  localStorage.setItem("note_draft_" + key, JSON.stringify(data));
}
export function loadDraft(key) { ... }
export function clearDraft(key) { ... }
```

## 11. i18n Language Toggle
- Files: frontend/src/lib/i18n.ts, LangContext.tsx, layout.tsx, all pages
- Prompt: Add English/Chinese language switch with full translation
- Result: Translation dictionary, LangProvider, language dropdown

**AI Output**:
```typescript
// i18n.ts - Translation dictionary
export const translations: Record<Locale, Record<string, string>> = {
  en: { "app.title": "Note App", "notes.all": "All Notes", ... },
  zh: { "app.title": "笔记管理", "notes.all": "所有笔记", ... },
}
```

## 12. Batch Import/Export
- Files: backend/app.py, frontend/src/lib/api.ts, page.tsx, i18n.ts
- Prompt: Add export all notes as JSON and import from JSON file
- Result: Export/Import API endpoints, frontend buttons with file picker

**AI Output**:
```python
@app.route("/api/notes/export")
def export_notes():
    return jsonify(conn.execute("SELECT * FROM notes").fetchall())

@app.route("/api/notes/import", methods=["POST"])
def import_notes():
    data = request.get_json()
    for item in data:
        conn.execute("INSERT INTO notes ...", (item["title"], ...))
    return jsonify({"imported": imported})
```

## 13. Bug Fix: Form Validation
- Files: frontend/src/app/notes/new/page.tsx
- Prompt: Fix content validation failing for English/numeric input
- Result: Moved Tabs outside Form.Item for proper form value binding

**AI Output**:
```tsx
// BEFORE: Tabs wrapped in Form.Item (broken)
<Form.Item name="content">
  <Tabs><TabPane><TextArea /></TabPane></Tabs>
</Form.Item>

// AFTER: Tabs outside Form.Item (fixed)
<Tabs activeKey={tabKey} onChange={setTabKey} />
<Form.Item name="content">
  {tabKey === "write" ? <TextArea /> : <Preview />}
</Form.Item>
```

## 14. UX Fix: Menu Selection
- Files: frontend/src/app/layout.tsx
- Prompt: Fix navigation menu not highlighting on route change
- Result: Replaced defaultSelectedKeys with selectedKeys + usePathname

**AI Output**:
```tsx
// BEFORE: defaultSelectedKeys never updates
<Menu defaultSelectedKeys={["/"]} />

// AFTER: selectedKeys + usePathname
const pathname = usePathname();
const selectedKey = pathname === "/notes/new" ? "/notes/new" : "/";
<Menu selectedKeys={[selectedKey]} />
```

## 15. Vercel Deployment TypeScript Fix
- Fix layout.tsx ConfigProvider theme prop error

**AI Output**:
```tsx
// layout.tsx - Fixed ConfigProvider theme type
import { ConfigProvider, theme as antdTheme } from "antd";
<ConfigProvider theme={{ algorithm: antdTheme.defaultAlgorithm }}>
```

## 16. Railway Backend Deployment
- Fix requirements.txt UTF-16 BOM encoding

**AI Output**:
```
# requirements.txt - Fixed UTF-8 encoding
Flask==3.1.3
flask-cors==6.0.5
gunicorn==23.0.0
```

## 17. Connect Frontend + Backend
- Update Vercel NEXT_PUBLIC_API_URL to Railway domain

**AI Output**:
```bash
# Vercel env var
NEXT_PUBLIC_API_URL=https://note-app-production-1abc.up.railway.app

# Railway deploy
cd backend && gunicorn app:app
```

## 18. Batch Operations + Markdown Preview + Tag Suggestions
- Files: backend/app.py, frontend/src/app/page.tsx, frontend/src/app/notes/new/page.tsx
- Prompt: Add checkbox multi-select, batch delete, Markdown list preview, tag suggestions
- Result: POST /api/notes/batch-delete, GET /api/notes/tags endpoints; checkboxes with batch bar; ReactMarkdown in cards; clickable existing tags

**AI Output**:
```python
@app.route("/api/notes/batch-delete", methods=["POST"])
def batch_delete():
    ids = request.get_json()
    conn.execute(f"DELETE FROM notes WHERE id IN ({','.join('?' * len(ids))})", ids)
    return jsonify({"deleted": len(ids)})
```

## 19. Fix i18n Duplicate Key
- Files: frontend/src/lib/i18n.ts
- Prompt: Fix duplicate new.existingTags key causing Vercel build failure
- Result: Removed duplicate entry, build passed

**AI Output**:
```typescript
// i18n.ts - Translation dictionary
export const translations: Record<Locale, Record<string, string>> = {
  en: { "app.title": "Note App", "notes.all": "All Notes", ... },
  zh: { "app.title": "笔记管理", "notes.all": "所有笔记", ... },
}
```
