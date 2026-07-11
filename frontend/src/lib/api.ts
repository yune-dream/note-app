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
  list: (search?: string, tag?: string) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (tag) params.set("tag", tag);
    const qs = params.toString();
    return request<Note[]>(`/api/notes${qs ? `?${qs}` : ""}`);
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
};
