const VIBESTREAM_API = 'https://trio.machinefi.com';

export interface CheckOnceRequest {
  youtube_url: string;
  condition: string;
  model?: 'gemini-2.5-flash' | 'gpt-4o-mini' | 'claude-3-5-sonnet';
  include_frame?: boolean;
  skip_validation?: boolean;
}

export interface CheckOnceResponse {
  triggered: boolean;
  explanation: string;
  frame_b64?: string;
  timestamp?: string;
}

export interface LiveMonitorRequest {
  youtube_url: string;
  condition: string;
  webhook_url: string;
  interval_seconds?: number;
  model?: 'gemini-2.5-flash' | 'gpt-4o-mini' | 'claude-3-5-sonnet';
}

export interface LiveDigestRequest {
  youtube_url: string;
  topic: string;
  window_minutes?: number;
  model?: 'gemini-2.5-flash' | 'gpt-4o-mini' | 'claude-3-5-sonnet';
}

export interface Job {
  id: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  type: 'monitor' | 'digest';
  youtube_url: string;
  created_at: string;
  output?: string;
}

export interface Metrics {
  llm_usage: {
    gemini: number;
    openai: number;
    anthropic: number;
  };
  jobs: {
    total: number;
    success: number;
    failed: number;
  };
}

class VibeStreamClient {
  private baseUrl: string;

  constructor(baseUrl: string = VIBESTREAM_API) {
    this.baseUrl = baseUrl;
  }

  async checkOnce(request: CheckOnceRequest): Promise<CheckOnceResponse> {
    const response = await fetch(`${this.baseUrl}/check-once`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        youtube_url: request.youtube_url,
        condition: request.condition,
        model: request.model || 'gemini-2.5-flash',
        include_frame: request.include_frame ?? false,
        skip_validation: request.skip_validation ?? false,
      }),
    });

    if (!response.ok) {
      throw new Error(`VibeStream API error: ${response.statusText}`);
    }

    return response.json();
  }

  async startMonitor(request: LiveMonitorRequest): Promise<{ job_id: string }> {
    const response = await fetch(`${this.baseUrl}/live-monitor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        youtube_url: request.youtube_url,
        condition: request.condition,
        webhook_url: request.webhook_url,
        interval_seconds: request.interval_seconds || 10,
        model: request.model || 'gemini-2.5-flash',
      }),
    });

    if (!response.ok) {
      throw new Error(`VibeStream API error: ${response.statusText}`);
    }

    return response.json();
  }

  async startDigest(request: LiveDigestRequest): Promise<{ job_id: string }> {
    const response = await fetch(`${this.baseUrl}/live-digest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        youtube_url: request.youtube_url,
        topic: request.topic,
        window_minutes: request.window_minutes || 10,
        model: request.model || 'claude-3-5-sonnet',
      }),
    });

    if (!response.ok) {
      throw new Error(`VibeStream API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getJobs(): Promise<Job[]> {
    const response = await fetch(`${this.baseUrl}/jobs`);
    if (!response.ok) {
      throw new Error(`VibeStream API error: ${response.statusText}`);
    }
    return response.json();
  }

  async getJob(jobId: string): Promise<Job> {
    const response = await fetch(`${this.baseUrl}/jobs/${jobId}`);
    if (!response.ok) {
      throw new Error(`VibeStream API error: ${response.statusText}`);
    }
    return response.json();
  }

  async cancelJob(jobId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/jobs/${jobId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`VibeStream API error: ${response.statusText}`);
    }
  }

  async getMetrics(): Promise<Metrics> {
    const response = await fetch(`${this.baseUrl}/metrics`);
    if (!response.ok) {
      throw new Error(`VibeStream API error: ${response.statusText}`);
    }
    return response.json();
  }
}

export const vibestream = new VibeStreamClient();
export default vibestream;
