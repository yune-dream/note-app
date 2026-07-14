const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface Note {
  id: number;
  title: string;
  content: string;
  tags: string;
  created_at: string;
  updated_at: string;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  tags: string;
}

export interface ListNotesResponse {
  notes: Note[];
  total: number;
  page: number;
  per_page: number;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const notesApi = {
  list: (params?: { search?: string; tag?: string; page?: number; perPage?: number; sortBy?: string; sortOrder?: string }) => {
    const sp = new URLSearchParams();
    if (params?.search) sp.set("search", params.search);
    if (params?.tag) sp.set("tag", params.tag);
    if (params?.page) sp.set("page", String(params.page));
    if (params?.perPage) sp.set("per_page", String(params.perPage));
    if (params?.sortBy) sp.set("sort_by", params.sortBy);
    if (params?.sortOrder) sp.set("sort_order", params.sortOrder);
    const qs = sp.toString();
    return request<ListNotesResponse>(`/api/notes${qs ? `?${qs}` : ""}`);
  },
  get: (id: number) => request<Note>(`/api/notes/${id}`),
  create: (data: CreateNoteInput) =>
    request<Note>("/api/notes", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: CreateNoteInput) =>
    request<Note>(`/api/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    request<{ message: string }>(`/api/notes/${id}`, {
      method: "DELETE",
    }),
  batchDelete: (ids: number[]) =>
    request<{ deleted: number }>("/api/notes/batch-delete", {
      method: "POST",
      body: JSON.stringify(ids),
    }),
  allTags: () => request<string[]>("/api/notes/tags"),
  exportAll: () => request<Note[]>("/api/notes/export"),
  importNotes: (notes: { title: string; content: string; tags: string }[]) =>
    request<{ imported: number; total: number }>("/api/notes/import", {
      method: "POST",
      body: JSON.stringify(notes),
    }),
};
