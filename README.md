# DevNest AI

DevNest AI is an early-stage open developer workspace for experimenting with AI-assisted coding workflows.

## What is included

- Responsive public landing page
- Prompt Playground
- Demo mode with no API key
- Optional real Anthropic Claude integration
- Server-side `/api/generate` endpoint
- Environment-variable based secret handling
- Documentation
- Privacy and Terms pages
- Roadmap and GitHub links

## Architecture

```text
Browser
   |
   v
Vercel static frontend
   |
   v
/ api / generate
   |
   v
Anthropic Messages API
   |
   v
Claude
```

## Deploy on Vercel

1. Import the repository into Vercel.
2. Keep the project root at the repository root.
3. Deploy.
4. If you have legitimate Anthropic API access, add this Vercel environment variable:

```text
ANTHROPIC_API_KEY=your_real_key
```

Optional:

```text
ANTHROPIC_MODEL=claude-sonnet-4-6
```

5. Redeploy.

**Never put the API key inside `index.html`, `app.js`, GitHub, or any client-side file.**

Without `ANTHROPIC_API_KEY`, the site intentionally remains in demo mode.

## Local development

The API route is a Vercel serverless function. Install the Vercel CLI and run:

```bash
vercel dev
```

Then open the local URL shown by Vercel.

## Project status

This is an early-stage prototype. The public playground is functional in demo mode, while the Claude integration is production-architecture-ready but requires legitimate API access.

## Roadmap

- [x] Public landing page
- [x] Prompt playground
- [x] Secure server-side API boundary
- [x] Documentation
- [x] Privacy and Terms
- [ ] Saved prompts
- [ ] Evaluation datasets
- [ ] Usage analytics with privacy controls
- [ ] More developer utilities
- [ ] Community contributions

## Important

This repository does not claim to be an Anthropic-affiliated product and does not guarantee eligibility for any Anthropic program.
