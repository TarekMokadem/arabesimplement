import { BoutiqueClient } from "./BoutiqueClient";
import {
  getFormationsForBoutique,
  getBoutiqueCategoryFilters,
  toBoutiqueCard,
} from "@/lib/data/formations.service";

export default async function BoutiquePage() {
  const formations = await getFormationsForBoutique();
  const categoryFilters = getBoutiqueCategoryFilters(formations);
  const cards = formations.map(toBoutiqueCard);

  return (
    <BoutiqueClient
      formations={cards}
      categoryFilters={categoryFilters}
    />
  );
}
