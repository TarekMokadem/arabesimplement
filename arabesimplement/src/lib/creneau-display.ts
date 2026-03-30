/** Créneau : un horaire par jour (récurrent hebdo). */

export type JourneeSlot = {
  jour: string;
  heureDebut: string;
  dureeMinutes: number;
};

function clipHeure(h: string): string {
  return h.length >= 5 ? h.slice(0, 5) : h;
}

export function parseJourneeSlotsFromJson(
  raw: unknown
): JourneeSlot[] | undefined {
  if (!raw || !Array.isArray(raw)) return undefined;
  const out: JourneeSlot[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const jour = typeof o.jour === "string" ? o.jour.trim() : "";
    const heureDebut =
      typeof o.heureDebut === "string" ? clipHeure(o.heureDebut.trim()) : "";
    const dm =
      typeof o.dureeMinutes === "number"
        ? o.dureeMinutes
        : Number(o.dureeMinutes);
    if (!jour || !heureDebut || !Number.isFinite(dm) || dm <= 0) continue;
    out.push({ jour, heureDebut, dureeMinutes: Math.round(dm) });
  }
  return out.length ? out : undefined;
}

export function normalizeJourneeSlots(
  slots: JourneeSlot[] | null | undefined,
  fallback: { jours: string[]; heureDebut: string; dureeMinutes: number }
): JourneeSlot[] {
  if (slots && slots.length > 0) {
    return slots.map((s) => ({
      jour: s.jour.trim(),
      heureDebut: clipHeure(s.heureDebut),
      dureeMinutes: s.dureeMinutes,
    }));
  }
  const h = clipHeure(fallback.heureDebut);
  return fallback.jours.map((jour) => ({
    jour: jour.trim(),
    heureDebut: h,
    dureeMinutes: fallback.dureeMinutes,
  }));
}

export function formatCreneauSlotLine(s: JourneeSlot): string {
  return `${s.jour} à ${clipHeure(s.heureDebut)} — ${s.dureeMinutes} min`;
}

export function formatCreneauSummaryForCart(
  nom: string,
  slots: JourneeSlot[] | null | undefined,
  fallback: { jours: string[]; heureDebut: string; dureeMinutes: number }
): string {
  const list = normalizeJourneeSlots(slots, fallback);
  const lines = list.map(formatCreneauSlotLine);
  return `${nom} — ${lines.join(" · ")}`;
}
