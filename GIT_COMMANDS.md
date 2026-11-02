# 📘 Git Commands Reference — CampusHire Frontend

This document explains every Git command used in this project, along with its purpose and usage.

---

## 🔧 Initial Setup Commands

### 1. `git init`
**Purpose:** Initializes a new Git repository in the current directory.  
**Usage:**
```bash
git init
```
**What it does:** Creates a hidden `.git` folder that tracks all changes, branches, and history for your project. This is the very first command you run when starting version control.

---

### 2. `git config --global user.name "Your Name"`
**Purpose:** Sets the author name for all your commits globally.  
**Usage:**
```bash
git config --global user.name "DeepakGautam05"
```
**What it does:** Every commit you make will be tagged with this name, so collaborators know who made each change.

---

### 3. `git config --global user.email "your@email.com"`
**Purpose:** Sets the author email for all your commits globally.  
**Usage:**
```bash
git config --global user.email "deepakgautam0505@gmail.com"
```
**What it does:** Associates your email with your commits. This should match your GitHub account email.

---

## 📁 Staging & Committing

### 4. `git add .`
**Purpose:** Stages all modified and new files for the next commit.  
**Usage:**
```bash
git add .
```
**What it does:** Moves files from the **working directory** to the **staging area**. The `.` means "add everything." You can also add specific files:
```bash
git add filename.txt
git add src/components/
```

---

### 5. `git status`
**Purpose:** Shows the current state of the working directory and staging area.  
**Usage:**
```bash
git status
```
**What it does:** Displays:
- Files that are **staged** (ready to commit)
- Files that are **modified** but not staged
- Files that are **untracked** (new files not yet added)

---

### 6. `git commit -m "message"`
**Purpose:** Saves staged changes to the repository with a descriptive message.  
**Usage:**
```bash
git commit -m "Initial commit: CampusHire frontend setup"
```
**What it does:** Creates a permanent snapshot (commit) of all staged files. The `-m` flag lets you add a message inline. Good commit messages describe **what** changed and **why**.

---

## 🌿 Branch Management

### 7. `git branch`
**Purpose:** Lists all local branches or creates a new branch.  
**Usage:**
```bash
git branch              # List all branches
git branch feature-xyz  # Create a new branch named 'feature-xyz'
```
**What it does:** Branches let you work on features or fixes in isolation without affecting the main codebase.

---

