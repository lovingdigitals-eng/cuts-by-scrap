import nodemailer from "nodemailer";

export interface NotificationAppointment {
  customerName: string;
  phone: string;
  email?: string | null;
  serviceName: string;
  date: string; // yyyy-MM-dd
  startTime: string; // HH:mm
}

export type NotificationEventType =
  | "BOOKING_RECEIVED"
  | "BOOKING_CONFIRMED"
  | "BOOKING_CANCELLED"
  | "BOOKING_REMINDER";

let transporter: nodemailer.Transporter | null | undefined;

function getTransporter() {
  if (transporter !== undefined) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    transporter = null;
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

function messageFor(event: NotificationEventType, appt: NotificationAppointment) {
  const when = `${appt.date} at ${appt.startTime}`;
  switch (event) {
    case "BOOKING_RECEIVED":
      return {
        customerSubject: "Cuts by Scrap — Appointment Received",
        customerBody: `Hey ${appt.customerName}, your request for ${appt.serviceName} on ${when} has been received. You'll receive confirmation shortly.`,
        adminSubject: `New booking request: ${appt.customerName}`,
        adminBody: `${appt.customerName} (${appt.phone}) requested ${appt.serviceName} on ${when}.`,
      };
    case "BOOKING_CONFIRMED":
      return {
        customerSubject: "Cuts by Scrap — Appointment Confirmed",
        customerBody: `You're confirmed for ${appt.serviceName} on ${when}. See you then!`,
        adminSubject: `Confirmed: ${appt.customerName}`,
        adminBody: `Appointment confirmed for ${appt.customerName} on ${when}.`,
      };
    case "BOOKING_CANCELLED":
      return {
        customerSubject: "Cuts by Scrap — Appointment Cancelled",
        customerBody: `Your appointment for ${appt.serviceName} on ${when} has been cancelled.`,
        adminSubject: `Cancelled: ${appt.customerName}`,
        adminBody: `Appointment for ${appt.customerName} on ${when} was cancelled.`,
      };
    case "BOOKING_REMINDER":
      return {
        customerSubject: "Cuts by Scrap — See you tomorrow",
        customerBody: `Reminder: you're booked for ${appt.serviceName} tomorrow at ${appt.startTime}.`,
        adminSubject: `Reminder sent: ${appt.customerName}`,
        adminBody: `24h reminder sent to ${appt.customerName} for ${when}.`,
      };
  }
}

async function sendEmail(to: string, subject: string, text: string) {
  const t = getTransporter();
  const from = process.env.SMTP_FROM || "Cuts by Scrap <no-reply@cutsbyscrap.com>";

  if (!t) {
    // Netlify's function log only surfaces console.error/warn output, not
    // plain console.log — use warn so the no-op path is actually visible.
    console.warn(`[email:noop] SMTP not configured — to=${to} subject="${subject}"`);
    return;
  }

  try {
    const info = await t.sendMail({ from, to, subject, text });
    console.warn(`[email:sent] to=${to} subject="${subject}" response="${info.response}"`);
  } catch (err) {
    console.error(`[email:error] to=${to} subject="${subject}"`, err);
  }
}

/**
 * SMS channel stub — structured so a real provider (e.g. Twilio) drops in by
 * filling this function body once TWILIO_* env vars are configured.
 */
async function sendSms(to: string, body: string) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    console.log(`[sms:noop] to=${to} body="${body}"`);
    return;
  }
  // Twilio integration point:
  // const twilio = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  // await twilio.messages.create({ to, from: TWILIO_FROM_NUMBER, body });
  console.log(`[sms:not-implemented] to=${to} body="${body}"`);
}

export async function notify(
  event: NotificationEventType,
  appointment: NotificationAppointment
) {
  const msg = messageFor(event, appointment);
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

  const tasks: Promise<void>[] = [];

  if (appointment.email) {
    tasks.push(sendEmail(appointment.email, msg.customerSubject, msg.customerBody));
  }
  tasks.push(sendSms(appointment.phone, msg.customerBody));

  if (adminEmail) {
    tasks.push(sendEmail(adminEmail, msg.adminSubject, msg.adminBody));
  }

  await Promise.allSettled(tasks);
}
