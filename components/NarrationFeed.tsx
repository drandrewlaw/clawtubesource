'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Narration } from '@/lib/agents';
import { useState, useEffect, useRef } from 'react';

interface NarrationFeedProps {
    narrations: Narration[];
    agentColor: string;
    agentAvatar: string;
    agentName: string;
}

export default function NarrationFeed({
    narrations,
    agentColor,
    agentAvatar,
    agentName,
}: NarrationFeedProps) {
    const [isPaused, setIsPaused] = useState(false);
    const feedRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to latest narration
    useEffect(() => {
        if (!isPaused && feedRef.current) {
            feedRef.current.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    }, [narrations, isPaused]);

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }).format(date);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span>Thoughts</span>
                    <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-xs text-gray-500"
                    >
                        streaming...
                    </motion.span>
                </h2>
                <button
                    onClick={() => setIsPaused(!isPaused)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${isPaused
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-gray-800 text-gray-400 border border-gray-700'
                        }`}
                >
                    {isPaused ? 'Paused' : 'Auto-scroll'}
                </button>
            </div>

            <div
                ref={feedRef}
                className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <AnimatePresence mode="popLayout">
                    {narrations.map((narration, index) => (
                        <motion.div
                            key={narration.id}
                            layout
                            initial={{ opacity: 0, x: -20, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="relative group"
                        >
                            {/* Screenshot-optimized card (16:9 aspect ratio friendly) */}
                            <div
                                className="relative overflow-hidden rounded-xl p-5 backdrop-blur-xl border border-white/10"
                                style={{
                                    background: `linear-gradient(135deg, ${agentColor}10 0%, rgba(17, 17, 17, 0.9) 100%)`,
                                    boxShadow: `0 4px 24px ${agentColor}10`,
                                }}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{agentAvatar}</span>
                                        <span className="font-medium text-white">{agentName}</span>
                                        <span
                                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                                            style={{
                                                backgroundColor: `${agentColor}20`,
                                                color: agentColor,
                                            }}
                                        >
                                            {Math.round(narration.confidence * 100)}% certain
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {formatTime(narration.timestamp)}
                                    </span>
                                </div>

                                {/* Content */}
                                <p className="text-gray-200 leading-relaxed text-base mb-4">
                                    &ldquo;{narration.content}&rdquo;
                                </p>

                                {/* Optional frame preview */}
                                {narration.frameB64 && (
                                    <div className="mb-4 rounded-lg overflow-hidden">
                                        <img
                                            src={`data:image/jpeg;base64,${narration.frameB64}`}
                                            alt="Stream frame"
                                            className="w-full h-auto rounded-lg"
                                        />
                                    </div>
                                )}

                                {/* Reactions */}
                                <div className="flex items-center gap-6 text-sm">
                                    <span className="flex items-center gap-1.5 text-gray-400">
                                        🔥 {narration.reactions.fire}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-gray-400">
                                        🤔 {narration.reactions.hmm}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-gray-400">
                                        🦞 {narration.reactions.lobster}
                                    </span>
                                </div>

                                {/* Verified source badge */}
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                                        ✓ Verified Source
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {narrations.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <motion.div
                            className="text-4xl mb-4"
                            animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1.05, 0.95] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            👁️
                        </motion.div>
                        <p>Waiting for observations...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