### 8. `git branch -M main`
**Purpose:** Renames the current branch to `main`.  
**Usage:**
```bash
git branch -M main
```
**What it does:** The `-M` flag forcefully renames the branch. This is commonly used to rename the default `master` branch to `main` (GitHub's new default).

---

### 9. `git checkout -b branch-name`
**Purpose:** Creates a new branch and switches to it immediately.  
**Usage:**
```bash
git checkout -b feature-login
```
**What it does:** Combines `git branch feature-login` + `git checkout feature-login` into one command.

---

### 10. `git checkout branch-name`
**Purpose:** Switches to an existing branch.  
**Usage:**
```bash
git checkout main
```
**What it does:** Changes your working directory to reflect the state of the specified branch.

---

### 11. `git merge branch-name`
**Purpose:** Merges changes from another branch into the current branch.  
**Usage:**
```bash
git checkout main
git merge feature-login
```
**What it does:** Combines the commit history of two branches. If there are conflicting changes, Git will ask you to resolve them manually.

---

## 🌐 Remote Repository Commands

### 12. `git remote add origin <URL>`
**Purpose:** Links your local repository to a remote repository on GitHub.  
**Usage:**
```bash
git remote add origin https://github.com/DeepakGautam05/campushire-frontend.git
```
**What it does:** `origin` is the default name for the remote. The URL points to your GitHub repository. This only needs to be done once.

---

### 13. `git remote -v`
**Purpose:** Displays the remote repository URLs.  
**Usage:**
```bash
git remote -v
```
**What it does:** Shows the fetch and push URLs for all configured remotes. Useful for verifying your remote is set up correctly.

---

### 14. `git push -u origin main`
**Purpose:** Pushes your local commits to the remote repository for the first time.  
**Usage:**
```bash
git push -u origin main
```
**What it does:**
- `push` — uploads your commits to GitHub
- `-u` — sets `origin/main` as the default upstream, so future pushes only need `git push`
- `origin` — the remote name
- `main` — the branch to push

---

### 15. `git push`
**Purpose:** Pushes committed changes to the remote repository.  
**Usage:**
```bash
git push
```
**What it does:** After the first push with `-u`, this shorter command pushes to the configured upstream branch.

---

### 16. `git pull`
**Purpose:** Fetches and merges changes from the remote repository.  
**Usage:**
```bash
git pull origin main
```
**What it does:** Downloads new commits from the remote and automatically merges them into your current branch. Equivalent to `git fetch` + `git merge`.

---

### 17. `git clone <URL>`
**Purpose:** Creates a local copy of a remote repository.  
**Usage:**
```bash
git clone https://github.com/DeepakGautam05/campushire-frontend.git
```
**What it does:** Downloads the entire repository (code, branches, history) to your local machine. Used when you want to work on an existing project.

---

## 📜 History & Inspection

### 18. `git log`
**Purpose:** Shows the commit history of the repository.  
**Usage:**
```bash
git log               # Full log with details
git log --oneline     # Compact one-line-per-commit view
git log -5            # Show only the last 5 commits
```
**What it does:** Displays commit hashes, authors, dates, and messages. Press `q` to exit the log viewer.

---

### 19. `git diff`
**Purpose:** Shows the differences between files.  
**Usage:**
```bash
git diff              # Changes in working directory (unstaged)
git diff --staged     # Changes that are staged for commit
```
**What it does:** Line-by-line comparison showing what was added (+) and removed (-).

---

## ⏪ Undo & Reset

### 20. `git restore filename`
**Purpose:** Discards changes in a file (reverts to last committed version).  
**Usage:**
```bash
git restore src/app/page.tsx
```
**What it does:** Overwrites the file with its last committed version. **Warning:** Unsaved changes are lost permanently.

---

### 21. `git reset HEAD filename`
**Purpose:** Unstages a file (removes from staging area but keeps changes).  
**Usage:**
```bash
git reset HEAD src/app/page.tsx
```
**What it does:** Moves a file from the staging area back to the working directory without deleting your changes.

---

### 22. `git stash`
**Purpose:** Temporarily saves uncommitted changes.  
**Usage:**
```bash
git stash          # Save changes
git stash pop      # Restore the most recent stash
git stash list     # View all stashed changes
```
**What it does:** Useful when you need to switch branches but don't want to commit incomplete work.

---

## 🗑️ .gitignore

### What is `.gitignore`?
A `.gitignore` file tells Git which files and folders to **ignore** — meaning they won't be tracked or uploaded to GitHub.

### Why is it important?
- **Security:** Prevents sensitive files (`.env` with API keys/passwords) from being published
- **Cleanliness:** Keeps `node_modules/` (which can be 500MB+) out of the repo
- **Performance:** Reduces repo size by excluding build artifacts and logs

### Common patterns used in this project:
| Pattern | What it ignores |
|---|---|
| `node_modules/` | NPM dependencies (reinstallable via `npm install`) |
| `/.next/` | Next.js build cache |
| `.env` | Environment variables / secrets |
| `*.tsbuildinfo` | TypeScript build cache |
| `.DS_Store` | macOS system files |
| `Thumbs.db` | Windows thumbnail cache |
| `.idea/` / `.vscode/` | IDE configuration files |

---

## 🔄 Typical Git Workflow

Here's the standard workflow used in this project:

```
1. git init                              ← Initialize repo (once)
2. git add .                             ← Stage all files
3. git commit -m "Initial commit"        ← Save snapshot
4. git branch -M main                    ← Rename branch to main
5. git remote add origin <GitHub-URL>    ← Link to GitHub
6. git push -u origin main              ← Upload to GitHub

--- For ongoing development ---
7. git add .                             ← Stage changes
8. git commit -m "describe changes"      ← Commit changes
9. git push                              ← Push to GitHub
```

---

## 📚 Quick Reference Table

| Command | Description |
|---|---|
| `git init` | Initialize a new repo |
| `git add .` | Stage all changes |
| `git status` | View repo status |
| `git commit -m "msg"` | Commit with message |
| `git branch -M main` | Rename branch to main |
| `git remote add origin URL` | Add remote repo |
| `git push -u origin main` | First push to GitHub |
| `git push` | Push subsequent changes |
| `git pull` | Pull remote changes |
| `git clone URL` | Clone a repository |
| `git log --oneline` | View commit history |
| `git diff` | View file changes |
| `git stash` | Temporarily save changes |
| `git restore file` | Discard file changes |
| `git checkout -b name` | Create & switch branch |
| `git merge branch` | Merge a branch |

---

> **Note:** This project uses a `.gitignore` file to prevent unnecessary files like `node_modules/`, build outputs, IDE configs, and environment files from being tracked by Git.

---

*Document created for CampusHire Frontend Project — November 2026*
