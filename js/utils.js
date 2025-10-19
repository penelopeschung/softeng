export function cid() {
  return Math.random().toString(36).slice(2, 10);
}

export function fmtDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, {year:'numeric',month:'long',day:'numeric'});
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;"
  })[m]);
}

export function csvEscape(v) {
  const s = String(v ?? '');
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}