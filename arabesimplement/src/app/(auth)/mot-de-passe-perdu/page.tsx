import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandLogoMark } from "@/components/layout/BrandLogoMark";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MotDePassePerduPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <BrandLogoMark size={48} />
            <span className="font-serif font-bold text-2xl text-primary">
              ArabeSimplement
            </span>
          </Link>
        </div>

        <Card className="bg-white shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-2xl text-primary">
              Mot de passe oublié
            </CardTitle>
            <p className="text-gray-600 text-sm mt-3 text-left leading-relaxed">
              La réinitialisation en ligne automatique n&apos;est pas encore
              disponible. Pour retrouver l&apos;accès à votre compte, contactez-nous via
              la page « Contact » en indiquant l&apos;email associé à votre compte.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Link
              href="/contactez-nous"
              className="inline-flex items-center justify-center rounded-lg bg-secondary px-4 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Nous contacter
            </Link>
            <Link
              href="/connexion"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-surface"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la connexion
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
