/**
 * Mise en avant très légère de PayPal (ordre visuel, confiance) sans imposer le choix.
 * Le flux réel reste géré par Stripe (incl. PayPal si activé sur le compte Stripe).
 */
export function PaymentExperiencePreface() {
  return (
    <div className="rounded-xl border border-border bg-gradient-to-b from-surface/80 to-white px-4 py-3 mb-4 space-y-2">
      <p className="text-sm text-gray-700 leading-snug">
        <span className="font-medium text-primary">PayPal ou carte :</span>{" "}
        choisissez le moyen qui vous convient dans le formulaire ci-dessous.
        Beaucoup d’élèves utilisent PayPal pour un règlement rapide avec leur compte habituel.
      </p>
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-2 py-1 ring-1 ring-secondary/25 text-[11px] font-semibold text-[#003087] tracking-tight">
          PayPal
        </span>
        <span className="text-gray-400">·</span>
        <span>Visa</span>
        <span>·</span>
        <span>Mastercard</span>
        <span className="text-gray-400 ml-auto">Paiement sécurisé</span>
      </div>
    </div>
  );
}
