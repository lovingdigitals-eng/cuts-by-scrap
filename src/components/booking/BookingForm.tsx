"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { bookingSchema } from "@/lib/validation";
import type { ServiceCardData } from "@/components/services/ServiceCard";
import { ServiceSelect } from "@/components/booking/ServiceSelect";
import { TimeSlotPicker } from "@/components/booking/TimeSlotPicker";
import { ConfirmationScreen } from "@/components/booking/ConfirmationScreen";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/cn";

const contactSchema = bookingSchema.pick({
  customerName: true,
  phone: true,
  email: true,
  notes: true,
});
type ContactValues = {
  customerName: string;
  phone: string;
  email?: string;
  notes?: string;
};

const STEPS = ["Service", "Date & Time", "Your Info", "Review"];

export function BookingForm({
  services,
  initialServiceId,
}: {
  services: ServiceCardData[];
  initialServiceId?: string;
}) {
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState<string | null>(initialServiceId ?? null);
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [startTime, setStartTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsReason, setSlotsReason] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<{ serviceName: string; date: string; startTime: string } | null>(
    null
  );

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { customerName: "", phone: "", email: "", notes: "" },
  });

  const selectedService = useMemo(
    () => services.find((s) => s.id === serviceId) || null,
    [services, serviceId]
  );

  useEffect(() => {
    if (!serviceId || !date) return;
    setSlotsLoading(true);
    setStartTime(null);
    fetch(`/api/booking/availability?date=${date}&serviceId=${serviceId}`)
      .then((r) => r.json())
      .then((data) => {
        setSlots(data.slots || []);
        setSlotsReason(data.reason);
      })
      .catch(() => {
        setSlots([]);
        setSlotsReason("Couldn't load availability. Please try again.");
      })
      .finally(() => setSlotsLoading(false));
  }, [serviceId, date]);

  async function onSubmit(contact: ContactValues) {
    if (!serviceId || !startTime) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          date,
          startTime,
          ...contact,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error?.formErrors?.join(", ") || data.error || "Something went wrong.");
        setSubmitting(false);
        return;
      }
      setResult({ serviceName: selectedService?.name || "", date, startTime });
    } catch {
      setSubmitError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (result) {
    return <ConfirmationScreen serviceName={result.serviceName} date={result.date} startTime={result.startTime} />;
  }

  const canContinueFromStep0 = !!serviceId;
  const canContinueFromStep1 = !!startTime;

  return (
    <div>
      <div className="mb-10 flex items-center justify-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold",
                i <= step ? "border-chrome bg-chrome/15 text-chrome" : "border-border-dim text-white/30"
              )}
            >
              {i + 1}
            </div>
            <span
              className={cn(
                "hidden font-heading text-xs font-semibold uppercase tracking-wide sm:block",
                i <= step ? "text-white" : "text-white/30"
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && <div className="mx-2 h-px w-6 bg-border-dim sm:w-10" />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div>
          <ServiceSelect services={services} value={serviceId} onChange={setServiceId} />
          <div className="mt-8 flex justify-end">
            <Button disabled={!canContinueFromStep0} onClick={() => setStep(1)}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 1 && (
        <GlassCard className="p-6 sm:p-8">
          <Label htmlFor="date">Pick A Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            min={format(new Date(), "yyyy-MM-dd")}
            onChange={(e) => setDate(e.target.value)}
            className="max-w-xs"
          />
          <div className="mt-6">
            <Label>Available Times</Label>
            <TimeSlotPicker
              slots={slots}
              value={startTime}
              onChange={setStartTime}
              loading={slotsLoading}
              reason={slotsReason}
            />
          </div>
          <div className="mt-8 flex justify-between">
            <Button variant="secondary" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button disabled={!canContinueFromStep1} onClick={() => setStep(2)}>
              Continue
            </Button>
          </div>
        </GlassCard>
      )}

      {step === 2 && (
        <GlassCard className="p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="customerName">Full Name</Label>
              <Input id="customerName" {...register("customerName")} placeholder="Jordan Smith" />
              {errors.customerName && (
                <p className="mt-1 text-xs text-red-400">{errors.customerName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" {...register("phone")} placeholder="(555) 123-4567" />
              {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input id="email" type="email" {...register("email")} placeholder="you@example.com" />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" rows={3} {...register("notes")} placeholder="Anything Scrap should know" />
            </div>
          </div>
          <div className="mt-8 flex justify-between">
            <Button variant="secondary" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={() => setStep(3)}>Review</Button>
          </div>
        </GlassCard>
      )}

      {step === 3 && (
        <GlassCard className="p-6 sm:p-8">
          <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-chrome">
            Review Your Booking
          </h3>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between border-b border-border-dim/60 py-2">
              <dt className="text-white/50">Service</dt>
              <dd className="text-white">{selectedService?.name}</dd>
            </div>
            <div className="flex justify-between border-b border-border-dim/60 py-2">
              <dt className="text-white/50">Date</dt>
              <dd className="text-white">{date}</dd>
            </div>
            <div className="flex justify-between border-b border-border-dim/60 py-2">
              <dt className="text-white/50">Time</dt>
              <dd className="text-white">{startTime}</dd>
            </div>
            <div className="flex justify-between border-b border-border-dim/60 py-2">
              <dt className="text-white/50">Name</dt>
              <dd className="text-white">{getValues("customerName")}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-white/50">Phone</dt>
              <dd className="text-white">{getValues("phone")}</dd>
            </div>
          </dl>

          {submitError && <p className="mt-4 text-sm text-red-400">{submitError}</p>}

          <div className="mt-8 flex justify-between">
            <Button variant="secondary" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button onClick={handleSubmit(onSubmit)} disabled={submitting}>
              {submitting ? "Submitting…" : "Confirm Booking"}
            </Button>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
