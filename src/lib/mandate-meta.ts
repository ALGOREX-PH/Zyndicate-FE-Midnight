/**
 * Local, plaintext-on-this-device-only cache of mandate summaries the user
 * is entitled to read (they authored them, or decrypted them with a held
 * key). Lets list surfaces show unsealed titles without refetching and
 * re-decrypting the encrypted package. Class D data — never uploaded.
 */

const META_KEY = "zyn.mandateMeta";

export interface MandateMeta {
  title: string;
  outcome?: string;
}

function readAll(): Record<string, MandateMeta> {
  try {
    return JSON.parse(localStorage.getItem(META_KEY) ?? "{}") as Record<string, MandateMeta>;
  } catch {
    return {};
  }
}

export function storeMandateMeta(mandateId: string, meta: MandateMeta): void {
  const all = readAll();
  all[mandateId] = meta;
  localStorage.setItem(META_KEY, JSON.stringify(all));
}

export function getMandateMeta(mandateId: string): MandateMeta | null {
  return readAll()[mandateId] ?? null;
}
