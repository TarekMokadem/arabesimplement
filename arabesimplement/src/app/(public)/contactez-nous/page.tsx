"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Loader2, Mail, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
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

      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#0F2A45] mb-6">
                  Nos coordonnées
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#B7860B]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-[#B7860B]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#0F2A45]">Email</p>
                      <a
                        href="mailto:contact@arabesimplement.fr"
                        className="text-gray-600 hover:text-[#B7860B]"
                      >
                        contact@arabesimplement.fr
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#B7860B]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-[#B7860B]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#0F2A45]">Localisation</p>
                      <p className="text-gray-600">Égypte</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Quick Links */}
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-serif font-bold text-[#0F2A45] mb-4">
                  Questions fréquentes
                </h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-[#B7860B] transition-colors"
                    >
                      Comment accéder à mes cours ?
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-[#B7860B] transition-colors"
                    >
                      Comment changer de créneau ?
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-[#B7860B] transition-colors"
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
                      <div className="w-16 h-16 bg-[#1A7A4A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-8 w-8 text-[#1A7A4A]" />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-[#0F2A45] mb-2">
                        Message envoyé !
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Nous vous répondrons dans les plus brefs délais.
                      </p>
                      <Button
                        onClick={() => setIsSubmitted(false)}
                        variant="outline"
                        className="border-[#0F2A45] text-[#0F2A45]"
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
                        className="w-full sm:w-auto bg-[#B7860B] hover:bg-[#0F2A45] text-white px-8 py-6"
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
