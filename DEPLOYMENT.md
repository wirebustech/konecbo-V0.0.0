# Deployment Guide - Konecbo Web Application

This guide provides step-by-step instructions for deploying the Konecbo Next.js application to Azure App Service.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Azure App Service](#azure-app-service)
3. [Environment Variables](#environment-variables)
4. [Post-Deployment](#post-deployment)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ Node.js 20+ installed locally
- ✅ Git repository set up
- ✅ Firebase project configured (see `docs/WAITLIST_SETUP.md`)
- ✅ Environment variables prepared (see `.env.example`)
- ✅ Azure account with active subscription

### Required Environment Variables

Create a `.env.production` file with:

```bash
# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
# OR
FIREBASE_PROJECT_ID=your-project-id

# Email Configuration (Optional)
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxxxxxx
FROM_EMAIL=Konecbo <noreply@yourdomain.com>
ADMIN_EMAIL=admin@yourdomain.com

# Next.js
NODE_ENV=production
PORT=3000
```

---

## Azure App Service

Azure App Service is the easiest way to deploy Next.js applications on Azure.

### Option 1: Deploy via Azure CLI

1. **Install Azure CLI**
   ```bash
   # macOS
   brew install azure-cli
   
   # Linux
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
   
   # Windows
   # Download from https://aka.ms/installazurecliwindows
   ```

2. **Login to Azure**
   ```bash
   az login
   ```

3. **Create a Resource Group**
   ```bash
   az group create --name konecbo-rg --location eastus
   ```

4. **Create App Service Plan**
   ```bash
   az appservice plan create \
     --name konecbo-plan \
     --resource-group konecbo-rg \
     --sku B1 \
     --is-linux
   ```

5. **Create Web App**
   ```bash
   az webapp create \
     --resource-group konecbo-rg \
     --plan konecbo-plan \
     --name konecbo-app \
     --runtime "NODE:20-lts"
   ```

6. **Configure Environment Variables**
   ```bash
   az webapp config appsettings set \
     --resource-group konecbo-rg \
     --name konecbo-app \
     --settings \
       FIREBASE_SERVICE_ACCOUNT_KEY="$(cat .env.production | grep FIREBASE_SERVICE_ACCOUNT_KEY | cut -d '=' -f2)" \
       EMAIL_PROVIDER="resend" \
       RESEND_API_KEY="your-resend-key" \
       NODE_ENV="production"
   ```

7. **Configure Build Settings**
   ```bash
   az webapp config set \
     --resource-group konecbo-rg \
     --name konecbo-app \
     --startup-file "npm run start"
   ```

8. **Deploy via Git**
   ```bash
   # Add Azure remote
   az webapp deployment source config-local-git \
     --resource-group konecbo-rg \
     --name konecbo-app
   
   # Get deployment URL
   DEPLOY_URL=$(az webapp deployment source show \
     --resource-group konecbo-rg \
     --name konecbo-app \
     --query url -o tsv)
   
   # Add remote and push
   git remote add azure $DEPLOY_URL
   git push azure main
   ```

### Option 2: Deploy via GitHub Actions

1. **Create `.github/workflows/azure-deploy.yml`** (see provided file)

2. **Add Azure Secrets to GitHub**
   - Go to GitHub Repository → Settings → Secrets
   - Add `AZURE_WEBAPP_NAME`, `AZURE_RESOURCE_GROUP`, `AZURE_CREDENTIALS`

3. **Push to trigger deployment**
   ```bash
   git push origin main
   ```

### Option 3: Deploy via Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new Web App
3. Select Node.js 20 LTS runtime stack
4. Configure deployment from GitHub/DevOps
5. Add application settings (environment variables)
6. Deploy

---

## Environment Variables

Azure App Service requires the following environment variables. See `.env.example` for reference.

### Critical Variables

- `FIREBASE_SERVICE_ACCOUNT_KEY` - Firebase Admin SDK credentials
- `FIREBASE_PROJECT_ID` - Alternative to service account key
- `NODE_ENV=production` - Required for production builds

### Optional Variables

- `EMAIL_PROVIDER` - Email service provider (resend, smtp, none)
- `RESEND_API_KEY` - Resend API key
- `ADMIN_EMAIL` - Admin notification email
- `PORT` - Server port (default: 3000)

---

## Post-Deployment

### 1. Verify Application

1. Visit your application URL
2. Test waitlist form submission
3. Check Firebase Console for new entries
4. Verify email notifications (if configured)

### 2. Monitor Application

- Use Azure Application Insights for monitoring and logging
- View logs in Azure Portal → App Service → Log stream
- Set up alerts in Application Insights

### 3. Setup CI/CD

See `.github/workflows/` for example CI/CD pipelines.

### 4. Configure Custom Domain

1. Go to Azure Portal → App Service → Custom domains
2. Add your domain
3. Configure DNS records as instructed
4. Enable SSL/TLS certificate (free certificates available)

### 5. Enable Auto-Scaling

1. Go to Azure Portal → App Service → Scale out (App Service plan)
2. Configure scale-out rules based on:
   - CPU percentage
   - Memory percentage
   - HTTP queue length
   - Custom metrics
3. Set minimum and maximum instance counts

---

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (requires 20+)
   - Verify all dependencies are installed
   - Check build logs

2. **Environment Variables Not Loading**
   - Verify variables are set correctly
   - Check variable names match exactly
   - Restart application after setting variables

3. **Firebase Connection Issues**
   - Verify service account key is valid
   - Check Firestore security rules
   - Ensure Firebase project is active

4. **Port Issues**
   - Verify PORT environment variable
   - Check firewall/security group rules
   - Ensure reverse proxy is configured correctly

### Getting Help

- Check application logs
- Review platform-specific documentation
- See `docs/WAITLIST_SETUP.md` for Firebase setup

---

## Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Azure App Service Documentation](https://docs.microsoft.com/azure/app-service/)
- [Azure App Service for Node.js](https://docs.microsoft.com/azure/app-service/quickstart-nodejs)
- [Azure CLI Documentation](https://docs.microsoft.com/cli/azure/)

