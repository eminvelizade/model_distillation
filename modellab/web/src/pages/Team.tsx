import { FormEvent, useState } from "react";
import { KeyRound, Loader2, Package, Shield, UserPlus, Users } from "lucide-react";
import { api, TeamUser } from "../api";
import { CopyBox } from "../components/Hub";
import { useSession } from "../session";
import { Button, Callout, Card, cx, Field, inputCls, Modal, PageHeader, relTime, Switch, Toast, usePoll } from "../ui";

/** Shown once: a temporary password the person changes at their first sign-in. */
function Secret({ who, password, onClose }: { who: string; password: string; onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <div className="space-y-4 p-5">
        <h2 className="text-[15px] font-semibold text-fg">Temporary password for {who}</h2>
        <p className="text-[13px] text-muted">Send it to them privately. It is shown only now; they choose their own password when they first sign in.</p>
        <CopyBox text={password} />
        <div className="flex justify-end"><Button variant="primary" onClick={onClose}>Done</Button></div>
      </div>
    </Modal>
  );
}

function AddUser({ onClose, onCreated }: { onClose: () => void; onCreated: (who: string, pw: string) => void }) {
  const [username, setUsername] = useState("");
  const [display, setDisplay] = useState("");
  const [admin, setAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await api.addUser({ username: username.trim().toLowerCase(), display_name: display.trim(), is_admin: admin });
      onCreated(r.user.username, r.password ?? "");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal onClose={onClose}>
      <form onSubmit={submit} className="space-y-4 p-5">
        <h2 className="text-[15px] font-semibold text-fg">Add a user</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Username" hint="lowercase, used to sign in"><input className={cx(inputCls, "font-mono text-[12.5px]")} value={username} onChange={(e) => setUsername(e.target.value)} autoFocus required /></Field>
          <Field label="Display name"><input className={inputCls} value={display} onChange={(e) => setDisplay(e.target.value)} /></Field>
        </div>
        <Switch checked={admin} onChange={setAdmin} label="Admin (manages users and releases)" />
        {error && <Callout tone="error">{error}</Callout>}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={busy || !username.trim()}>{busy ? <Loader2 className="animate-spin" /> : <UserPlus />}Create</Button>
        </div>
      </form>
    </Modal>
  );
}

export default function Team() {
  const { me } = useSession();
  const users = usePoll(api.users, 0);
  const rel = usePoll(api.releases, 0);
  const [adding, setAdding] = useState(false);
  const [secret, setSecret] = useState<{ who: string; password: string } | null>(null);
  const [toast, setToast] = useState<{ msg: string; kind?: "info" | "error" } | null>(null);
  const fail = (e: Error) => setToast({ msg: e.message, kind: "error" });
  const patch = (u: TeamUser, body: { is_admin?: boolean; disabled?: boolean }) => api.patchUser(u.id, body).then(() => users.refresh()).catch(fail);
  const self = me?.user?.id;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin" title="Team" description="Only the people listed here can sign in. Each user pairs and uses their own machines."
        actions={<Button variant="brand" onClick={() => setAdding(true)}><UserPlus />Add user</Button>} />

      <Card title="Users" icon={<Users className="h-3.5 w-3.5" />} flush>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-[13px]">
            <thead><tr className="border-b border-line text-left text-xs text-subtle">
              <th className="px-5 py-2 font-medium">User</th><th className="px-3 py-2 font-medium">Role</th><th className="px-3 py-2 font-medium">Machines</th>
              <th className="px-3 py-2 font-medium">Last sign-in</th><th className="px-5 py-2" />
            </tr></thead>
            <tbody>
              {(users.data ?? []).map((u) => (
                <tr key={u.id} className={cx("border-b border-line last:border-0", u.disabled && "opacity-55")}>
                  <td className="px-5 py-2.5">
                    <div className="font-medium text-fg">{u.display_name}{u.id === self && <span className="ml-1.5 text-2xs text-subtle">(you)</span>}</div>
                    <div className="font-mono text-[11.5px] text-subtle">{u.username}</div>
                  </td>
                  <td className="px-3 py-2.5">
                    {u.disabled ? <span className="rounded-md bg-raised px-1.5 py-0.5 text-[11px] text-muted">disabled</span>
                      : u.is_admin ? <span className="inline-flex items-center gap-1 rounded-md bg-accent/10 px-1.5 py-0.5 text-[11px] font-medium text-accent"><Shield className="h-3 w-3" />admin</span>
                      : <span className="text-xs text-muted">member</span>}
                    {u.must_change_password && !u.disabled && <span className="ml-1.5 text-2xs text-amber-600 dark:text-amber-300">temp password</span>}
                  </td>
                  <td className="px-3 py-2.5 font-mono tabular-nums text-muted">{u.machines}</td>
                  <td className="px-3 py-2.5 text-xs text-muted">{u.last_login ? relTime(u.last_login) : "never"}</td>
                  <td className="px-5 py-2.5">
                    {u.id !== self && (
                      <div className="flex justify-end gap-1.5">
                        <Button small variant="ghost" onClick={() => api.resetPassword(u.id).then((r) => setSecret({ who: u.username, password: r.password })).catch(fail)}><KeyRound />Reset password</Button>
                        {!u.disabled && <Button small variant="ghost" onClick={() => patch(u, { is_admin: !u.is_admin })}>{u.is_admin ? "Make member" : "Make admin"}</Button>}
                        <Button small variant={u.disabled ? "secondary" : "danger"} onClick={() => patch(u, { disabled: !u.disabled })}>{u.disabled ? "Enable" : "Disable"}</Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Agent releases" icon={<Package className="h-3.5 w-3.5" />} description="signed in CI; machines update to the current one when idle" flush>
        {rel.error ? <div className="px-5 pb-5 text-[13px] text-rose-600">{rel.error}</div>
          : !(rel.data?.releases ?? []).length ? <div className="px-5 pb-5 text-[13px] text-subtle">No release published yet: run the “agent release” GitHub Action (see docs/HUB.md). Machines can't install until there is one.</div> : (
            <ul className="px-2 pb-2">
              {(rel.data?.releases ?? []).slice(0, 10).map((r) => {
                const cur = r.version === rel.data?.current;
                return (
                  <li key={r.version} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl px-3 py-2.5 hover:bg-raised/40">
                    <span className="font-mono text-[12.5px] font-medium text-fg">{r.version}</span>
                    {cur && <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">current</span>}
                    <span className="text-xs text-subtle">{relTime(r.created)} · {r.manifest?.git_commit?.slice(0, 7) ?? "?"}</span>
                    {!cur && <Button small variant="ghost" className="ml-auto" onClick={() => api.setCurrentRelease(r.version).then(() => { rel.refresh(); setToast({ msg: `Machines move to ${r.version} when idle` }); }).catch(fail)}>Make current</Button>}
                  </li>
                );
              })}
            </ul>
          )}
      </Card>

      {adding && <AddUser onClose={() => setAdding(false)} onCreated={(who, pw) => { setAdding(false); users.refresh(); setSecret({ who, password: pw }); }} />}
      {secret && <Secret who={secret.who} password={secret.password} onClose={() => setSecret(null)} />}
      <Toast msg={toast?.msg ?? null} kind={toast?.kind} onClose={() => setToast(null)} />
    </div>
  );
}
