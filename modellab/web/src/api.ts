// Thin typed client for the ModelLab API (same origin). Works against both servers:
// the local app (`python app.py`, single user) and the hub (logins, machines). In hub mode most calls are scoped
// to the machine picked in the sidebar (setMachine), sent as ?machine= or machine_id.

export type Status = "queued" | "running" | "done" | "failed" | "cancelled" | "interrupted";

export interface StageSummary { name: string; type: string; status: string; started: number | null; finished: number | null }
export interface Progress { fraction: number; message: string; elapsed_s: number; updated: number }
export interface RunSummary {
  id: string; name: string; recipe_name: string; group_id: string | null; status: Status; created: number;
  started: number | null; finished: number | null; dataset: string | null; current_stage: string | null;
  tags: string[]; notes: string; error_tail: string | null; cancel_requested: number;
  stages: StageSummary[]; progress: number; stage_progress: Progress | null;
  best: { map: number; label: string; stage: string } | null;
  machine_id?: string; machine_name?: string | null; status_message?: string | null;
}
export interface ResultRow {
  run_id: string; stage: string; label: string; model: string; family: string; dataset: string; split: string;
  dataset_hash: string; eval_version: string; map: number | null; map50: number | null; ap_small: number | null;
  ap_medium: number | null; ap_large: number | null; latency_ms: number | null; latency_p95_ms: number | null;
  latency_device: string | null; params_m: number | null; peak_vram_mb: number | null; created: number;
  run_name: string; tags: string[]; notes: string; run_status: string; group_id: string | null; eval_key: string;
  per_class: Record<string, number | null>; warning?: string | null; input_size?: number;
  metrics?: Record<string, unknown>; machine_name?: string | null;
}
export interface DatasetInfo {
  name: string; path?: string; built?: boolean; description?: string; error?: string; classes?: string[];
  train?: { images: number; boxes: number }; valid?: { images: number; boxes: number }; test?: { images: number; boxes: number };
  hash?: Record<string, string> | null; hash_time?: number | null;
  /** modellab.datasets.check: errors block a search, warnings are shown with it */
  check?: { errors: string[]; warnings: string[]; classes: string[];
    splits: Record<string, { images: number; boxes: number; empty_images: number; per_class: Record<string, number> }> } | null;
}
export interface Catalog {
  detectors: { id: string; family: string; label: string; resolution: number; backbone: string; teacher_capable: boolean; hidden?: boolean }[];
  students: string[];
  teachers: { id: string; label: string; dim: number; patch: number; params_m: number }[];
  stage_types: string[]; default_epochs: Record<string, number>;
  datasets: DatasetInfo[];
  templates: { id: string; name: string; description: string; yaml: string }[];
  eval_version: string;
}
export interface Preview { yaml: string; ok: boolean; errors: string[]; warnings: string[];
  runs: { name: string; stages: { name: string; type: string }[]; missing_weights: string[]; matrix: Record<string, unknown> }[];
  machine?: { id: string; name: string } }
export interface GpuLive { index: number; name: string; util: number; mem_used_mb: number; mem_total_mb: number; temp_c: number; power_w: number | null }

