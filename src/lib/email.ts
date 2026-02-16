import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendWaitlistEmail(email: string, position: number) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[EMAIL] SMTP not configured — skipping email to ${email}`)
    return
  }

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a08;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a08;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Logo -->
        <tr><td style="padding-bottom:32px;text-align:center;">
          <img src="https://hivemind.inc/logo.jpeg" alt="Hivemind" width="48" height="48" style="border-radius:50%;display:inline-block;" />
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#141310;border:1px solid rgba(212,175,55,0.08);border-radius:16px;padding:40px 36px;">

          <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#f0ece4;letter-spacing:-0.03em;line-height:1.2;">
            You&rsquo;re on the list.
          </h1>
          <p style="margin:0 0 28px;font-size:15px;color:#b8b0a0;line-height:1.7;">
            Welcome to the Hivemind waitlist. We&rsquo;ll email you when we launch with your exclusive early bird discount.
          </p>

          <!-- Position badge -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr><td style="background:#0a0a08;border:1px solid rgba(212,175,55,0.08);border-radius:12px;padding:20px;text-align:center;">
              <div style="font-size:9px;font-weight:700;letter-spacing:2px;color:#7a7468;margin-bottom:6px;font-family:'Courier New',monospace;">YOUR POSITION</div>
              <div style="font-size:32px;font-weight:800;color:#d4af37;letter-spacing:-1px;font-family:'Courier New',monospace;">#${position}</div>
            </td></tr>
          </table>

          <!-- Perks -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr><td style="padding:10px 0;border-bottom:1px solid rgba(212,175,55,0.06);">
              <span style="color:#d4af37;font-size:14px;">&#10003;</span>
              <span style="color:#f0ece4;font-size:14px;font-weight:600;margin-left:10px;">40% off Pro — locked in forever</span>
            </td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid rgba(212,175,55,0.06);">
              <span style="color:#d4af37;font-size:14px;">&#10003;</span>
              <span style="color:#f0ece4;font-size:14px;font-weight:600;margin-left:10px;">First access to every feature</span>
            </td></tr>
            <tr><td style="padding:10px 0;">
              <span style="color:#d4af37;font-size:14px;">&#10003;</span>
              <span style="color:#f0ece4;font-size:14px;font-weight:600;margin-left:10px;">Founding member status</span>
            </td></tr>
          </table>

          <p style="margin:0;font-size:13px;color:#7a7468;line-height:1.6;">
            Hivemind maps the hidden relationships between your holdings and the world&rsquo;s financial events. One daily brief. Every connection that matters.
          </p>

        </td></tr>

        <!-- Footer -->
        <tr><td style="padding-top:24px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#7a7468;">
            &copy; 2026 Hivemind. Not investment advice.<br>
            You received this because you joined the waitlist.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  await transporter.sendMail({
    from,
    to: email,
    subject: `You're #${position} on the Hivemind waitlist`,
    html,
  })

  console.log(`[EMAIL] Confirmation sent to ${email} (position #${position})`)
}
