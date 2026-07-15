# Note App

A full-stack note management application built with Next.js and Flask.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React, Ant Design, Tailwind CSS |
| Backend | Python Flask 3, SQLite |
| Version Control | Git + GitHub |

## Project Structure

```
note-app/
frontend/         # Next.js app
  src/app/        # Page routes
  src/lib/        # Utilities (API, i18n, drafts)
backend/          # Flask API
  app.py          # 7 REST endpoints
  models.py       # SQLite schema
```

## Installation

### Backend

```
cd backend
py -m venv venv
venv/Scripts/activate
pip install -r requirements.txt
py app.py
```

Server: http://localhost:5000

### Frontend

```
cd frontend
npm install
npm run dev
```

Server: http://localhost:3000

### Environment

Create `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Features

| Feature | Details |
|---------|---------|
| CRUD | Create, read, update, delete notes |
| Markdown | Write/Preview tabs with react-markdown rendering |
| Search | Real-time search by title and content |
| Tags | Comma-separated tags with filter chips |
| Pagination | 10 notes per page with page selector |
| Sorting | By last updated, date created, or title |
| Auto-save | Drafts saved to localStorage with restore |
| Language | English/Chinese toggle, persisted |
| Export | Download all notes as JSON |
| Import | Bulk create notes from JSON file |
| Batch Delete | Multi-select notes with checkboxes, delete at once |
| Markdown List | Markdown preview rendered in notes list cards |
| Tag Suggest | Click existing tags to add when creating notes |

## API Endpoints

### Notes CRUD

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/notes | List (search, tag, page, per_page, sort_by) |
| POST | /api/notes | Create (title, content, tags) |
| GET | /api/notes/:id | Get single note |
| PUT | /api/notes/:id | Update note |
| DELETE | /api/notes/:id | Delete note |

### Batch Operations

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/notes/export | Export all notes as JSON array |
| POST | /api/notes/import | Import notes from JSON array |
| POST | /api/notes/batch-delete | Delete multiple notes by IDs |
| GET | /api/notes/tags | Get all unique tags |

### Note Schema

```json
{
  "id": 1,
  "title": "My Note",
  "content": "Markdown content here",
  "tags": "work,personal",
  "created_at": "2026-07-10 19:30:00",
  "updated_at": "2026-07-10 19:30:00"
}
```

### Error Handling

- 400: Missing title or invalid request body
- 404: Note not found
- Frontend shows error messages for failed API calls
- Delete operations require confirmation dialog

<<<<<<< HEAD
## Git History

```
082b96f fix: menu selection not updating on route change
b5f79aa feat: add batch import/export notes as JSON
4218af7 fix: Form.Item wrapping Tabs prevents content validation
4dfddaf feat: add i18n support with English/Chinese language toggle
17aaec3 feat: add auto-save draft feature with localStorage
9803366 feat: add pagination, sorting, and Markdown preview
e021bf1 restore: add back code_review.md and prompt_log.md
ca339e1 chore: remove commit history, scoring table...
e244cc8 docs: add README, prompt log, AI review report...
f5ab8b6 chore: add antd dependencies and API config
49151b3 feat: add Next.js frontend with Ant Design UI
3dd57c7 feat: add Flask backend with SQLite CRUD API
b180147 chore: init project structure with Next.js + Flask
```

13 commits across 4 dates (Jul 10-13).
=======

## Deployment

| Service | URL |
|---------|-----|
| Frontend (Vercel) | https://note-app-mu-seven.vercel.app |
| Backend (Railway) | https://note-app-production-1abc.up.railway.app |

Set NEXT_PUBLIC_API_URL in Vercel env vars to the Railway URL.
>>>>>>> a88486f (docs: update README, prompt_log, code_review with batch/markdown/tag features)

## License

MIT
