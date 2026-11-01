import "server-only";
import { siteConfig } from "@/config/site.config";

/**
 * E-mails do app (Resend). Sem RESEND_API_KEY, em desenvolvimento, o e-mail só é mostrado no terminal.
 * Assinatura: "Equipe Receitinhas da Rô".
 */
export function emailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

export function appBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || siteConfig.siteUrl).replace(/\/$/, "");
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function layout(title: string, bodyHtml: string): string {
  return `<!doctype html><html lang="pt-BR"><body style="margin:0;background:#FFF8EE;font-family:Arial,Helvetica,sans-serif;color:#2B1A14">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFF8EE;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:20px;overflow:hidden">
<tr><td style="background:#0A2B20;padding:22px 28px;color:#FFF3E0;font-family:Georgia,serif;font-size:22px">Receitinhas <span style="color:#D4A24C;font-style:italic">da Rô</span></td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 12px;font-family:Georgia,serif;font-weight:normal;font-size:26px;line-height:1.2;color:#2B1A14">${esc(title)}</h1>
${bodyHtml}
<p style="margin:28px 0 0;font-size:14px;color:#76604F">Com carinho,<br>Equipe Receitinhas da Rô</p>
</td></tr></table>
<p style="font-size:12px;color:#76604F;margin:16px 0 0">Dúvidas? Responda este e-mail ou escreva para ${esc(siteConfig.brand.supportEmail)}.</p>
</td></tr></table></body></html>`;
}

function codeBlock(code: string): string {
  return `<p style="margin:20px 0;text-align:center"><span style="display:inline-block;background:#FFF8EE;border:2px dashed #D4A24C;border-radius:14px;padding:14px 22px;font-size:34px;letter-spacing:10px;font-weight:bold;color:#0F3D2E">${esc(code)}</span></p>`;
}

function button(href: string, label: string): string {
  return `<p style="margin:22px 0;text-align:center"><a href="${esc(href)}" style="display:inline-block;background:#C8102E;color:#ffffff;text-decoration:none;font-weight:bold;padding:15px 26px;border-radius:999px">${esc(label)}</a></p>`;
}

export interface OutgoingEmail {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export function activationEmail(to: string, code: string, name?: string | null): OutgoingEmail {
  const link = `${appBaseUrl()}/app/ativar?email=${encodeURIComponent(to)}`;
  const hello = name ? `Oi, ${name.split(" ")[0]}!` : "Oi!";
  return {
    to,
    subject: `Seu acesso ao Especial de Natal da Rô · código ${code}`,
    html: layout(
      "Seu Especial de Natal chegou 🎄",
      `<p style="font-size:16px;line-height:1.6">${esc(hello)} Que alegria ter você aqui. Para liberar o app, use o código abaixo e crie a sua senha:</p>
${codeBlock(code)}
${button(link, "ATIVAR MEU ACESSO")}
<p style="font-size:14px;line-height:1.6;color:#5C4438">O código vale por 7 dias. Se ele expirar, é só pedir outro na tela de ativação. Dica: depois de entrar, adicione o app à tela inicial do celular.</p>`,
    ),
    text: `${hello} Seu código de ativação do Especial de Natal da Rô: ${code}\nAtive em: ${link}\nO código vale por 7 dias.\n\nEquipe Receitinhas da Rô`,
  };
}

export function requestCodeEmail(to: string, code: string, purpose: "activate" | "reset"): OutgoingEmail {
  const title = purpose === "reset" ? "Seu código para criar uma nova senha" : "Seu código de ativação";
  return {
    to,
    subject: `${code} é o seu código · Receitinhas da Rô`,
    html: layout(
      title,
      `<p style="font-size:16px;line-height:1.6">Use este código no app. Ele vale por 30 minutos:</p>${codeBlock(code)}
<p style="font-size:14px;line-height:1.6;color:#5C4438">Se não foi você que pediu, pode ignorar este e-mail com tranquilidade.</p>`,
    ),
    text: `${title}: ${code}\nO código vale por 30 minutos. Se não foi você, ignore este e-mail.\n\nEquipe Receitinhas da Rô`,
  };
}

/** Envia o e-mail. Retorna false se não conseguiu (o fluxo continua; a pessoa pode pedir de novo). */
export async function sendEmail(msg: OutgoingEmail): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info(`[email:dev] para=${msg.to} assunto="${msg.subject}"\n${msg.text}\n`);
    return process.env.NODE_ENV !== "production";
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "Equipe Receitinhas da Rô <onboarding@resend.dev>",
        to: [msg.to],
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
        reply_to: siteConfig.brand.supportEmail,
      }),
    });
    if (!res.ok) console.error("[email] Resend", res.status, await res.text());
    return res.ok;
  } catch (e) {
    console.error("[email] falha ao enviar", e);
    return false;
  }
}
