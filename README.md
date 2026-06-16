# Financial Guidance for Under 45s

An information and guidance tool that helps users manage their finances based on their life stage. **No user data leaves the device.**

## Requirements

- Node.js 18.17 or later
- npm

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

Static files are output to `out/` for GitHub Pages deployment.

## Privacy

- Age is stored in `sessionStorage` only (cleared when the browser tab/session ends).
- Use **Start over** on any journey page to clear stored data immediately.
- No analytics or server-side data collection.

See [docs/security-and-privacy-architecture.md](docs/security-and-privacy-architecture.md) and the in-app **Security & privacy** page (`/security/`).

## Deployment

GitHub Pages deployment runs automatically on push to `main` via `.github/workflows/deploy.yml`.

Enable GitHub Pages in repository settings: **Source → GitHub Actions**.

Site URL: `https://<username>.github.io/financial-guidance-for-under-45s/`
