/**
 * eyecu.ai Client - Vision API for AI Agents
 * 
 * Gives any AI agent the ability to see and understand livestreams.
 * 
 * @example
 * ```typescript
 * import { eyecu } from './eyecu-client';
 * 
 * const insight = await eyecu.checkOnce({
 *   youtube_url: 'https://www.youtube.com/watch?v=...',
 *   condition: 'What is happening in this scene?'
 * });
 * console.log(insight.explanation);
 * ```
 */

const EYECU_API = 'https://trio.machinefi.com';

// ============================================================================
// Types
// ============================================================================

export interface CheckOnceRequest {
    /** YouTube livestream URL */
    youtube_url: string;
    /** Question or condition to evaluate against the current frame */
    condition: string;
    /** AI model to use for analysis */
    model?: 'gemini-2.5-flash' | 'gpt-4o-mini' | 'claude-3-5-sonnet';
    /** Include the captured frame as base64 in response */
    include_frame?: boolean;
    /** Skip URL validation for faster response */
    skip_validation?: boolean;
}

export interface CheckOnceResponse {
    /** Whether the condition was triggered/met */
    triggered: boolean;
    /** AI's interpretation and explanation */
    explanation: string;
    /** Base64-encoded frame (if include_frame was true) */
    frame_b64?: string;
    /** When the frame was captured */
    timestamp?: string;
}

export interface LiveMonitorRequest {
    /** YouTube livestream URL */
    youtube_url: string;
    /** Condition to watch for */
    condition: string;
    /** Webhook URL to POST when condition is triggered */
    webhook_url: string;
    /** Interval between checks in seconds (default: 10) */
    interval_seconds?: number;
    /** AI model to use */
    model?: 'gemini-2.5-flash' | 'gpt-4o-mini' | 'claude-3-5-sonnet';
}

export interface LiveDigestRequest {
    /** YouTube livestream URL */
    youtube_url: string;
    /** Topic or theme to focus the summary on */
    topic: string;
    /** Time window in minutes (default: 10) */
    window_minutes?: number;
    /** AI model to use */
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
    started_at: string;
    providers: {
        gemini: { calls: number; errors: number };
        openai: { calls: number; errors: number };
        anthropic: { calls: number; errors: number };
    };
    jobs: {
        created: number;
        completed: number;
        failed: number;
    };
    frames: {
        captured: number;
        skipped_prefilter: number;
    };
    webhooks: {
        sent: number;
        failed: number;
    };
}

// ============================================================================
// Client Class
// ============================================================================

class EyeCUClient {
    private baseUrl: string;

    constructor(baseUrl: string = EYECU_API) {
        this.baseUrl = baseUrl;
    }

    /**
     * Analyze a single frame from a livestream
     * 
     * @example
     * ```typescript
     * const result = await eyecu.checkOnce({
     *   youtube_url: 'https://www.youtube.com/watch?v=rnXIjl_Rzy4',
     *   condition: 'Is there anyone wearing red?',
     *   include_frame: true
     * });
     * ```
     */
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
            throw new Error(`eyecu.ai API error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }

    /**
     * Start continuous monitoring with webhook notifications
     * 
     * @example
     * ```typescript
     * const { job_id } = await eyecu.startMonitor({
     *   youtube_url: 'https://www.youtube.com/watch?v=...',
     *   condition: 'Detect when a person enters frame',
     *   webhook_url: 'https://my-app.com/alerts'
     * });
     * ```
     */
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
            throw new Error(`eyecu.ai API error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }

    /**
     * Get a topic-focused summary of stream content over time
     * 
     * @example
     * ```typescript
     * const { job_id } = await eyecu.startDigest({
     *   youtube_url: 'https://www.youtube.com/watch?v=...',
     *   topic: 'crowd behavior and movement patterns',
     *   window_minutes: 15
     * });
     * ```
     */
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
            throw new Error(`eyecu.ai API error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }

    /**
     * List all active and recent jobs
     */
    async listJobs(): Promise<Job[]> {
        const response = await fetch(`${this.baseUrl}/jobs`);
        if (!response.ok) {
            throw new Error(`eyecu.ai API error: ${response.status} ${response.statusText}`);
        }
        return response.json();
    }

    /**
     * Get status of a specific job
     */
    async getJob(jobId: string): Promise<Job> {
        const response = await fetch(`${this.baseUrl}/jobs/${jobId}`);
        if (!response.ok) {
            throw new Error(`eyecu.ai API error: ${response.status} ${response.statusText}`);
        }
        return response.json();
    }

    /**
     * Cancel a running job
     */
    async cancelJob(jobId: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/jobs/${jobId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`eyecu.ai API error: ${response.status} ${response.statusText}`);
        }
    }

    /**
     * Get usage metrics
     */
    async getMetrics(): Promise<Metrics> {
        const response = await fetch(`${this.baseUrl}/metrics`);
        if (!response.ok) {
            throw new Error(`eyecu.ai API error: ${response.status} ${response.statusText}`);
        }
        return response.json();
    }
}

// ============================================================================
// Export singleton instance
// ============================================================================

export const eyecu = new EyeCUClient();
export default eyecu;
