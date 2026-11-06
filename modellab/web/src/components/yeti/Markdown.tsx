import { Fragment, ReactNode } from "react";
import { Link } from "react-router-dom";

/** A small, safe Markdown renderer for Yeti's answers: builds React elements (never HTML strings), so nothing in an
 *  answer can inject markup. Covers what Claude writes in chat: headings, paragraphs, bold/italic/code, links, lists,
 *  tables, code blocks, quotes and rules. In-app links ("/runs/…") route inside the app; http(s) links open a new tab;
 *  anything else stays text. Works on partial text while streaming. */
export default function Markdown({ text, onNavigate }: { text: string; onNavigate?: () => void }) {
  return <div className="yeti-md space-y-2.5 text-[13px] leading-relaxed text-fg">{blocks(text, onNavigate)}</div>;
}

const isTableSep = (l: string) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l);
const cells = (l: string) => l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());

function blocks(src: string, nav?: () => void): ReactNode[] {
  const lines = src.replace(/\r/g, "").split("\n");
  const out: ReactNode[] = [];
  let i = 0;
  const key = () => `b${out.length}`;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const fence = line.match(/^\s*```(\w*)/);
    if (fence) {
      const body: string[] = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) body.push(lines[i++]);
      i++;
      out.push(<pre key={key()} className="scroll-thin overflow-x-auto rounded-lg bg-code px-3 py-2.5 font-mono text-[11.5px] leading-[1.6] text-zinc-200">{body.join("\n")}</pre>);
      continue;
    }
    const h = line.match(/^\s{0,3}(#{1,4})\s+(.*)$/);
    if (h) {
      out.push(<div key={key()} className={h[1].length <= 2 ? "pt-1 text-[14px] font-semibold text-fg" : "pt-0.5 text-[13px] font-semibold text-fg"}>{inline(h[2], nav)}</div>);
      i++;
      continue;
    }
    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) { out.push(<hr key={key()} className="border-line" />); i++; continue; }
    if (line.includes("|") && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      const head = cells(line);
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && lines[i].includes("|") && lines[i].trim()) rows.push(cells(lines[i++]));
      out.push(
        <div key={key()} className="scroll-thin overflow-x-auto rounded-lg border border-line">
          <table className="w-full border-collapse text-[12px]">
            <thead className="bg-raised/60"><tr>{head.map((c, k) => <th key={k} className="whitespace-nowrap px-2.5 py-1.5 text-left font-medium text-muted">{inline(c, nav)}</th>)}</tr></thead>
            <tbody>{rows.map((r, ri) => (
              <tr key={ri} className="border-t border-line">{head.map((_, k) => <td key={k} className="px-2.5 py-1.5 align-top tabular-nums">{inline(r[k] ?? "", nav)}</td>)}</tr>
            ))}</tbody>
          </table>
        </div>);
      continue;
    }
    if (/^\s*>/.test(line)) {
      const body: string[] = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) body.push(lines[i++].replace(/^\s*>\s?/, ""));
      out.push(<blockquote key={key()} className="border-l-2 border-accent/40 pl-3 text-muted">{blocks(body.join("\n"), nav)}</blockquote>);
      continue;
    }
    if (/^\s*([-*+]|\d+[.)])\s+/.test(line)) {
      const { node, next } = list(lines, i, nav);
      out.push(<Fragment key={key()}>{node}</Fragment>);
      i = next;
      continue;
    }
    const para: string[] = [lines[i++]]; // the first line always goes in, so the parser always moves on
    while (i < lines.length && lines[i].trim() && !/^\s*(```|>|([-*+]|\d+[.)])\s+)|^\s{0,3}#{1,4}\s/.test(lines[i])
           && !(lines[i].includes("|") && i + 1 < lines.length && isTableSep(lines[i + 1]))) para.push(lines[i++]);
    out.push(<p key={key()}>{para.map((p, k) => <Fragment key={k}>{k > 0 && <br />}{inline(p, nav)}</Fragment>)}</p>);
  }
  return out;
}

function list(lines: string[], start: number, nav?: () => void): { node: ReactNode; next: number } {
  const indent = (l: string) => l.match(/^\s*/)![0].length;
  const base = indent(lines[start]);
  const ordered = /^\s*\d+[.)]\s+/.test(lines[start]);
  const items: { text: string[]; sub: ReactNode[] }[] = [];
  let i = start;
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) {
      if (i + 1 < lines.length && /^\s*([-*+]|\d+[.)])\s+/.test(lines[i + 1]) && indent(lines[i + 1]) >= base) { i++; continue; }
      break;
    }
    const m = l.match(/^(\s*)([-*+]|\d+[.)])\s+(.*)$/);
    if (m && m[1].length === base) { items.push({ text: [m[3]], sub: [] }); i++; continue; }
    if (m && m[1].length > base && items.length) {
      const r = list(lines, i, nav);
      items[items.length - 1].sub.push(<Fragment key={i}>{r.node}</Fragment>);
      i = r.next;
      continue;
    }
    if (!m && indent(l) > base && items.length) { items[items.length - 1].text.push(l.trim()); i++; continue; }
    break;
  }
  const cls = ordered ? "list-decimal" : "list-disc";
  const node = (
    <ul className={`${cls} space-y-1 pl-5 marker:text-subtle`}>
      {items.map((it, k) => <li key={k} className="pl-0.5">{inline(it.text.join(" "), nav)}{it.sub}</li>)}
    </ul>
  );
  return { node, next: i };
}

const TOKEN = /(`[^`]+`)|(\*\*[^*]+\*\*)|(__[^_]+__)|(\[[^\]]+\]\([^)\s]+\))|(\*[^*\s][^*]*\*)|(_[^_\s][^_]*_)/g;

function inline(s: string, nav?: () => void): ReactNode {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  const re = new RegExp(TOKEN.source, "g"); // one per call: inline() recurses, a shared /g regex would loop forever
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const t = m[0];
    const k = `${m.index}`;
    if (m[1]) out.push(<code key={k} className="rounded bg-raised px-1 py-px font-mono text-[11.5px] text-fg">{t.slice(1, -1)}</code>);
    else if (m[2] || m[3]) out.push(<strong key={k} className="font-semibold">{inline(t.slice(2, -2), nav)}</strong>);
    else if (m[4]) {
      const lm = t.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)!;
      out.push(<LinkTo key={k} href={lm[2]} nav={nav}>{inline(lm[1], nav)}</LinkTo>);
    } else out.push(<em key={k}>{inline(t.slice(1, -1), nav)}</em>);
    last = m.index + t.length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

function LinkTo({ href, children, nav }: { href: string; children: ReactNode; nav?: () => void }) {
  const cls = "font-medium text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent";
  if (/^\/(?!\/)/.test(href)) return <Link to={href} onClick={nav} className={cls}>{children}</Link>;
  if (/^https?:\/\//i.test(href)) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>;
  return <>{children}</>;
}
