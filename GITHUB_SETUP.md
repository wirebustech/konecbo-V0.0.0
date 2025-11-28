# How to Upload Application to GitHub

This guide will walk you through uploading your Konecbo application to GitHub.

## Prerequisites

- Git installed on your system
- GitHub account created
- Terminal/Command line access

## Step-by-Step Instructions

### Step 1: Verify Git is Initialized

Your repository is already initialized. Verify with:
```bash
git status
```

### Step 2: Check .gitignore

Make sure sensitive files are ignored. Your `.gitignore` should already exclude:
- `.env*` files (environment variables)
- `node_modules/`
- `.next/` (build files)
- Other sensitive files

### Step 3: Add Files to Git

```bash
# Add all files (respecting .gitignore)
git add .

# Or add specific files
git add src/ public/ package.json README.md DEPLOYMENT.md
```

### Step 4: Commit Your Changes

```bash
# Create your first commit
git commit -m "Initial commit: Konecbo web application"

# Or with a more descriptive message
git commit -m "Initial commit: Konecbo research collaboration platform

- Next.js 15 application with waitlist functionality
- Firebase integration for data storage
- Email notifications via Resend
- Deployment configurations for Azure
- Azure App Service deployment configuration included"
```

### Step 5: Create GitHub Repository

**Option A: Via GitHub Website (Recommended)**

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in the details:
   - **Repository name**: `konecbo` (or your preferred name)
   - **Description**: "Research collaboration platform - Konecbo"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

**Option B: Via GitHub CLI**

```bash
# Install GitHub CLI if not installed
# macOS: brew install gh
# Linux: See https://cli.github.com/

# Login to GitHub
gh auth login

# Create repository
gh repo create konecbo --public --source=. --remote=origin --push
```

### Step 6: Add GitHub Remote

After creating the repository on GitHub, you'll see a URL like:
- HTTPS: `https://github.com/your-username/konecbo.git`
- SSH: `git@github.com:your-username/konecbo.git`

```bash
# Add the remote (replace with your actual repository URL)
git remote add origin https://github.com/your-username/konecbo.git

# Or if using SSH
git remote add origin git@github.com:your-username/konecbo.git

# Verify remote was added
git remote -v
```

### Step 7: Push to GitHub

```bash
# Push to GitHub (first time)
git push -u origin main

# For subsequent pushes, you can just use:
git push
```

### Step 8: Verify Upload

1. Go to your GitHub repository page
2. You should see all your files
3. Check that sensitive files (`.env`, `node_modules`) are NOT visible

## Quick Command Summary

```bash
# 1. Add all files
git add .

# 2. Commit
git commit -m "Initial commit: Konecbo web application"

# 3. Add remote (replace with your URL)
git remote add origin https://github.com/your-username/konecbo.git

# 4. Push to GitHub
git push -u origin main
```

## Troubleshooting

### "Remote origin already exists"
```bash
# Remove existing remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/your-username/konecbo.git
```

### "Authentication failed"
- **HTTPS**: Use a Personal Access Token instead of password
  - Go to GitHub → Settings → Developer settings → Personal access tokens
  - Generate new token with `repo` permissions
  - Use token as password when pushing
- **SSH**: Set up SSH keys
  ```bash
  # Generate SSH key
  ssh-keygen -t ed25519 -C "your_email@example.com"
  
  # Add to SSH agent
  eval "$(ssh-agent -s)"
  ssh-add ~/.ssh/id_ed25519
  
  # Copy public key and add to GitHub
  cat ~/.ssh/id_ed25519.pub
  # Then add to GitHub → Settings → SSH and GPG keys
  ```

### "Branch 'main' has no upstream branch"
```bash
# Set upstream branch
git push -u origin main
```

### "Large files" warning
If you have large files, consider:
- Using Git LFS for large assets
- Removing large files from history
- Adding to `.gitignore`

## Best Practices

1. **Never commit sensitive data**:
   - `.env` files
   - API keys
   - Service account keys
   - Passwords

2. **Use meaningful commit messages**:
   ```bash
   git commit -m "Add waitlist form with Firebase integration"
   git commit -m "Fix countdown timer date issue"
   git commit -m "Add deployment configurations for Azure"
   ```

3. **Create branches for features**:
   ```bash
   git checkout -b feature/new-feature
   # Make changes
   git commit -m "Add new feature"
   git push -u origin feature/new-feature
   ```

4. **Keep .gitignore updated**:
   - Always check `.gitignore` before committing
   - Add new sensitive file patterns as needed

## Next Steps After Uploading

1. **Set up GitHub Actions** (CI/CD):
   - Your workflows are already in `.github/workflows/`
   - Configure secrets in GitHub repository settings

2. **Add repository description and topics**:
   - Go to repository → Settings
   - Add description, website URL, topics

3. **Set up branch protection** (for main branch):
   - Go to Settings → Branches
   - Add rule for `main` branch
   - Require pull request reviews

4. **Add collaborators** (if working in a team):
   - Go to Settings → Collaborators
   - Add team members

5. **Enable GitHub Pages** (if needed for documentation):
   - Go to Settings → Pages
   - Select source branch and folder

## Security Checklist

Before pushing, ensure:
- ✅ `.env*` files are in `.gitignore`
- ✅ No API keys in code
- ✅ No passwords in code
- ✅ `node_modules/` is ignored
- ✅ Build artifacts (`.next/`) are ignored
- ✅ Firebase service account keys are NOT committed

## Need Help?

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Help](https://docs.github.com/)
- [GitHub CLI Documentation](https://cli.github.com/manual/)

