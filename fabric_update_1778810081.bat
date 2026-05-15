```bash
@echo off
setlocal enabledelayedexpansion

:: Change the following paths to your local Git repositories
set ORIANA_REPO=C:\path\to\Oriana.git
set MESSENGER_REPO=C:\path\to\Messenger.git
set LEDGER_REPO=C:\path\to\Ledger.git

:: Change the following values as needed
set COMMIT_MESSAGE='Oriana Build 1.0: Sovereign Alignment Complete'

cd /d "%ORIANA_REPO%"
git add .
git commit -m "%COMMIT_MESSAGE%"
git push origin master

cd /d "%MESSENGER_REPO%"
git add .
git commit -m "%COMMIT_MESSAGE%"
git push origin master

cd /d "%LEDGER_REPO%"
git add .
git commit -m "%COMMIT_MESSAGE%"
git push origin master
```

