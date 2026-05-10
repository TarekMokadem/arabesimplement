import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminBlogPlaceholderPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <Link href="/admin">
        <Button variant="ghost" size="sm" className="mb-6 text-gray-600 -ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au tableau de bord
        </Button>
      </Link>
      <Card className="bg-white border-dashed border-2 border-gray-200">
        <CardContent className="p-10 text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="h-8 w-8 text-primary" aria-hidden />
          </div>
          <h1 className="font-serif text-2xl font-bold text-primary">
            Blog — Bientôt
          </h1>
          <p className="text-gray-600 leading-relaxed">
            La gestion des articles de blog depuis l&apos;administration sera
            disponible prochainement. Les articles publics existants restent
            servis par la base de données si configurée.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
