export interface AdminAppointment {
  id: string;
  serviceId: string;
  service: { id: string; name: string; price: number; duration: number };
  customerName: string;
  phone: string;
  email?: string | null;
  notes?: string | null;
  date: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  createdAt: string;
}
