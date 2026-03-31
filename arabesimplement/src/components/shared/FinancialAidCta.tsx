import { HeartHandshake } from "lucide-react";
import { SITE_CONTACT } from "@/lib/site-contact";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Encart sur footer sombre : textes plus clairs */
  tone?: "light" | "dark";
};

export function FinancialAidCta({ className, tone = "light" }: Props) {
  const isDark = tone === "dark";
  return (
    <div
      className={cn(
        "rounded-xl border p-5 space-y-3",
        isDark
          ? "border-white/15 bg-white/5 text-gray-200"
          : "border-secondary/25 bg-secondary/5",
        className
      )}
    >
      <div className="flex gap-3">
        <HeartHandshake
          className={cn(
            "h-6 w-6 shrink-0",
            isDark ? "text-secondary" : "text-secondary"
          )}
        />
        <div>
          <p
            className={cn(
              "font-serif font-semibold",
              isDark ? "text-white" : "text-primary"
            )}
          >
            {SITE_CONTACT.financialAid.title}
          </p>
          <p
            className={cn(
              "text-sm mt-1",
              isDark ? "text-gray-300" : "text-gray-600"
            )}
          >
            {SITE_CONTACT.financialAid.description}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <a
          href={SITE_CONTACT.financialAid.whatsappHommesHref}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors",
            isDark
              ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
          )}
        >
          WhatsApp hommes
        </a>
        <a
          href={SITE_CONTACT.financialAid.whatsappFemmesHref}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors",
            isDark
              ? "border-white/25 text-white hover:bg-white/10"
              : "border-input bg-background hover:bg-muted"
          )}
        >
          WhatsApp femmes
        </a>
      </div>
    </div>
  );
}
