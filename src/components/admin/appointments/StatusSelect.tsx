import { Select } from "@/components/ui/Input";
import { APPOINTMENT_STATUSES } from "@/lib/validation";

export function StatusSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (status: string) => void;
}) {
  return (
    <Select value={value} onChange={(e) => onChange(e.target.value)} className="!py-2 text-xs">
      {APPOINTMENT_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s.replace("_", " ")}
        </option>
      ))}
    </Select>
  );
}
