const MADRID = "Europe/Madrid";

function getMadridOffsetMs(refUtcMs: number): number {
  const ref = new Date(refUtcMs);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: MADRID,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .formatToParts(ref)
    .reduce<Record<string, number>>((a, p) => {
      if (p.type !== "literal") a[p.type] = Number(p.value);
      return a;
    }, {});

  const madridUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  return madridUtc - refUtcMs;
}

function getMadridComponents(date: Date) {
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
    .reduce<Record<string, number>>((a, p) => {
      if (p.type !== "literal") a[p.type] = Number(p.value);
      return a;
    }, {});
}

/**
 * Interprets a naive datetime string from Supabase as Madrid local time.
 * Returns a Date whose getTime() is the correct UTC timestamp.
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

  const refUtcMs = Date.UTC(year, month, day, hour, minute, 0);
  const offsetMs = getMadridOffsetMs(refUtcMs);
  return new Date(refUtcMs - offsetMs);
}

/**
 * Returns the current time (browser local — user is in Madrid).
 */
export function nowMadrid(): Date {
  return new Date();
}

/**
 * Formats a fecha_hora for display in Madrid time: "DD/MM/YYYY, HH:MM"
 */
export function formatFechaMadrid(
  fechaHora: string | number | Date | null | undefined,
): string {
  if (!fechaHora) return "";
  const date = parseFechaLocal(fechaHora);
  const md = getMadridComponents(date);
  return `${String(md.day).padStart(2, "0")}/${String(md.month).padStart(2, "0")}/${md.year}, ${String(md.hour).padStart(2, "0")}:${String(md.minute).padStart(2, "0")}`;
}

/**
 * Returns "HH:MM" in Madrid time from a fecha_hora string.
 */
export function extractTime(fechaHora: string): string {
  const date = parseFechaLocal(fechaHora);
  const md = getMadridComponents(date);
  return `${String(md.hour).padStart(2, "0")}:${String(md.minute).padStart(2, "0")}`;
}

/**
 * Returns today's date as "YYYY-MM-DD" in Madrid timezone.
 */
export function todayISODate(): string {
  const md = getMadridComponents(new Date());
  return `${md.year}-${String(md.month).padStart(2, "0")}-${String(md.day).padStart(2, "0")}`;
}
