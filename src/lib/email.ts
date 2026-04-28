import nodemailer from "nodemailer";

const configured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const transporter = configured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_PORT === "465",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;

export async function enviarEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!transporter) {
    console.warn("[email] SMTP não configurado — e-mail não enviado para:", to);
    return false;
  }
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    return true;
  } catch (err) {
    console.error("[email] Erro ao enviar:", err);
    return false;
  }
}
