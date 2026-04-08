import type { PaypalMeRecipient } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const GLOBAL_ID = "global";

export async function getOrCreateSiteConfig() {
  return prisma.siteConfig.upsert({
    where: { id: GLOBAL_ID },
    create: {
      id: GLOBAL_ID,
      paypalMeRecipient: "YACINE_BOU18",
    },
    update: {},
  });
}

export async function setSitePaypalMeRecipient(recipient: PaypalMeRecipient) {
  await prisma.siteConfig.upsert({
    where: { id: GLOBAL_ID },
    create: {
      id: GLOBAL_ID,
      paypalMeRecipient: recipient,
    },
    update: { paypalMeRecipient: recipient },
  });
}
