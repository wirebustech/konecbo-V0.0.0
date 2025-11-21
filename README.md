# Konecbo - Research Collaboration Platform

Konecbo is an innovative platform dedicated to fostering collaboration among researchers. This is a Next.js application with a waitlist feature for early access.

## Features

- 🚀 Modern Next.js 15 with React 18
- 🔥 Firebase integration for waitlist management
- 📧 Email notifications via Resend
- ⏱️ Countdown timer for launch
- 🎨 Beautiful UI with Tailwind CSS and shadcn/ui
- 🔒 Secure server-side form processing
- 📱 Fully responsive design

## Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- Firebase project (for waitlist functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd konecbo-v0.0.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase credentials
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:9002
   ```

## Documentation

- **[Deployment Guide](./DEPLOYMENT.md)** - Deploy to Azure App Service, AKS, AWS, or EKS
- **[Waitlist Setup](./docs/WAITLIST_SETUP.md)** - Configure Firebase and email notifications

## Available Scripts

- `npm run dev` - Start development server (port 9002)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

```
konecbo-v0.0.0/
├── src/
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   │   ├── konecbo/     # Main application components
│   │   └── ui/          # shadcn/ui components
│   ├── lib/             # Utilities and configurations
│   └── hooks/           # Custom React hooks
├── public/              # Static assets
├── k8s/                 # Kubernetes manifests
├── .github/workflows/   # CI/CD pipelines
└── docs/                # Documentation

```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to:

- ☁️ Azure App Service
- ☸️ Azure Kubernetes Service (AKS)
- 🚀 AWS Elastic Beanstalk / EC2
- ☸️ AWS Elastic Kubernetes Service (EKS)

## Environment Variables

Required environment variables (see `.env.example`):

- `FIREBASE_SERVICE_ACCOUNT_KEY` - Firebase Admin SDK credentials
- `FIREBASE_PROJECT_ID` - Alternative Firebase configuration
- `EMAIL_PROVIDER` - Email service (resend, smtp, none)
- `RESEND_API_KEY` - Resend API key (if using Resend)
- `ADMIN_EMAIL` - Admin notification email

## Tech Stack

- **Framework**: Next.js 15.3.3
- **UI Library**: React 18.3.1
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (Radix UI)
- **Database**: Firebase Firestore
- **Email**: Resend
- **Validation**: Zod
- **Forms**: React Hook Form

## License

[Add your license here]

## Support

For issues and questions, please open an issue in the repository.
