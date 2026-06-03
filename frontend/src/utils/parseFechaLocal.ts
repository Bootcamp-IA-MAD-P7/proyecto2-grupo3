const MADRID = "Europe/Madrid";

function madridParts(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: MADRID,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .formatToParts(date)
    .reduce<Record<string, number>>((acc, p) => {
      if (p.type !== "literal") acc[p.type] = Number(p.value);
      return acc;
    }, {});
}

function getMadridOffsetMs(now: Date): number {
  const utc = {
    y: now.getUTCFullYear(),
    m: now.getUTCMonth(),
    d: now.getUTCDate(),
    h: now.getUTCHours(),
    mi: now.getUTCMinutes(),
    s: now.getUTCSeconds(),
  };
  const md = madridParts(now);
  return (
    Date.UTC(md.year, md.month - 1, md.day, md.hour, md.minute, md.second) -
    Date.UTC(utc.y, utc.m, utc.d, utc.h, utc.mi, utc.s)
  );
}

/**
 * Interprets a naive datetime string from Supabase as Madrid local time.
 * Returns a Date whose getTime() is correct for comparisons.
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

  const year = Number(p[0]);
  const month = Number(p[1]) - 1;
  const day = Number(p[2]);
  const hour = Number(p[3]);
  const minute = Number(p[4] || "0");

  const now = new Date();
  const offset = getMadridOffsetMs(now);

  const utcTarget = Date.UTC(year, month, day, hour, minute, 0);
  return new Date(utcTarget - offset);
}

/**
 * Returns the current time in Madrid timezone.
 */
export function nowMadrid(): Date {
  const now = new Date();
  const md = madridParts(now);
  return new Date(
    md.year,
    md.month - 1,
    md.day,
    md.hour,
    md.minute,
    md.second,
  );
}

/**
 * Formats a fecha_hora for display in Madrid time: "DD/MM/YYYY, HH:MM"
 */
export function formatFechaMadrid(
  fechaHora: string | number | Date | null | undefined,
): string {
  if (!fechaHora) return "";
  const date =
    typeof fechaHora === "string"
      ? parseFechaLocal(fechaHora)
      : fechaHora instanceof Date
        ? fechaHora
        : new Date(fechaHora);
  const md = madridParts(date);
  return `${String(md.day).padStart(2, "0")}/${String(md.month).padStart(2, "0")}/${md.year}, ${String(md.hour).padStart(2, "0")}:${String(md.minute).padStart(2, "0")}`;
}

/**
 * Returns "YYYY-MM-DD" for a fecha_hora in Madrid time.
 */
export function fechaToISODate(fechaHora: string): string {
  const d = parseFechaLocal(fechaHora);
  const md = madridParts(d);
  return `${md.year}-${String(md.month).padStart(2, "0")}-${String(md.day).padStart(2, "0")}`;
}

/**
 * Returns today's date as "YYYY-MM-DD" in Madrid time.
 */
export function todayISODate(): string {
  const md = madridParts(new Date());
  return `${md.year}-${String(md.month).padStart(2, "0")}-${String(md.day).padStart(2, "0")}`;
}

/**
 * Returns HH:MM from a fecha_hora string.
 */
export function extractTime(fechaHora: string): string {
  const d = parseFechaLocal(fechaHora);
  const md = madridParts(d);
  return `${String(md.hour).padStart(2, "0")}:${String(md.minute).padStart(2, "0")}`;
}
