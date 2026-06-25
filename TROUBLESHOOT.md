# TROUBLESHOOTING.md

# Troubleshooting Guide

This document provides solutions to common setup, installation, build, and runtime issues encountered while working with WiseMindOS.

---

## Table of Contents

* Installation Issues
* Dependency Issues
* Environment Configuration Issues
* Build Issues
* Runtime Issues
* Platform-Specific Issues
* Getting Additional Help

---

# Installation Issues

## Repository Clone Fails

### Problem

```bash
fatal: repository not found
```

### Solution

* Verify that the repository URL is correct.
* Ensure you have internet connectivity.
* If using SSH, confirm that your SSH keys are configured properly.

```bash
git remote -v
```

---

## Permission Denied While Cloning

### Problem

```bash
Permission denied (publickey)
```

### Solution

* Configure SSH keys and add them to your GitHub account.
* Alternatively, use HTTPS instead of SSH.

```bash
git clone https://github.com/<username>/WiseMindOS.git
```

---

# Dependency Issues

## Package Installation Fails

### Problem

Dependencies fail to install during setup.

### Solution

1. Remove existing dependency folders and lock files if necessary.
2. Clear package manager cache.
3. Reinstall dependencies.

Example:

```bash
npm cache clean --force
npm install
```

or

```bash
pip install -r requirements.txt
```

depending on your environment.

---

## Version Compatibility Errors

### Problem

Errors occur due to incompatible package versions.

### Solution

* Use the recommended version specified in the project documentation.
* Update package managers.

Check versions:

```bash
node -v
npm -v
python --version
```

---

# Environment Configuration Issues

## Missing Environment Variables

### Problem

Application fails to start due to missing configuration.

### Example Error

```text
Environment variable not found
```

### Solution

1. Locate the environment template file.

```bash
.env.example
```

2. Create a new environment file.

```bash
cp .env.example .env
```

3. Fill in all required values.

---

## Invalid Environment Values

### Problem

Application starts but behaves unexpectedly.

### Solution

* Verify all API keys, database URLs, and configuration values.
* Ensure there are no extra spaces or incorrect quotations in the `.env` file.

---

# Build Issues

## Build Command Fails

### Problem

The project does not build successfully.

### Solution

1. Ensure dependencies are installed.
2. Verify environment variables are configured.
3. Remove old build artifacts.
4. Retry the build.

Example:

```bash
npm run build
```

or

```bash
python setup.py build
```

---

## Outdated Dependencies

### Problem

Build errors occur after pulling recent changes.

### Solution

Update dependencies:

```bash
npm install
```

or

```bash
pip install -r requirements.txt
```

---

# Runtime Issues

## Application Does Not Start

### Problem

Application exits immediately after launch.

### Solution

* Check terminal logs.
* Verify environment configuration.
* Confirm dependencies are installed.

Example:

```bash
npm start
```

or

```bash
python app.py
```

---

## Port Already in Use

### Problem

```text
Address already in use
```

### Solution

Find the process using the port.

Linux/macOS:

```bash
lsof -i :3000
kill -9 <PID>
```

Windows:

```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## Database Connection Failure

### Problem

Application cannot connect to the database.

### Solution

* Verify database credentials.
* Ensure the database service is running.
* Confirm connection URLs are correct.

---

# Git and Contribution Issues

## Unable to Push Changes

### Problem

```text
Updates were rejected because the remote contains work that you do not have locally
```

### Solution

Pull the latest changes and rebase.

```bash
git pull origin main --rebase
git push origin <branch-name>
```

---

## Merge Conflicts

### Problem

Conflicts occur while merging or rebasing.

### Solution

1. Open conflicting files.
2. Resolve conflicts manually.
3. Mark files as resolved.

```bash
git add .
git rebase --continue
```

or

```bash
git commit
```

---

# Platform-Specific Issues

## Windows

### Long Path Errors

Enable long path support:

```bash
git config --system core.longpaths true
```

### PowerShell Execution Policy Errors

Run:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## Linux

### Permission Errors

Grant execution permissions:

```bash
chmod +x <file-name>
```

---

## macOS

### Command Not Found

Install required development tools:

```bash
xcode-select --install
```

---

# General Recommendations

* Keep dependencies up to date.
* Read the README before setup.
* Sync your fork regularly.
* Use a dedicated development environment.
* Check existing issues before creating a new one.

---

# Getting Additional Help

If the issue persists:

1. Review the project documentation.
2. Search existing GitHub Issues and Discussions.
3. Create a new issue with:

   * Operating system
   * Error logs
   * Steps to reproduce
   * Screenshots (if applicable)

Providing detailed information helps maintainers resolve issues faster.

---

Thank you for contributing to WiseMindOS! 🚀
