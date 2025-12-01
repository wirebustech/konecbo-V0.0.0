'use server';

import { z } from 'zod';
import { sendWaitlistNotification } from '@/lib/email';
import { db } from '@/lib/firebase-admin';

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
    const waitlistEntry = {
      name,
      email,
      researchInterests,
      createdAt: new Date(),
    };

    // 2. Save to Firestore if available (optional)
    if (db) {
      try {
        await db.collection('waitlist').add(waitlistEntry);
        console.log('Waitlist entry saved to Firebase');
      } catch (firebaseError) {
        console.warn('Firebase save failed, continuing with email only:', firebaseError);
        // Continue even if Firebase fails
      }
    } else {
      console.log('Firebase not configured - sending email only');
    }

    // 3. Send email notification (required)
    try {
      await sendWaitlistNotification(waitlistEntry);
      console.log('Email notification sent successfully');
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      
      // Email is required - always return error if it fails
      const errorMessage = emailError instanceof Error ? emailError.message : String(emailError);
      
      // Provide specific error messages based on the error
      if (errorMessage.includes('not configured') || errorMessage.includes('environment variables')) {
        return {
          message: 'Email service is not properly configured. Please contact support.',
          status: 'error',
          errors: null,
        };
      }
      
      if (errorMessage.includes('Azure') || errorMessage.includes('Communication Service')) {
        return {
          message: 'Failed to send email notification. Please check Azure Communication Service configuration.',
          status: 'error',
          errors: null,
        };
      }
      
      return {
        message: 'Failed to send email notification. Please try again later or contact support.',
        status: 'error',
        errors: null,
      };
    }

    // 4. Return success notification
    return {
      message: "Thank you for joining the waitlist! We'll be in touch soon.",
      status: 'success',
      errors: null,
    };
  } catch (error) {
    console.error('Error saving waitlist entry:', error);
    
    // Provide more specific error messages
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes('Firebase Admin initialization failed') || 
        errorMessage.includes('Missing FIREBASE_SERVICE_ACCOUNT_KEY')) {
      return {
        message: 'Firebase configuration error. Please check your environment variables.',
        status: 'error',
        errors: null,
      };
    }
    
    if (errorMessage.includes('PERMISSION_DENIED') || errorMessage.includes('permission')) {
      return {
        message: 'Database permission error. Please check Firestore security rules.',
        status: 'error',
        errors: null,
      };
    }
    
    if (errorMessage.includes('not found') || errorMessage.includes('does not exist')) {
      return {
        message: 'Firestore database not found. Please create it in Firebase Console.',
        status: 'error',
        errors: null,
      };
    }
    
    // 5. Return error notification
    return {
      message: 'Something went wrong. Please try again later.',
      status: 'error',
      errors: null,
    };
  }
}

/**
 * Server Action to get the number of waitlist entries.
 */
export async function getWaitlistCount(): Promise<number> {
  if (!db) {
    return 0; // Return 0 if Firebase is not configured
  }
  
  try {
    const snapshot = await db.collection('waitlist').get();
    return snapshot.size;
  } catch (error) {
    console.error('Error fetching waitlist count:', error);
    return 0; // Return 0 on error
  }
}
