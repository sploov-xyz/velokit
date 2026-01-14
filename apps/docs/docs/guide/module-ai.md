# AI Integration

Forge intelligent bots with VeloKit's pre-configured AI templates.

## Supported Providers
- **Gemini:** Google's latest high-performance models.
- **Groq:** Ultra-fast Llama 3 and Mixtral inference.
- **OpenAI:** The standard GPT-4/GPT-3.5 integration.

## How it Works
When you select the AI Soul, VeloKit injects a `chat.ts` command that is pre-wired to use your selected provider. 

## Configuration
Provide your API key during the forge or add it to the `.env` later:
```env
AI_PROVIDER=Gemini
AI_API_KEY=your_key_here
```

## Expanding the AI
The `src/commands/chat.ts` file includes a clean structure for handling prompts. You can easily extend this to support image generation or voice-to-text.
