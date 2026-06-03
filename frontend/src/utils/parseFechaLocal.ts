/**
 * Interprets a naive datetime string from Supabase (e.g. "2026-06-03T19:00:00")
 * as Madrid local time. Uses the Date local constructor — no offset math needed
 * because the user's browser is in Madrid timezone.
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
 * Returns the current local time (browser is in Madrid).
 */
export function nowMadrid(): Date {
  return new Date();
}

/**
 * Returns "YYYY-MM-DD" for a fecha_hora string in local time.
 */
export function fechaToISODate(fechaHora: string): string {
  const d = parseFechaLocal(fechaHora);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Returns today's date as "YYYY-MM-DD".
 */
export function todayISODate(): string {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
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
