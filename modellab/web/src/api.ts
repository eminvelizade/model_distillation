// Thin typed client for the ModelLab API (same origin; FastAPI serves this bundle).

export type Status = "queued" | "running" | "done" | "failed" | "cancelled" | "interrupted";

export interface StageSummary { name: string; type: string; status: string; started: number | null; finished: number | null }
export interface Progress { fraction: number; message: string; elapsed_s: number; updated: number }
export interface RunSummary {
  id: string; name: string; recipe_name: string; group_id: string | null; status: Status; created: number;
  started: number | null; finished: number | null; dataset: string | null; current_stage: string | null;
  tags: string[]; notes: string; error_tail: string | null; cancel_requested: number;
  stages: StageSummary[]; progress: number; stage_progress: Progress | null;
  best: { map: number; label: string; stage: string } | null;
}
export interface ResultRow {
  run_id: string; stage: string; label: string; model: string; family: string; dataset: string; split: string;
  dataset_hash: string; eval_version: string; map: number | null; map50: number | null; ap_small: number | null;
  ap_medium: number | null; ap_large: number | null; latency_ms: number | null; latency_p95_ms: number | null;
  latency_device: string | null; params_m: number | null; peak_vram_mb: number | null; created: number;
  run_name: string; tags: string[]; notes: string; run_status: string; group_id: string | null; eval_key: string;
  per_class: Record<string, number | null>; warning?: string | null; input_size?: number;
  metrics?: Record<string, unknown>;
}
export interface Catalog {
  detectors: { id: string; family: string; label: string; resolution: number; backbone: string; teacher_capable: boolean; hidden?: boolean }[];
  students: string[];
  teachers: { id: string; label: string; dim: number; patch: number; params_m: number }[];
  stage_types: string[]; default_epochs: Record<string, number>;
  datasets: { name: string; path?: string; built?: boolean; description?: string; error?: string; classes?: string[] }[];
  templates: { id: string; name: string; description: string; yaml: string }[];
  eval_version: string;
}
export interface Preview { yaml: string; ok: boolean; errors: string[]; warnings: string[];
  runs: { name: string; stages: { name: string; type: string }[]; missing_weights: string[]; matrix: Record<string, unknown> }[] }

async function j<T>(r: Response): Promise<T> {
  if (!r.ok) {
    let msg = `${r.status} ${r.statusText}`;
    try { const b = await r.json(); msg = typeof b.detail === "string" ? b.detail : JSON.stringify(b.detail); } catch { /* not json */ }
    throw new Error(msg);
  }
  return r.json();
}
const post = (url: string, body?: unknown) =>
  fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });

export const api = {
  catalog: () => fetch("/api/catalog").then(j<Catalog>),
  runs: (status?: string) => fetch(`/api/runs${status ? `?status=${status}` : ""}`).then(j<RunSummary[]>),
  run: (id: string) => fetch(`/api/runs/${id}`).then(j<any>),
  queue: () => fetch("/api/queue").then(j<{ worker: { alive: boolean; pid?: number; heartbeat?: number }; runs: RunSummary[] }>),
  gpu: () => fetch("/api/gpu").then(j<{ available: boolean; reason?: string; gpus: { index: number; name: string; util: number; mem_used_mb: number; mem_total_mb: number; temp_c: number; power_w: number | null }[] }>),
  results: () => fetch("/api/results").then(j<{ rows: ResultRow[]; current_eval_version: string }>),
  compare: (items: string[]) => fetch(`/api/compare?items=${encodeURIComponent(items.join(","))}`).then(j<any>),
  preview: (body: { yaml?: string; recipe?: unknown }) => post("/api/recipes/preview", body).then(j<Preview>),
  parse: (yaml: string) => post("/api/recipes/parse", { yaml }).then(j<{ recipe: any }>),
  submit: (yaml: string, position: "front" | "end") => post("/api/runs", { yaml, position }).then(j<{ run_ids: string[] }>),
  cancel: (id: string) => post(`/api/runs/${id}/cancel`).then(j<{ result: string }>),
  requeue: (id: string) => post(`/api/runs/${id}/requeue`).then(j<{ result: string }>),
  remove: (id: string) => fetch(`/api/runs/${id}`, { method: "DELETE" }).then(j<{ result: string }>),
  patch: (id: string, body: { tags?: string[]; notes?: string }) =>
    fetch(`/api/runs/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(j<RunSummary>),
  startWorker: () => post("/api/worker/start").then(j<unknown>),
  fileUrl: (runId: string, path: string) => `/api/runs/${runId}/file/${path}`,
};

export const fmt = {
  pct: (v: number | null | undefined, d = 1) => (v === null || v === undefined ? "–" : (100 * v).toFixed(d)),
  num: (v: number | null | undefined, d = 2) => (v === null || v === undefined ? "–" : v.toFixed(d)),
  time: (t: number | null | undefined) => (t ? new Date(t * 1000).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "–"),
  dur: (a: number | null | undefined, b?: number | null) => {
    if (!a) return "–";
    const s = Math.max(0, Math.round((b ?? Date.now() / 1000) - a));
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
    return h ? `${h}h ${m}m` : m ? `${m}m ${s % 60}s` : `${s}s`;
  },
  mb: (v: number | null | undefined) => (v === null || v === undefined ? "–" : v >= 1024 ? `${(v / 1024).toFixed(1)} GB` : `${v.toFixed(0)} MB`),
};
