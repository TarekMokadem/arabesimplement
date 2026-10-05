import { UserCreateForm } from "../UserCreateForm";

export default function NouveauUtilisateurPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-6 sm:mb-8">
        Ajouter un client
      </h1>
      <p className="text-gray-500 mb-6 max-w-xl">
        Créez une fiche élève (paiement hors site, inscription manuelle, etc.).
        Un mot de passe provisoire est généré.
      </p>
      <UserCreateForm />
    </div>
  );
}
