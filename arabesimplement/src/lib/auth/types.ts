export type AuthSession = {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  role: "STUDENT" | "ADMIN";
};