// ---------- hub types ----------
export interface User { id: string; username: string; display_name: string; is_admin: boolean; must_change_password: boolean }
export interface Me { mode: "local" | "hub"; user: User | null; public_url?: string }
export interface Check { id: string; label: string; status: "ok" | "warn" | "fail"; value: string | null; detail: string }
export interface Machine {
  id: string; name: string; online: boolean; last_seen: number | null; created: number; hostname: string | null;
  agent_version: string | null; release: string | null; state: string; current_run: string | null;
  gpus: { index: number; name: string; memory_gb: number; capability?: string }[]; driver: string | null;
  checks: { ok: number; warn: number; fail: number }; report_time: number | null;
  live: { gpus: GpuLive[]; cpu_percent: number | null; ram_total_gb?: number; ram_used_gb?: number; load?: number } | null;
  update_status: { version: string; ok?: boolean; state?: string; error?: string; time: number } | null;
}
export interface Command {
  id: string; type: string; args: Record<string, unknown>; status: "pending" | "sent" | "running" | "done" | "failed";
  result: any; error: string | null; log: string | null; created: number; started: number | null; finished: number | null;
}
export interface MachineReport {
  time?: number; release?: string | null; home?: string;
  hardware?: {
    os: string; kernel: string; arch: string; glibc: string | null; hostname: string; cpu: { model: string; threads: number };
    ram_gb: number; ram_available_gb: number; driver: string | null; cuda_driver: string | null; shm_gb: number | null;
    disk: { path: string; free_gb: number; total_gb: number }; nofile: { soft: number; hard: number }; python: string;
    torch?: string | null; torch_cuda?: string | null; gpus: { index: number; name: string; memory_gb: number; capability?: string }[];
    service?: { systemd: boolean; active: string | null; linger: boolean | null };
  };
  checks?: Check[]; datasets?: DatasetInfo[];
  weights?: Record<string, { present: boolean; verified: boolean | null; size: number | null; expected_size: number | null }>;
}
export interface MachineDetail extends Machine { report: MachineReport; commands: Command[]; current_release: string | null; browse?: boolean }
export interface FolderEntry { name: string; type: "dir" | "file"; layout?: "roboflow" | "yolo" | null; size?: number }
/** A folder on a machine, listed by its agent for the dataset picker (names only). */
export interface Listing {
  path: string; parent: string | null; entries: FolderEntry[]; images: number; truncated: boolean; layout: string | null;
  places: { label: string; path: string }[];
}
// ---------- searches ("find my best model") ----------
export interface SearchSpec {
  name: string; dataset: string; machines: string[]; target_machine: string; speed_ms: number; models: string[];
  image_sizes: Record<string, number[]>; lrs: number[]; teachers: string[]; epochs: number; distill_epochs: number;
  rungs: number; eta: number; seeds: number; seed: number; batch_size: number | null; gpu_hours: number | null;
  machine_names?: Record<string, string>;
}
export interface SearchArch {
  key: string; model: string; size: number; stage: string; latency_ms?: number; latency_p95_ms?: number; latency_device?: string;
  params_m?: number; error?: string; fits?: boolean;
}
export interface SearchTrial {
  config: string; seed: number; run_id: string | null; machine_id: string | null; status: string; error?: string | null;
  map_valid?: number | null; map_test?: number | null; latency_test_ms?: number | null; seconds?: number;
}
export interface SearchRound { index: number; final: boolean; epochs: number; distill_epochs: number; configs: string[]; trials: SearchTrial[] }
export interface Recommendation {
  config: string; model: string; image_size: number; lr: number | null; teacher: string | null; latency_ms: number | null;
  latency_device: string | null; params_m: number | null; map_valid_mean: number; map_test_mean: number | null;
  map_test_std: number | null; runs: number; run_ids: string[]; best_run_id: string; stage: string; early: boolean;
}
export interface SearchSummary {
  id: string; name: string; status: "running" | "done" | "failed" | "cancelled"; phase: string; message: string | null;
  created: number; updated: number; finished: number | null; spec: SearchSpec; recommendation: Recommendation | null;
  trials: { total: number; done: number; failed: number }; spent_s: number;
}
export interface SearchPreview { archs: number; configs: number; rounds: { epochs: number; distill_epochs: number }[]; max_trials: number }
export interface SearchDetail extends SearchSummary {
  state: { speed_run: string; archs: SearchArch[]; configs: { key: string; model: string; size: number; lr: number | null; teacher: string | null }[];
    rounds: SearchRound[]; seed_trials: SearchTrial[]; spent_s: number };
  preview: SearchPreview;
}

export interface TeamUser extends User { disabled: boolean; created: number; last_login: number | null; machines: number }

const UNAUTHORIZED = "modellab:unauthorized";
export const onUnauthorized = (fn: () => void) => {
  window.addEventListener(UNAUTHORIZED, fn);
  return () => window.removeEventListener(UNAUTHORIZED, fn);
};

let machine: string | null = null;
/** The machine hub calls are scoped to (null in local mode). */
export const setMachine = (m: string | null) => { machine = m; };
const scoped = (url: string) => (machine ? `${url}${url.includes("?") ? "&" : "?"}machine=${encodeURIComponent(machine)}` : url);

