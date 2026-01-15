# The 7-Phase Build Process

VeloKit uses a unique 7-phase construction process to ensure your project architecture is perfectly tailored to your needs.

## Phase 1: Identity & Type
This is where you set the foundation.
- **Project Type:** Choose between **Discord Bot**, **Express API**, or future web apps.
- **Project Name:** The folder name and `package.json` identity.
- **Language:** Select **TypeScript** or **JavaScript (ESM)**.

## Phase 2: Soul Selection (Discord)
Choose the primary "focus" of your bot. This determines which core engine components are injected.
- **Music:** Injects Lavalink/NodeLink listeners.
- **AI:** Injects provider-specific templates.
- **Moderation:** Injects community management tools.
- **Economy & Games:** Injects currency systems and gambling modules.

## Phase 3: Engine Deep-Dive
If you selected a complex soul (like Music or AI), VeloKit asks for technical specifics:
- **Music Engines:** Lavalink vs NodeLink credentials.
- **AI Providers:** Gemini, Groq, or OpenAI keys.

## Phase 4: Extra Injections
Layer additional command sets onto your core. You can add **Moderation**, **Utility**, or **Owner-only** tools regardless of your primary "Soul."

## Phase 5: Infrastructure
Configure the backbone of your project.
- **Database:** Choose between MongoDB (Mongoose) or PostgreSQL (Prisma).
- **Intents:** VeloKit automatically calculates required Gateway Intents.
- **Docker:** Generate production-ready container configurations.
- **Web Bridge:** Optional Express.js server for your bot (status pages, webhooks).

## Phase 6: Assembly
The CLI constructs the code, copies templates, and replaces placeholders with your configuration.

## Phase 7: Finalization
VeloKit runs a dependency sync and provides a detailed dashboard of your new architecture.
