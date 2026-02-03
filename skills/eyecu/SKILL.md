---
name: eyecu.ai Vision
description: Give your AI agent real-time vision of any YouTube or video livestream
---

# eyecu.ai - The Retina Layer for AI Agents

AI can't watch video streams. This skill fixes that.

eyecu.ai gives your agent the ability to **see and understand live video** from any YouTube stream, webcam, or IP camera feed in real-time.

## Quick Start

```bash
# One API call to see what's happening in any stream right now
curl -X POST https://trio.machinefi.com/check-once \
  -H "Content-Type: application/json" \
  -d '{
    "youtube_url": "https://www.youtube.com/watch?v=rnXIjl_Rzy4",
    "condition": "What activity is happening in this scene?",
    "model": "gemini-2.5-flash",
    "include_frame": true
  }'
```

Response:
```json
{
  "triggered": true,
  "explanation": "A family of four is walking through the town square, the children pointing at a horse-drawn carriage.",
  "frame_b64": "data:image/jpeg;base64,..."
}
```

---

## API Reference

### Base URL
```
https://trio.machinefi.com
```

### Endpoints

#### 1. Check Once (Single Frame Analysis)
**POST** `/check-once`

Capture and analyze a single frame from a livestream.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `youtube_url` | string | ✅ | YouTube livestream URL |
| `condition` | string | ✅ | Question or condition to evaluate |
| `model` | string | ❌ | `gemini-2.5-flash`, `gpt-4o-mini`, or `claude-3-5-sonnet` |
| `include_frame` | boolean | ❌ | Return the captured frame as base64 |
| `skip_validation` | boolean | ❌ | Skip URL validation for faster response |

**Response:**
```typescript
{
  triggered: boolean;      // Whether the condition was met
  explanation: string;     // AI's interpretation
  frame_b64?: string;      // Base64-encoded frame (if requested)
  timestamp?: string;      // When the frame was captured
}
```

---

#### 2. Live Monitor (Continuous Watching)
**POST** `/live-monitor`

Start a background job that watches a stream and sends webhooks when conditions are met.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `youtube_url` | string | ✅ | YouTube livestream URL |
| `condition` | string | ✅ | Condition to watch for |
| `webhook_url` | string | ✅ | URL to POST when triggered |
| `interval_seconds` | number | ❌ | Check interval (default: 10) |
| `model` | string | ❌ | AI model to use |

**Response:**
```typescript
{ job_id: string }
```

---

#### 3. Live Digest (Topic Summary)
**POST** `/live-digest`

Summarize what's happening on a stream over a time window.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `youtube_url` | string | ✅ | YouTube livestream URL |
| `topic` | string | ✅ | Topic/theme to focus on |
| `window_minutes` | number | ❌ | Time window (default: 10) |
| `model` | string | ❌ | AI model to use |

---

#### 4. Job Management

**GET** `/jobs` - List all jobs  
**GET** `/jobs/{job_id}` - Get job status  
**DELETE** `/jobs/{job_id}` - Cancel a job

---

## TypeScript Client

```typescript
import { eyecu } from './eyecu-client';

// Single frame check
const result = await eyecu.checkOnce({
  youtube_url: 'https://www.youtube.com/watch?v=rnXIjl_Rzy4',
  condition: 'Is there any unusual activity?',
  include_frame: true
});

console.log(result.explanation);

// Start continuous monitoring
const { job_id } = await eyecu.startMonitor({
  youtube_url: 'https://www.youtube.com/watch?v=rnXIjl_Rzy4',
  condition: 'Detect when crowd size exceeds 50 people',
  webhook_url: 'https://my-app.com/webhook'
});
```

---

## Agent Personality Examples

Different agent personas can interpret the same stream differently:

### The Optimist 🌟
> "What beautiful or hopeful activity is happening?"

### The Skeptic 🦖
> "What suspicious or anomalous behavior do you detect?"

### The Poet 🌙
> "What metaphor is this moment whispering?"

### The Analyst 📊
> "Quantify crowd density, movement patterns, and activity levels"

### The Guardian ⚡
> "Detect any safety hazards or emergency situations"

---

## Use Cases

| Use Case | Condition Example |
|----------|-------------------|
| 🚨 Security | "Detect if anyone enters the restricted zone" |
| 📊 Analytics | "Count the number of vehicles on screen" |
| 🎮 Gaming | "Detect when a boss fight begins" |
| 🦅 Wildlife | "Is the eagle bringing food to the nest?" |
| 🌊 Surf | "Describe current wave conditions" |
| 📰 News | "Summarize the breaking news on screen" |
| 🎪 Events | "What is happening on stage right now?" |

---

## MCP Integration

For Model Context Protocol (MCP) compatible agents, add to your config:

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

This exposes tools:
- `eyecu_check_once` - Analyze a single frame
- `eyecu_start_monitor` - Begin continuous watching
- `eyecu_get_digest` - Summarize stream topic
- `eyecu_list_jobs` - List active monitoring jobs
- `eyecu_cancel_job` - Stop a monitoring job

---

## Rate Limits

- Free tier: 1,000 frames/month
- No credit card required
- Pay-per-insight after free tier

---

## Links

- **Live Demo**: https://clawtubesource.vercel.app
- **API Base**: https://trio.machinefi.com
- **Docs**: https://eyecu.ai/docs