async function j<T>(r: Response): Promise<T> {
  if (!r.ok) {
    if (r.status === 401) window.dispatchEvent(new Event(UNAUTHORIZED));
    let msg = `${r.status} ${r.statusText}`;
    try { const b = await r.json(); msg = typeof b.detail === "string" ? b.detail : JSON.stringify(b.detail); } catch { /* not json */ }
    throw new Error(msg);
  }
  return r.json();
}
// X-ModelLab: the hub refuses state-changing calls without it (cross-site forms cannot send custom headers).
const H = { "X-ModelLab": "1" };
const send = (method: string, url: string, body?: unknown) =>
  fetch(url, { method, headers: body === undefined ? H : { ...H, "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
const post = (url: string, body?: unknown) => send("POST", url, body);

// ---------- Yeti, the assistant (hub) ----------
export interface YetiSettings {
  connected: boolean; key_hint: string | null; key_error: string | null; model: string; effort: string;
  models: { id: string; label: string; note: string }[]; efforts: { id: string; label: string }[];
  connector: { url: string; apps: { client_id: string; name: string; connected: number; last_used: number | null }[] };
  /** the decision model for one-sentence actions, on the user's OpenRouter key */
  system1: { connected: boolean; key_hint: string | null; key_error: string | null; model: string };
}
/** What a page shows. `rows` (ids, top to bottom), `form` (its current values) and `machine` (the one picked in the
 *  sidebar) only go to the decision model; the hub looks every name up itself. */
export interface YetiPage {
  kind: string; id?: string; items?: string[]; path?: string; focus?: string;
  rows?: string[]; form?: Record<string, string | number | undefined>; machine?: string;
}
export type YetiEvent =
  | { type: "start"; turn: string; note: string | null; model: string; model_label: string }
  | { type: "text"; text: string }
  | { type: "rewind"; chars: number }
  | { type: "note"; text: string }
  | { type: "tool"; id: string; name: string; label: string }
  | { type: "tool_done"; id: string; ok: boolean; label: string; href: string | null }
  | { type: "done"; text: string; usage: { input: number; output: number; cache_read: number; cache_write: number }; model: string; model_label: string; stop: string | null }
  | { type: "action"; decision: import("./agent").Decision } // Claude drafted or proposed an action (yeti_actions.py)
  | { type: "error"; code: string; message: string };

/** POST a chat turn and read the server-sent events as they arrive (EventSource can't POST). */
export async function streamYeti(body: { messages: { role: string; text: string; note?: string | null }[]; page?: YetiPage | null; mascot?: string },
                                 onEvent: (e: YetiEvent) => void, signal?: AbortSignal): Promise<void> {
  const r = await fetch("/api/assistant/chat", { method: "POST", headers: { ...H, "Content-Type": "application/json" }, body: JSON.stringify(body), signal });
  if (!r.ok || !r.body) { await j(r); return; }
  const reader = r.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let i: number;
    while ((i = buf.indexOf("\n\n")) >= 0) {
      const chunk = buf.slice(0, i);
      buf = buf.slice(i + 2);
      for (const line of chunk.split("\n")) if (line.startsWith("data: ")) onEvent(JSON.parse(line.slice(6)));
    }
  }
}

export const api = {
  catalog: () => fetch(scoped("/api/catalog")).then(j<Catalog>),
  runs: (status?: string, thisMachine = false) => {
    const url = `/api/runs${status ? `?status=${status}` : ""}`;
    return fetch(thisMachine ? scoped(url) : url).then(j<RunSummary[]>);
  },
  run: (id: string) => fetch(`/api/runs/${id}`).then(j<any>),
  queue: () => fetch(scoped("/api/queue")).then(j<{ worker: { alive: boolean; pid?: number; heartbeat?: number; machine?: Machine | null }; runs: RunSummary[]; machines?: Machine[] }>),
  gpu: () => fetch(scoped("/api/gpu")).then(j<{ available: boolean; reason?: string; gpus: GpuLive[] }>),
  results: () => fetch("/api/results").then(j<{ rows: ResultRow[]; current_eval_version: string }>),
  compare: (items: string[]) => fetch(`/api/compare?items=${encodeURIComponent(items.join(","))}`).then(j<any>),
  preview: (body: { yaml?: string; recipe?: unknown }) => post("/api/recipes/preview", { ...body, machine_id: machine }).then(j<Preview>),
  parse: (yaml: string) => post("/api/recipes/parse", { yaml }).then(j<{ recipe: any }>),
  submit: (yaml: string, position: "front" | "end") => post("/api/runs", { yaml, position, machine_id: machine }).then(j<{ run_ids: string[] }>),
  cancel: (id: string) => post(`/api/runs/${id}/cancel`).then(j<{ result: string }>),
  requeue: (id: string) => post(`/api/runs/${id}/requeue`).then(j<{ result: string }>),
  remove: (id: string, deleteFiles = false) => send("DELETE", `/api/runs/${id}${deleteFiles ? "?delete_files=true" : ""}`).then(j<{ result: string }>),
  patch: (id: string, body: { tags?: string[]; notes?: string }) => send("PATCH", `/api/runs/${id}`, body).then(j<RunSummary>),
  startWorker: () => post("/api/worker/start").then(j<unknown>),
  fileUrl: (runId: string, path: string) => `/api/runs/${runId}/file/${path}`,

  // ---------- accounts (hub; the local app answers /api/auth/me with mode "local") ----------
  me: () => fetch("/api/auth/me").then(j<Me>),
  login: (username: string, password: string) => post("/api/auth/login", { username, password }).then(j<{ user: User }>),
  logout: () => post("/api/auth/logout").then(j<{ result: string }>),
  changePassword: (current: string, next: string) => post("/api/auth/password", { current, new: next }).then(j<{ result: string }>),
  users: () => fetch("/api/users").then(j<TeamUser[]>),
  addUser: (body: { username: string; display_name: string; is_admin: boolean }) => post("/api/users", body).then(j<{ user: User; password: string | null }>),
  patchUser: (id: string, body: { display_name?: string; is_admin?: boolean; disabled?: boolean }) => send("PATCH", `/api/users/${id}`, body).then(j<TeamUser>),
  resetPassword: (id: string) => post(`/api/users/${id}/reset-password`).then(j<{ password: string }>),
  releases: () => fetch("/api/releases").then(j<{ current: string | null; releases: { version: string; created: number; published_by: string; manifest: any }[] }>),
  setCurrentRelease: (version: string) => post("/api/releases/current", { version }).then(j<unknown>),

  // ---------- machines (hub) ----------
  machines: () => fetch("/api/machines").then(j<Machine[]>),
  machine: (id: string) => fetch(`/api/machines/${id}`).then(j<MachineDetail>),
  pair: (name: string) => post("/api/machines/pair", { name }).then(j<{ pairing_id: string; code: string; expires: number; command: string; hub_url: string }>),
  pairing: (pid: string) => fetch(`/api/machines/pairing/${pid}`).then(j<{ used: boolean; machine_id: string | null; expired: boolean; expires: number }>),
  renameMachine: (id: string, name: string) => send("PATCH", `/api/machines/${id}`, { name }).then(j<Machine>),
  removeMachine: (id: string) => send("DELETE", `/api/machines/${id}`).then(j<{ result: string }>),
  command: (id: string, type: string, args: Record<string, unknown> = {}) => post(`/api/machines/${id}/commands`, { type, args }).then(j<Command>),
  browse: (id: string, path: string | null, want: "dir" | "json" = "dir") => post(`/api/machines/${id}/browse`, { path, want }).then(j<Listing>),

  // ---------- Yeti (hub) ----------
  yeti: () => fetch("/api/assistant").then(j<YetiSettings>),
  yetiSave: (body: { api_key?: string; model?: string; effort?: string }) => send("PUT", "/api/assistant", body).then(j<YetiSettings>),
  yetiForgetKey: () => send("DELETE", "/api/assistant/key").then(j<YetiSettings>),
  system1Save: (apiKey: string) => send("PUT", "/api/assistant/system1", { api_key: apiKey }).then(j<YetiSettings>),
  system1Forget: () => send("DELETE", "/api/assistant/system1/key").then(j<YetiSettings>),
  decide: (sentence: string, page: YetiPage | null) => post("/api/assistant/decide", { sentence, page }).then(j<import("./agent").Decision>),
  actionOutcome: (id: string, outcome: "approved" | "declined" | "done" | "failed", note?: string) =>
    post(`/api/assistant/actions/${id}`, { outcome, note }).then(j<{ result: string }>),
  diagnosis: (runId: string) => fetch(`/api/runs/${runId}/diagnosis`).then(j<import("./agent").Diagnosis>),
  actions: () => fetch("/api/actions").then(j<{ actions: { id: string; title: string; tier: string; needs: string }[]; pages: Record<string, string> }>),
  yetiDisconnect: (clientId: string) => send("DELETE", `/api/assistant/apps/${clientId}`).then(j<{ apps: YetiSettings["connector"]["apps"] }>),

  // ---------- searches + export (hub) ----------
  searches: () => fetch("/api/searches").then(j<SearchSummary[]>),
  search: (id: string) => fetch(`/api/searches/${id}`).then(j<SearchDetail>),
  searchPreview: (body: Partial<SearchSpec>) => post("/api/searches/preview", body).then(j<SearchPreview>),
  createSearch: (body: Partial<SearchSpec>) => post("/api/searches", body).then(j<SearchDetail>),
  cancelSearch: (id: string) => post(`/api/searches/${id}/cancel`).then(j<SearchDetail>),
  deleteSearch: (id: string) => send("DELETE", `/api/searches/${id}`).then(j<{ result: string }>),
  exportRun: (runId: string, stage: string) => post(`/api/runs/${runId}/export`, { stage }).then(j<Command>),
  exports: (runId: string) => fetch(`/api/runs/${runId}/exports`).then(j<Command[]>),
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
