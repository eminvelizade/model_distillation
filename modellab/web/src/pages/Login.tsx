import { FormEvent, useState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { api } from "../api";
import { Button, Callout, Field, inputCls, Mascot } from "../ui";

/** Hub only: accounts are created by an admin, there is no sign-up. */
export default function Login({ onDone }: { onDone: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.login(username.trim(), password);
      onDone();
    } catch (err) {
      setError((err as Error).message);
      setPassword("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="aurora pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px]" />
      <div className="w-full max-w-[380px] animate-enter">
        <div className="mb-7 flex flex-col items-center text-center">
          <div className="animate-float"><Mascot size={64} mood={error ? "sad" : "happy"} /></div>
          <h1 className="mt-4 text-[24px] font-semibold tracking-[-0.02em] text-fg">ModelLab</h1>
          <p className="mt-1 text-sm text-muted">fine-tune · distill · benchmark, on your own GPUs</p>
        </div>
        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-lift">
          <Field label="Username">
            <input className={inputCls} value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username"
              autoCapitalize="none" spellCheck={false} autoFocus required />
          </Field>
          <Field label="Password">
            <input className={inputCls} type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password" required />
          </Field>
          {error && <Callout tone="error">{error}</Callout>}
          <Button type="submit" variant="brand" className="w-full" disabled={busy || !username || !password}>
            {busy ? <Loader2 className="animate-spin" /> : <LogIn />}Sign in
          </Button>
        </form>
        <p className="mt-5 text-center text-xs text-subtle">No account? Your ModelLab admin creates one for you.</p>
      </div>
    </main>
  );
}
