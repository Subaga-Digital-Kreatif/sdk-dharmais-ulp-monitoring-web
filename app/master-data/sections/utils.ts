export function toFlat(obj: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (obj && typeof obj === "object") {
    Object.entries(obj as Record<string, unknown>).forEach(([k, v]) => {
      if (v === null || v === undefined) out[k] = "";
      if (typeof v === "number") out[k] = String(v);
      else if (typeof v === "boolean") out[k] = v ? "true" : "false";
      else if (typeof v === "string") out[k] = v;
    });
  }
  return out;
}
