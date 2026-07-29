/** Shared formatting + tiny class-name helpers. */

/**
 * Instants arrive from the API as epoch milliseconds, but ISO strings are
 * accepted too so either serialization renders correctly.
 */
export type TimestampInput = string | number | null | undefined;

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Truncate a long hash / key through the middle: 9f3c02ab…77d1 */
export function truncateMiddle(value: string, head = 10, tail = 6): string {
  if (value.length <= head + tail + 1) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** "in 3d 4h" / "2h left" / "closed" — for deadlines. */
export function formatDeadline(iso: string | null | undefined): string {
  if (!iso) return "—";
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return "—";
  const diff = target - Date.now();
  if (diff <= 0) return "closed";
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ${hours % 24}h left`;
  if (hours > 0) return `${hours}h left`;
  const minutes = Math.max(1, Math.floor(diff / 60_000));
  return `${minutes}m left`;
}

/** "open_for_bids" → "Open for bids" */
export function humanize(value: string): string {
  const s = value.replaceAll("_", " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}
