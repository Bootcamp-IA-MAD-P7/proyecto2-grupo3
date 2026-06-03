/**
 * Interprets a naive datetime string from the DB as local time.
 * Returns a Date object in the browser's local timezone.
 *
 * IMPORTANT: The DB stores naive datetimes in Madrid local time.
 * The user's browser IS in Madrid. So new Date(y,m,d,h,min) = correct.
 * We do NOT apply any timezone offset — both parseFechaLocal() and
 * new Date() (now) use the same browser-local timezone, so comparisons work.
 */
export function parseFechaLocal(
  fechaHora: string | number | Date | null | undefined,
): Date {
  if (!fechaHora) return new Date(0);
  if (fechaHora instanceof Date) return fechaHora;
  if (typeof fechaHora === "number") return new Date(fechaHora);

  const str = String(fechaHora);
  const clean = str.replace(/Z|[+-]\d{2}:\d{2}(:\d{2})?$/, "");
  const norm = clean.replace("T", " ").substring(0, 16);
  const p = norm.split(/[\s\-:T]/);

  return new Date(
    Number(p[0]),
    Number(p[1]) - 1,
    Number(p[2]),
    Number(p[3]),
    Number(p[4] || "0"),
  );
}

/**
 * Current time in browser local (Madrid).
 */
export function nowMadrid(): Date {
  return new Date();
}

/**
 * Formats a fecha_hora for display: "DD/MM/YYYY, HH:MM"
 */
export function formatFechaMadrid(
  fechaHora: string | number | Date | null | undefined,
): string {
  if (!fechaHora) return "";
  const date = parseFechaLocal(fechaHora);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}, ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

/**
 * Returns "HH:MM" from a fecha_hora string.
 */
export function extractTime(fechaHora: string): string {
  const d = parseFechaLocal(fechaHora);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/**
 * Returns today's date as "YYYY-MM-DD".
 */
export function todayISODate(): string {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
}
