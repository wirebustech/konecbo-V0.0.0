'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase-admin';
import { sendWaitlistNotification } from '@/lib/email';

const WaitlistFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  researchInterests: z.string().min(1, { message: 'Research interests are required' }),
});

export interface WaitlistState {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: {
    name?: string[];
    email?: string[];
    researchInterests?: string[];
  } | null;
}


/**
 * Server Action to handle waitlist form submissions
 * - Validates input
 * - Saves to Firebase
 * - Sends email notification
 */
export async function joinWaitlist(
  prevState: WaitlistState,
  formData: FormData
): Promise<WaitlistState> {
    const rawData = Object.fromEntries(formData.entries());
    const parsed = WaitlistFormSchema.safeParse(rawData);

    if (!parsed.success) {
      console.log('Validation failed', parsed.error.flatten().fieldErrors);
      return {
        message: 'Invalid form data. Please check your entries.',
        status: 'error',
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const { name, email, researchInterests } = parsed.data;

  try {
    // 2. Save to Firestore (backend file)
    const waitlistEntry = {
      name,
      email,
      researchInterests,
      createdAt: new Date(),
    };

    await db.collection('waitlist').add(waitlistEntry);
    console.log('Waitlist entry saved to Firebase');

    // 3. Send email notification (non-blocking)
    sendWaitlistNotification(waitlistEntry).catch((error) => {
      console.error('Failed to send email notification:', error);
      // Don't fail the request if email fails
    });

    // 4. Return success notification
    return {
      message: "Thank you for joining the waitlist! We'll be in touch soon.",
      status: 'success',
      errors: null,
    };
  } catch (error) {
    console.error('Error saving waitlist entry:', error);
    // 5. Return error notification
    return {
      message: 'Something went wrong. Please try again later.',
      status: 'error',
      errors: null,
    };
  }
}
