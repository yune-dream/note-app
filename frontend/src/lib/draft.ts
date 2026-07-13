const DRAFT_PREFIX = "note_draft_";

export function saveDraft(key: string, data: Record<string, string>) {
  try {
    localStorage.setItem(DRAFT_PREFIX + key, JSON.stringify(data));
  } catch {
    // localStorage might be full or unavailable
  }
}

export function loadDraft(key: string): Record<string, string> | null {
  try {
    const raw = localStorage.getItem(DRAFT_PREFIX + key);
    if (raw) return JSON.parse(raw);
    return null;
  } catch {
    return null;
  }
}

export function clearDraft(key: string) {
  try {
    localStorage.removeItem(DRAFT_PREFIX + key);
  } catch {
    // ignore
  }
}

export function hasDraft(key: string): boolean {
  try {
    return localStorage.getItem(DRAFT_PREFIX + key) !== null;
  } catch {
    return false;
  }
}
