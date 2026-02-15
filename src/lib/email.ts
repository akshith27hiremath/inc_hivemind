// Phase 2: Email notifications via Resend
// Uncomment and configure when Resend API key is available

// import { Resend } from 'resend'
// const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWaitlistNotification(email: string) {
  // Phase 2: Replace with Resend implementation
  console.log(`[WAITLIST NOTIFICATION] New signup: ${email}`)
}
