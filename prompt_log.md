# Prompt Log

This document records the prompts used during development and the corresponding AI-generated outputs.

## Prompt 1: Project Setup and Environment

- **Date**: 2026-07-12
- **Objective**: Set up the project directory structure, install dependencies
- **Files affected**: D:\note-app\ (directory structure), frontend/package.json, backend/requirements.txt
- **Prompt**: Check what tools are installed, install Flask and Next.js, set up project scaffold
- **AI Output**: Created D:\note-app\ with frontend/ and backend/ directories. Installed Flask 3.1.3, flask-cors, created Next.js project with Ant Design.

## Prompt 2: Backend Flask API

- **Date**: 2026-07-12
- **Objective**: Create Flask backend with SQLite database and 5 REST API endpoints
- **Files affected**: backend/models.py, backend/app.py
- **Prompt**: Write a Flask backend with SQLite database for note management. Include models and CRUD API routes with search and tag filtering.
- **AI Output**: Created models.py with SQLite schema (notes table with id, title, content, tags, timestamps). Created app.py with 5 endpoints: GET/POST /api/notes, GET/PUT/DELETE /api/notes/<id>.

## Prompt 3: Frontend Pages - Layout and Notes List

- **Date**: 2026-07-12
- **Objective**: Create Next.js layout with Ant Design and notes list page
- **Files affected**: frontend/src/app/layout.tsx, frontend/src/app/page.tsx, frontend/src/app/globals.css
- **Prompt**: Build a Next.js frontend with Ant Design for note management. Create a layout with navigation header, and a notes list page with search, tag filtering, and CRUD operations.
- **AI Output**: Created layout with ConfigProvider, StyleProvider, dark-themed navigation. Created notes list page with search input, tag filtering, card grid, empty state, delete confirmation.

## Prompt 4: Frontend Pages - Create and Edit Notes

- **Date**: 2026-07-12
- **Objective**: Create new note page and note detail/edit page
- **Files affected**: frontend/src/app/notes/new/page.tsx, frontend/src/app/notes/[id]/page.tsx
- **Prompt**: Create a new note form page and a note detail page. The detail page should support both viewing and editing modes.
- **AI Output**: Created new note page with form validation, content textarea with character count, tags input. Created note detail page with view/edit toggle, save/cancel buttons, delete with confirmation.

## Prompt 5: API Client Library

- **Date**: 2026-07-12
- **Objective**: Create TypeScript API client for frontend-backend communication
- **Files affected**: frontend/src/lib/api.ts
- **Prompt**: Create a typed API client library for the Flask backend, with interfaces for Note and methods for all CRUD operations.
- **AI Output**: Created api.ts with Note interface, CreateNoteInput interface, and notesApi object with list, get, create, update, delete methods.

## Prompt 6: Git Setup and Push

- **Date**: 2026-07-12
- **Objective**: Initialize Git repository and push to GitHub
- **Files affected**: .gitignore, initial commit
- **Prompt**: Initialize Git repo and push to GitHub repository yune-dream/note-app
- **AI Output**: Created .gitignore, initialized git repo, made initial commit, connected to remote, pushed to GitHub.

## Prompt 7: Code Review

- **Date**: 2026-07-12
- **Objective**: Perform AI code review and generate optimization suggestions
- **Files affected**: All project files
- **Prompt**: Review the entire codebase for bugs, security issues, performance problems, and style improvements.
- **AI Output**: See code_review.md for detailed findings.
