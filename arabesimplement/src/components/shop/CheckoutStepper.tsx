"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  label: string;
}

const steps: Step[] = [
  { id: 1, label: "Panier" },
  { id: 2, label: "Informations" },
  { id: 3, label: "Paiement" },
  { id: 4, label: "Confirmation" },
];

interface CheckoutStepperProps {
  currentStep: number;
}

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  return (
    <div className="w-full py-4 sm:py-8" data-testid="checkout-stepper">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-medium text-xs sm:text-sm transition-all duration-300",
                  currentStep > step.id
                    ? "bg-accent text-white"
                    : currentStep === step.id
                    ? "bg-secondary text-secondary-foreground shadow-gold"
                    : "bg-gray-200 text-gray-500"
                )}
                data-testid={`step-${step.id}`}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium hidden sm:block",
                  currentStep >= step.id ? "text-primary" : "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-6 sm:w-12 md:w-20 h-0.5 mx-1 sm:mx-2 transition-colors duration-300",
                  currentStep > step.id ? "bg-accent" : "bg-gray-200"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
