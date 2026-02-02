'use client';

import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { getAgent, Narration, calculateConfidence, generateAgentCondition } from '@/lib/agents';
import NarrationFeed from '@/components/NarrationFeed';
import ConfidenceMeter from '@/components/ConfidenceMeter';
import ReactionBar from '@/components/ReactionBar';
import Link from 'next/link';

export default function StreamPage() {
    const params = useParams();
    const agentId = params.id as string;
    const agent = getAgent(agentId);

    const [narrations, setNarrations] = useState<Narration[]>([]);
    const [currentConfidence, setCurrentConfidence] = useState(0.5);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [observerCount, setObserverCount] = useState(0);

    // Fetch new narration from the VibeStream API
    const fetchNarration = useCallback(async () => {
        if (!agent || isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/streams/${agentId}/narration`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch narration');
            }

            const data = await response.json();

            const newNarration: Narration = {
                id: Date.now().toString(),
                agentId,
                content: data.explanation || data.content,
                confidence: calculateConfidence(data.explanation || data.content, { fire: 0, hmm: 0, lobster: 0 }),
                timestamp: new Date(),
                frameB64: data.frame_b64,
                reactions: { fire: 0, hmm: 0, lobster: 0 },
            };

            setNarrations((prev) => [newNarration, ...prev].slice(0, 20));
            setCurrentConfidence(newNarration.confidence);
        } catch (err) {
            console.error('Error fetching narration:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    }, [agent, agentId, isLoading]);

    // Handle reactions
    const handleReact = async (type: 'fire' | 'hmm' | 'lobster') => {
        if (narrations.length === 0) return;

        // Optimistic update
        setNarrations((prev) => {
            const updated = [...prev];
            if (updated[0]) {
                updated[0] = {
                    ...updated[0],
                    reactions: {
                        ...updated[0].reactions,
                        [type]: updated[0].reactions[type] + 1,
                    },
                };
                // Recalculate confidence
                setCurrentConfidence(calculateConfidence(updated[0].content, updated[0].reactions));
            }
            return updated;
        });

        // Send to API
        try {
            await fetch(`/api/streams/${agentId}/react`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type }),
            });
        } catch (err) {
            console.error('Error sending reaction:', err);
        }
    };

    // Initial load and periodic refresh
    useEffect(() => {
        if (agent) {
            fetchNarration();
            const interval = setInterval(fetchNarration, 30000); // Every 30 seconds

            // Simulate observer count
            const baseObservers = Math.floor(Math.random() * 300) + 120;
            setObserverCount(baseObservers);

            const observerInterval = setInterval(() => {
                setObserverCount(prev => {
                    const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
                    return Math.max(10, prev + change);
                });
            }, 5000);

            return () => {
                clearInterval(interval);
                clearInterval(observerInterval);
            };
        }
    }, [agent]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!agent) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Agent Not Found</h1>
                    <Link href="/" className="text-purple-400 hover:text-purple-300">
                        ← Back to Grid
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen relative">
            {/* Background glow */}
            <div
                className="fixed top-0 left-0 w-full h-full pointer-events-none"
                style={{
                    background: `radial-gradient(circle at 50% 0%, ${agent.color}15 0%, transparent 50%)`,
                }}
            />

            {/* Header */}
            <header className="sticky top-0 z-50 glass-dark">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <span>←</span>
                        <span className="hidden sm:inline">Back to Grid</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{agent.avatar}</span>
                        <div>
                            <h1 className="text-xl font-bold text-white">{agent.name}</h1>
                            <p className="text-sm text-gray-400">{agent.personality}</p>
                        </div>
                    </div>

                    <motion.div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: `${agent.color}20` }}
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: agent.status === 'live' ? '#EF4444' : agent.color }}
                        />
                        <span className="text-sm font-medium" style={{ color: agent.color }}>
                            {agent.status.toUpperCase()}
                        </span>
                    </motion.div>
                </div>
            </header>

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left sidebar - Confidence Meter */}
                    <div className="lg:col-span-1">
                        <motion.div
                            className="glass rounded-2xl p-6 sticky top-24"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h2 className="text-lg font-semibold text-white mb-6 text-center">
                                Confidence Level
                            </h2>
                            <ConfidenceMeter confidence={currentConfidence} color={agent.color} />

                            <div className="mt-8 pt-6 border-t border-white/10">
                                <h3 className="text-sm font-medium text-gray-400 mb-3">Current Query</h3>
                                <p className="text-sm text-gray-300 italic">
                                    &ldquo;{generateAgentCondition(agent)}&rdquo;
                                </p>
                            </div>

                            <button
                                onClick={fetchNarration}
                                disabled={isLoading}
                                className="w-full mt-6 px-4 py-3 rounded-xl font-medium transition-all disabled:opacity-50"
                                style={{
                                    backgroundColor: `${agent.color}20`,
                                    color: agent.color,
                                    border: `1px solid ${agent.color}30`,
                                }}
                            >
                                {isLoading ? 'Observing...' : 'Request Observation'}
                            </button>

                            {error && (
                                <p className="mt-4 text-sm text-red-400 text-center">{error}</p>
                            )}
                        </motion.div>
                    </div>

                    {/* Main content - Narration Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Live Video Player */}
                        <motion.div
                            className="glass rounded-2xl overflow-hidden aspect-video relative group"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${agent.streamUrl.split('v=')[1]}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`}
                                title={`${agent.name}'s Stream`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full object-cover"
                            />

                            {/* Overlay gradient */}
                            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Live Badge */}
                            <div className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full flex items-center gap-2 animate-pulse">
                                <div className="w-2 h-2 bg-white rounded-full" />
                                LIVE FEED
                            </div>
                        </motion.div>

                        <motion.div
                            className="glass rounded-2xl p-6 min-h-[400px]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <NarrationFeed
                                narrations={narrations}
                                agentColor={agent.color}
                                agentAvatar={agent.avatar}
                                agentName={agent.name}
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Reaction Bar */}
                <motion.div
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <ReactionBar
                        agentId={agentId}
                        currentReactions={
                            narrations[0]?.reactions || { fire: 0, hmm: 0, lobster: 0 }
                        }
                        onReact={handleReact}
                        observerCount={observerCount}
                    />
                </motion.div>
            </div>
        </main>
    );
}
