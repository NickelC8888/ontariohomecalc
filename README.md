# Ontario Home Calculator

A React-based Ontario home cost calculator application.

---

## Installing Paperclip AI on Windows 11

[Paperclip AI](https://paperclip.ing/) is an open-source CLI for orchestrating AI agent teams.

### Prerequisites

- **Node.js 18+** — Download from [nodejs.org](https://nodejs.org/). The LTS version is recommended.
  - During installation, check **"Automatically install the necessary tools"** to include build tools (required for native dependencies).
- **Windows Build Tools** — If not installed via the Node.js installer, open PowerShell as Administrator and run:
  ```powershell
  npm install -g windows-build-tools
  ```

### Installation

Open **PowerShell** or **Command Prompt** and run:

```bash
npm install -g paperclipai
```

### Running Paperclip AI

```bash
paperclipai
```

The first run will launch an interactive setup wizard that configures:
- Embedded PostgreSQL database (auto-configured, no separate install needed)
- Authentication settings
- API server (starts at `http://localhost:3100`)

### Troubleshooting on Windows 11

**Permission errors during install:**
Run your terminal as Administrator, or configure npm to use a different global directory:
```powershell
npm config set prefix "$env:APPDATA\npm"
```

**`node-gyp` / native module errors:**
Install Visual Studio Build Tools:
```powershell
winget install Microsoft.VisualStudio.2022.BuildTools
```
Then re-run the install.

**Antivirus blocking `embedded-postgres`:**
Windows Defender may flag the embedded PostgreSQL binary. Add an exclusion for your npm global directory (`%APPDATA%\npm`) if needed.

**PowerShell execution policy:**
If scripts are blocked, run:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### Verify the Installation

```bash
paperclipai --version
```

---

## Development (this app)

```bash
npm install
npm run dev
```
