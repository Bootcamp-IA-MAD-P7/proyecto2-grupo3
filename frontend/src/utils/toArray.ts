export function toArray<T>(data: T[] | { data: T[] } | undefined | null): T[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && "data" in data && Array.isArray((data as { data: T[] }).data))
    return (data as { data: T[] }).data;
  return [];
}
