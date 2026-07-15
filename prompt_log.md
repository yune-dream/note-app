# Prompt Log

Records of prompts used during development and AI-generated outputs.

## 1. Project Setup
- Files: directory structure, package.json, requirements.txt
- Prompt: Check installed tools, install Flask and Next.js, scaffold project
- Result: Created D:\note-app with frontend/ and backend/ directories

## 2. Backend API
- Files: backend/models.py, backend/app.py
- Prompt: Create Flask backend with SQLite CRUD API
- Result: 5 REST endpoints with search and tag filtering

## 3. Frontend Layout + Notes List
- Files: frontend/src/app/layout.tsx, page.tsx, globals.css
- Prompt: Build Next.js layout with Ant Design and notes list page
- Result: Navigation header, notes cards with search and tags

## 4. Create + Edit Pages
- Files: frontend/src/app/notes/new/page.tsx, notes/[id]/page.tsx
- Prompt: Create note form page and detail/edit page
- Result: Form with validation, view/edit toggle, delete confirmation

## 5. API Client
- Files: frontend/src/lib/api.ts
- Prompt: Create typed API client for Flask backend
- Result: notesApi with list/get/create/update/delete methods

## 6. Git Setup
- Files: .gitignore, initial commit
- Prompt: Initialize git and push to GitHub
- Result: Repository created and pushed

## 7. Code Review
- Files: All project files
- Prompt: Review codebase for bugs, security, performance
- Result: code_review.md with 10 optimization suggestions

## 8. Pagination + Sorting
- Files: backend/app.py, frontend/src/lib/api.ts, page.tsx
- Prompt: Add pagination and sorting to notes list
- Result: Backend page/per_page/sort params, frontend Pagination + Select

## 9. Markdown Editor
- Files: frontend/src/app/notes/new/page.tsx, notes/[id]/page.tsx
- Prompt: Add Markdown preview to note create and detail pages
- Result: react-markdown installed, Write/Preview tabs added

## 10. Auto-save Drafts
- Files: frontend/src/lib/draft.ts, notes/new/page.tsx, notes/[id]/page.tsx
- Prompt: Add localStorage auto-save for note drafts
- Result: Draft utility, restore on mount, clear on save, discard option

## 11. i18n Language Toggle
- Files: frontend/src/lib/i18n.ts, LangContext.tsx, layout.tsx, all pages
- Prompt: Add English/Chinese language switch with full translation
- Result: Translation dictionary, LangProvider, language dropdown

## 12. Batch Import/Export
- Files: backend/app.py, frontend/src/lib/api.ts, page.tsx, i18n.ts
- Prompt: Add export all notes as JSON and import from JSON file
- Result: Export/Import API endpoints, frontend buttons with file picker

## 13. Bug Fix: Form Validation
- Files: frontend/src/app/notes/new/page.tsx
- Prompt: Fix content validation failing for English/numeric input
- Result: Moved Tabs outside Form.Item for proper form value binding

## 14. UX Fix: Menu Selection
- Files: frontend/src/app/layout.tsx
- Prompt: Fix navigation menu not highlighting on route change
- Result: Replaced defaultSelectedKeys with selectedKeys + usePathname

## 15. Vercel Deployment TypeScript Fix
- Fix layout.tsx ConfigProvider theme prop error

## 16. Railway Backend Deployment
- Fix requirements.txt UTF-16 BOM encoding

## 17. Connect Frontend + Backend
- Update Vercel NEXT_PUBLIC_API_URL to Railway domain

## 18. Batch Operations + Markdown Preview + Tag Suggestions
- Files: backend/app.py, frontend/src/app/page.tsx, frontend/src/app/notes/new/page.tsx
- Prompt: Add checkbox multi-select, batch delete, Markdown list preview, tag suggestions
- Result: POST /api/notes/batch-delete, GET /api/notes/tags endpoints; checkboxes with batch bar; ReactMarkdown in cards; clickable existing tags

## 19. Fix i18n Duplicate Key
- Files: frontend/src/lib/i18n.ts
- Prompt: Fix duplicate new.existingTags key causing Vercel build failure
- Result: Removed duplicate entry, build passed
