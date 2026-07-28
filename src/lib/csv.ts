export function toCsv(rows: Record<string, unknown>[], columns?: string[]): string {
  if (rows.length === 0) return columns ? columns.join(",") : "";
  const cols = columns ?? Object.keys(rows[0]);

  const escape = (val: unknown) => {
    const str = val === null || val === undefined ? "" : String(val);
    if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };

  const header = cols.map(escape).join(",");
  const lines = rows.map((row) => cols.map((c) => escape(row[c])).join(","));
  return [header, ...lines].join("\n");
}
