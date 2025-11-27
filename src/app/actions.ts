'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { sendWaitlistNotification } from '@/lib/email';

const WaitlistFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  researchInterests: z.string(),
});

export interface WaitlistState {
  message: string;
  status: 'success' | 'error' | 'idle';
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
  try {
    const rawData = Object.fromEntries(formData.entries());

    // 1. Explicit Validation
    if (!rawData.name || !rawData.email || !rawData.researchInterests) {
        return {
            message: 'Please fill out all required fields.',
            status: 'error',
        };
    }

    const parsed = WaitlistFormSchema.safeParse(rawData);

    if (!parsed.success) {
      console.log('Validation failed', parsed.error.flatten().fieldErrors);
      return {
        message: 'Invalid form data. Please check your entries.',
        status: 'error',
      };
    }

    const { name, email, researchInterests } = parsed.data;

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
    };
  } catch (error) {
    console.error('Error saving waitlist entry:', error);
    // 5. Return error notification
    return {
      message: 'Something went wrong. Please try again later.',
      status: 'error',
    };
  }
}
