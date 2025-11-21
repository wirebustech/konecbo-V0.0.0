# Waitlist Backend Setup Guide

This guide will help you set up the secure backend integration for the waitlist form.

## Overview

The waitlist form is now integrated with:
- **Firebase Firestore** - For secure data storage
- **Email Notifications** - For admin notifications (optional)
- **Server Actions** - For secure server-side processing

## Prerequisites

1. A Firebase project (create one at https://console.firebase.google.com)
2. (Optional) An email service account (Resend recommended)

## Step 1: Firebase Setup

### Option A: Using Service Account Key (Recommended for Development)

1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate New Private Key"
3. Download the JSON file
4. Copy the entire JSON content
5. Add it to your `.env` file as a single-line string:

```bash
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...",...}'
```

**Important:** Keep this key secure and never commit it to version control!

### Option B: Using Application Default Credentials (Recommended for Production)

If deploying to platforms like Vercel, Google Cloud, etc., you can use Application Default Credentials:

```bash
FIREBASE_PROJECT_ID=your-firebase-project-id
```

The platform will automatically provide credentials.

## Step 2: Firestore Database Setup

1. Go to Firebase Console > Firestore Database
2. Click "Create Database"
3. Start in **production mode** (or test mode if you want open access for testing)
4. Choose a location for your database
5. The `waitlist` collection will be created automatically when the first entry is submitted

### Firestore Security Rules (Recommended)

Add these security rules to prevent unauthorized access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only allow server-side writes (via Firebase Admin SDK)
    match /waitlist/{document=**} {
      allow read: if request.auth != null; // Only authenticated users can read
      allow write: if false; // No client-side writes allowed
    }
  }
}
```

## Step 3: Email Notifications Setup (Optional)

### Option A: Using Resend (Recommended)

1. Sign up at https://resend.com
2. Get your API key from the dashboard
3. Add to `.env`:

```bash
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxxxxxx
FROM_EMAIL=Konecbo <noreply@yourdomain.com>
ADMIN_EMAIL=admin@yourdomain.com
```

### Option B: Using SMTP

1. Install nodemailer: `npm install nodemailer`
2. Update `src/lib/email.ts` to implement SMTP sending
3. Add to `.env`:

```bash
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ADMIN_EMAIL=admin@yourdomain.com
```

### Option C: No Email (Development)

```bash
EMAIL_PROVIDER=none
```

## Step 4: Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your configuration values

3. **Never commit `.env` to version control** (it's already in `.gitignore`)

## Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Fill out the waitlist form on your site

3. Check Firebase Console > Firestore Database to see the entry

4. If email is configured, check your admin email inbox

## Data Structure

Each waitlist entry is stored in Firestore with this structure:

```typescript
{
  name: string;
  email: string; // stored in lowercase
  researchInterests: string;
  createdAt: Date;
  status: 'pending';
}
```

## Security Features

✅ **Server-side validation** - All data is validated using Zod schema  
✅ **Duplicate prevention** - Email addresses are checked before saving  
✅ **Secure storage** - Data stored in Firestore with proper security rules  
✅ **No client-side database access** - All operations go through server actions  
✅ **Email sanitization** - HTML is escaped to prevent XSS attacks  

## Troubleshooting

### "Firebase Admin initialization failed"
- Check that `FIREBASE_SERVICE_ACCOUNT_KEY` or `FIREBASE_PROJECT_ID` is set
- Verify the service account key JSON is valid
- Ensure the service account has Firestore permissions

### "Email already registered"
- This is expected behavior - prevents duplicate entries
- The email check is case-insensitive

### Email notifications not working
- Check `EMAIL_PROVIDER` is set correctly
- Verify API keys/credentials are correct
- Check server logs for error messages
- Email failures don't block form submission

### Firestore permission errors
- Check your Firestore security rules
- Ensure the service account has proper permissions
- Verify the database is created and accessible

## Next Steps

- Set up Firestore indexes if you plan to query by fields other than email
- Configure email templates for better notifications
- Add analytics to track waitlist growth
- Set up automated welcome emails to users

