import { BoutiqueClient } from "./BoutiqueClient";
import {
  getFormationsForBoutique,
  getBoutiqueThemeFilters,
  toBoutiqueCard,
} from "@/lib/data/formations.service";

export default async function BoutiquePage() {
  const formations = await getFormationsForBoutique();
  const themeFilters = getBoutiqueThemeFilters(formations);
  const cards = formations.map(toBoutiqueCard);

  return (
    <BoutiqueClient formations={cards} themeFilters={themeFilters} />
  );
}
