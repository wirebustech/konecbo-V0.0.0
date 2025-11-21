# Deployment Guide - Konecbo Web Application

This guide provides step-by-step instructions for deploying the Konecbo Next.js application to various cloud platforms.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Azure App Service](#azure-app-service)
3. [Azure Kubernetes Service (AKS)](#azure-kubernetes-service-aks)
4. [AWS (EC2/Elastic Beanstalk)](#aws-ec2elastic-beanstalk)
5. [AWS Elastic Kubernetes Service (EKS)](#aws-elastic-kubernetes-service-eks)
6. [Environment Variables](#environment-variables)
7. [Post-Deployment](#post-deployment)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ Node.js 20+ installed locally
- ✅ Git repository set up
- ✅ Firebase project configured (see `docs/WAITLIST_SETUP.md`)
- ✅ Environment variables prepared (see `.env.example`)
- ✅ Docker installed (for containerized deployments)

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

## Azure Kubernetes Service (AKS)

### Prerequisites

- Azure CLI installed
- kubectl installed
- Docker installed

### Step 1: Create AKS Cluster

```bash
# Login to Azure
az login

# Create resource group
az group create --name konecbo-aks-rg --location eastus

# Create AKS cluster
az aks create \
  --resource-group konecbo-aks-rg \
  --name konecbo-aks \
  --node-count 2 \
  --enable-managed-identity \
  --generate-ssh-keys

# Get credentials
az aks get-credentials --resource-group konecbo-aks-rg --name konecbo-aks
```

### Step 2: Build and Push Docker Image

```bash
# Login to Azure Container Registry (or Docker Hub)
az acr create --resource-group konecbo-aks-rg --name konecboacr --sku Basic
az acr login --name konecboacr

# Build Docker image
docker build -t konecboacr.azurecr.io/konecbo:latest .

# Push to registry
docker push konecboacr.azurecr.io/konecbo:latest
```

### Step 3: Create Kubernetes Secrets

```bash
# Create secret for environment variables
kubectl create secret generic konecbo-secrets \
  --from-literal=FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}' \
  --from-literal=RESEND_API_KEY='your-key' \
  --from-literal=EMAIL_PROVIDER='resend'
```

### Step 4: Deploy to AKS

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

# Check status
kubectl get pods
kubectl get services
```

### Step 5: Configure Ingress

```bash
# Install NGINX ingress controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# Get external IP
kubectl get service ingress-nginx-controller --namespace=ingress-nginx
```

---

## AWS (EC2/Elastic Beanstalk)

### Option 1: AWS Elastic Beanstalk (Recommended)

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize Elastic Beanstalk**
   ```bash
   eb init -p "Node.js 20 running on 64bit Amazon Linux 2023" konecbo-app
   ```

3. **Create Environment**
   ```bash
   eb create konecbo-prod
   ```

4. **Set Environment Variables**
   ```bash
   eb setenv \
     FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}' \
     EMAIL_PROVIDER=resend \
     RESEND_API_KEY=your-key \
     NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   eb deploy
   ```

6. **Open Application**
   ```bash
   eb open
   ```

### Option 2: EC2 Instance

1. **Launch EC2 Instance**
   - Choose Amazon Linux 2023 AMI
   - Instance type: t3.medium or larger
   - Configure security group (open ports 22, 80, 443, 3000)
   - Launch instance

2. **Connect to Instance**
   ```bash
   ssh -i your-key.pem ec2-user@your-instance-ip
   ```

3. **Install Dependencies**
   ```bash
   # Update system
   sudo yum update -y
   
   # Install Node.js 20
   curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
   sudo yum install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Git
   sudo yum install -y git
   ```

4. **Clone and Setup Application**
   ```bash
   # Clone repository
   git clone https://github.com/your-username/konecbo.git
   cd konecbo
   
   # Install dependencies
   npm install
   
   # Create .env file
   nano .env.production
   # Paste your environment variables
   
   # Build application
   npm run build
   ```

5. **Run with PM2**
   ```bash
   # Start application
   pm2 start npm --name "konecbo" -- start
   
   # Save PM2 configuration
   pm2 save
   
   # Setup PM2 to start on boot
   pm2 startup
   ```

6. **Configure Nginx (Reverse Proxy)**
   ```bash
   # Install Nginx
   sudo yum install -y nginx
   
   # Configure Nginx
   sudo nano /etc/nginx/conf.d/konecbo.conf
   ```
   
   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   ```bash
   # Start Nginx
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

7. **Setup SSL with Let's Encrypt**
   ```bash
   sudo yum install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## AWS Elastic Kubernetes Service (EKS)

### Prerequisites

- AWS CLI installed and configured
- kubectl installed
- eksctl installed (`brew install eksctl` or see [docs](https://eksctl.io/))

### Step 1: Create EKS Cluster

```bash
# Create cluster with eksctl
eksctl create cluster \
  --name konecbo-cluster \
  --region us-east-1 \
  --node-type t3.medium \
  --nodes 2 \
  --nodes-min 1 \
  --nodes-max 4

# Or use AWS CLI
aws eks create-cluster \
  --name konecbo-cluster \
  --role-arn arn:aws:iam::ACCOUNT_ID:role/eks-service-role \
  --resources-vpc-config subnetIds=subnet-xxx,securityGroupIds=sg-xxx
```

### Step 2: Configure kubectl

```bash
aws eks update-kubeconfig --name konecbo-cluster --region us-east-1
```

### Step 3: Build and Push Docker Image

```bash
# Create ECR repository
aws ecr create-repository --repository-name konecbo --region us-east-1

# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build and tag image
docker build -t konecbo:latest .
docker tag konecbo:latest ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/konecbo:latest

# Push image
docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/konecbo:latest
```

### Step 4: Create Kubernetes Secrets

```bash
kubectl create secret generic konecbo-secrets \
  --from-literal=FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}' \
  --from-literal=RESEND_API_KEY='your-key' \
  --from-literal=EMAIL_PROVIDER='resend'
```

### Step 5: Deploy Application

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

# Check deployment
kubectl get pods
kubectl get services
```

### Step 6: Setup Load Balancer

```bash
# Install AWS Load Balancer Controller
kubectl apply -k "https://github.com/aws/eks-charts/stable/aws-load-balancer-controller/crds?ref=master"

# Create IAM service account
eksctl create iamserviceaccount \
  --cluster=konecbo-cluster \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --attach-policy-arn=arn:aws:iam::ACCOUNT_ID:policy/AWSLoadBalancerControllerIAMPolicy \
  --override-existing-serviceaccounts \
  --approve
```

---

## Environment Variables

All platforms require the same environment variables. See `.env.example` for reference.

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

- **Azure**: Use Application Insights
- **AWS**: Use CloudWatch
- **Kubernetes**: Use Prometheus/Grafana

### 3. Setup CI/CD

See `.github/workflows/` for example CI/CD pipelines.

### 4. Configure Custom Domain

- **Azure**: Configure custom domain in App Service
- **AWS**: Use Route 53 or configure in Elastic Beanstalk
- **Kubernetes**: Configure ingress with cert-manager for SSL

### 5. Enable Auto-Scaling

- **Azure App Service**: Configure scale-out rules
- **AKS/EKS**: Configure Horizontal Pod Autoscaler (HPA)

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
- [Azure App Service Docs](https://docs.microsoft.com/azure/app-service/)
- [AWS Elastic Beanstalk Docs](https://docs.aws.amazon.com/elasticbeanstalk/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)

