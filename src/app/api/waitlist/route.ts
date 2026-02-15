import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getDb } from '@/db'
import { waitlist } from '@/db/schema'
import { eq } from 'drizzle-orm'

const waitlistSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = waitlistSchema.parse(body)
    const normalizedEmail = email.toLowerCase()

    const db = getDb()

    const existing = await db
      .select()
      .from(waitlist)
      .where(eq(waitlist.email, normalizedEmail))
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json(
        { message: 'You are already on the waitlist!' },
        { status: 200 }
      )
    }

    const [entry] = await db
      .insert(waitlist)
      .values({ email: normalizedEmail })
      .returning()

    console.log(`[WAITLIST] New signup: ${normalizedEmail} (id: ${entry.id})`)

    return NextResponse.json(
      { message: 'Welcome to the waitlist!', id: entry.id },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Waitlist error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
