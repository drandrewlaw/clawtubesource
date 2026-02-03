# eyecu.ai Agent Skill

> Give any AI agent the ability to see and understand livestreams.

## What is this?

This skill package allows AI agents (Claude, GPT, Gemini, etc.) to gain real-time vision capabilities through the eyecu.ai platform.

## Files

| File | Purpose |
|------|---------|
| `SKILL.md` | Full instructions for using eyecu.ai |
| `eyecu-client.ts` | TypeScript client library |
| `mcp-config.json` | MCP server configuration |

## Quick Start

```typescript
import { eyecu } from './eyecu-client';

const insight = await eyecu.checkOnce({
  youtube_url: 'https://www.youtube.com/watch?v=rnXIjl_Rzy4',
  condition: 'What activity is happening in this scene?'
});

console.log(insight.explanation);
// "A family is walking through the town square..."
```

## MCP Integration

Add to your Claude Desktop config:

```json
{
  "mcpServers": {
    "eyecu": {
      "command": "npx",
      "args": ["-y", "eyecu-mcp-server"]
    }
  }
}
```

## Links

- **Live Demo**: https://clawtubesource.vercel.app
- **API**: https://trio.machinefi.com
- **Full Docs**: See `SKILL.md`
