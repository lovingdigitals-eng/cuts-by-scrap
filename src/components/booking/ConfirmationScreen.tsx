import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

export function ConfirmationScreen({
  serviceName,
  date,
  startTime,
}: {
  serviceName: string;
  date: string;
  startTime: string;
}) {
  const formattedDate = new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <GlassCard className="mx-auto max-w-lg p-10 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-chrome/40 bg-chrome/10">
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-chrome" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
        </svg>
      </div>
      <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-chrome-gradient">
        Request Received
      </h2>
      <p className="mt-4 text-white/70">
        Your appointment request has been received. You&rsquo;ll receive confirmation shortly.
      </p>
      <div className="mt-6 rounded-xl border border-border-dim bg-white/5 p-4 text-sm text-white/70">
        <p className="font-heading font-semibold uppercase tracking-wide text-white">{serviceName}</p>
        <p className="mt-1">
          {formattedDate} at {startTime}
        </p>
      </div>
      <div className="mt-8">
        <Button href="/" variant="secondary">
          Back To Home
        </Button>
      </div>
    </GlassCard>
  );
}
