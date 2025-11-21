'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase-admin';
import { sendWaitlistNotification } from '@/lib/email';

const waitlistSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  researchInterests: z
    .string()
    .min(10, { message: 'Please tell us a bit more.' })
    .max(500, { message: 'Please keep your interests under 500 characters.' }),
});

export type WaitlistState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: {
    name?: string[];
    email?: string[];
    researchInterests?: string[];
  };
};

export async function registerToWaitlist(
  prevState: WaitlistState,
  formData: FormData
): Promise<WaitlistState> {
  const validatedFields = waitlistSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    researchInterests: formData.get('researchInterests'),
  });

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return {
      message: 'Please correct the errors below.',
      status: 'error',
      errors: errors,
    };
  }

  const { name, email, researchInterests } = validatedFields.data;

  try {
    // Check if email already exists in waitlist
    const existingEntry = await db
      .collection('waitlist')
      .where('email', '==', email.toLowerCase())
      .limit(1)
      .get();

    if (!existingEntry.empty) {
      return {
        message: 'This email is already registered on our waitlist!',
        status: 'error',
      };
    }

    // Save to Firestore
    const waitlistEntry = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      researchInterests: researchInterests.trim(),
      createdAt: new Date(),
      status: 'pending',
    };

    await db.collection('waitlist').add(waitlistEntry);

    // Send email notification (non-blocking)
    sendWaitlistNotification(waitlistEntry).catch((error) => {
      console.error('Failed to send email notification:', error);
      // Don't fail the request if email fails
    });

    return {
      message: "Thank you for joining the waitlist! We'll be in touch soon.",
      status: 'success',
    };
  } catch (error) {
    console.error('Error saving waitlist entry:', error);
    return {
      message: 'Something went wrong. Please try again later.',
      status: 'error',
    };
  }
}
