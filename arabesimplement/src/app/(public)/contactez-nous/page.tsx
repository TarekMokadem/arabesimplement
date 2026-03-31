"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Send,
  Loader2,
  Mail,
  MapPin,
  CheckCircle,
  MessageCircle,
  Instagram,
} from "lucide-react";
import { SITE_CONTACT } from "@/lib/site-contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { FinancialAidCta } from "@/components/shared/FinancialAidCta";
import { contactSchema, type ContactInput } from "@/lib/validations/contact.schema";
import { toast } from "sonner";

export default function ContactezNousPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactInput) => {
    setIsLoading(true);

    try {
      const { submitContact } = await import("@/app/(public)/actions/contact.actions");
      const result = await submitContact(data);

      if (result.success) {
        setIsSubmitted(true);
        reset();
        toast.success("Message envoyé avec succès !");
      } else {
        toast.error(result.error ?? "Une erreur est survenue.");
      }
    } catch (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-20">
      <PageHeader
        title="Contactez-nous"
        subtitle="Une question ? Un projet ? N'hésitez pas à nous écrire."
      />

      <section className="py-16 bg-surface">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary mb-6">
                  Nos coordonnées
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-primary">Email</p>
                      <a
                        href={`mailto:${SITE_CONTACT.email}`}
                        className="text-gray-600 hover:text-secondary break-all"
                      >
                        {SITE_CONTACT.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-5 w-5 text-secondary" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-primary">WhatsApp</p>
                      <a
                        href={SITE_CONTACT.whatsappHommes.href}
                        className="block text-gray-600 hover:text-secondary"
                      >
                        Hommes — {SITE_CONTACT.whatsappHommes.display}
                      </a>
                      <a
                        href={SITE_CONTACT.whatsappFemmes.href}
                        className="block text-gray-600 hover:text-secondary"
                      >
                        Femmes — {SITE_CONTACT.whatsappFemmes.display}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Send className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-primary">Telegram</p>
                      <a
                        href={SITE_CONTACT.telegram.href}
                        className="text-gray-600 hover:text-secondary"
                      >
                        @{SITE_CONTACT.telegram.display}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Instagram className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-primary">Instagram</p>
                      <a
                        href={SITE_CONTACT.instagram.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-secondary"
                      >
                        {SITE_CONTACT.instagram.display}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-secondary font-bold text-sm">S</span>
                    </div>
                    <div>
                      <p className="font-medium text-primary">Snapchat</p>
                      <a
                        href={SITE_CONTACT.snapchat.href}
                        className="text-gray-600 hover:text-secondary"
                      >
                        {SITE_CONTACT.snapchat.display}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-primary">Partenaire</p>
                      <p className="text-gray-600">Institut en Égypte</p>
                    </div>
                  </div>
                </div>
              </div>

              <FinancialAidCta className="bg-white" />

              {/* FAQ Quick Links */}
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-serif font-bold text-primary mb-4">
                  Questions fréquentes
                </h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-secondary transition-colors"
                    >
                      Comment accéder à mes cours ?
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-secondary transition-colors"
                    >
                      Comment changer de créneau ?
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-secondary transition-colors"
                    >
                      Politique de remboursement
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-white">
                <CardContent className="p-8">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-8 w-8 text-accent" />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-primary mb-2">
                        Message envoyé !
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Nous vous répondrons dans les plus brefs délais.
                      </p>
                      <Button
                        onClick={() => setIsSubmitted(false)}
                        variant="outline"
                        className="border-primary text-primary"
                      >
                        Envoyer un autre message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nom">Nom complet *</Label>
                          <Input
                            id="nom"
                            {...register("nom")}
                            placeholder="Votre nom"
                            className={errors.nom ? "border-red-500" : ""}
                            data-testid="contact-nom"
                          />
                          {errors.nom && (
                            <p className="text-red-500 text-sm">
                              {errors.nom.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            {...register("email")}
                            placeholder="votre@email.com"
                            className={errors.email ? "border-red-500" : ""}
                            data-testid="contact-email"
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sujet">Sujet *</Label>
                        <Input
                          id="sujet"
                          {...register("sujet")}
                          placeholder="L'objet de votre message"
                          className={errors.sujet ? "border-red-500" : ""}
                          data-testid="contact-sujet"
                        />
                        {errors.sujet && (
                          <p className="text-red-500 text-sm">
                            {errors.sujet.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          {...register("message")}
                          placeholder="Votre message..."
                          rows={6}
                          className={errors.message ? "border-red-500" : ""}
                          data-testid="contact-message"
                        />
                        {errors.message && (
                          <p className="text-red-500 text-sm">
                            {errors.message.message}
                          </p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground px-8 py-6"
                        data-testid="contact-submit"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Envoyer le message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
