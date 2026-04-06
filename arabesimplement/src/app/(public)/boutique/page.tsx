import { BoutiqueClient } from "./BoutiqueClient";
import {
  getFormationsForBoutique,
  getBoutiqueThemeFilters,
} from "@/lib/data/formations.service";

export default async function BoutiquePage() {
  const formations = await getFormationsForBoutique();
  const themeFilters = getBoutiqueThemeFilters(formations);

  return (
    <BoutiqueClient formations={formations} themeFilters={themeFilters} />
  );
}
