'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface ReactionBarProps {
    agentId: string;
    currentReactions: {
        fire: number;
        hmm: number;
        lobster: number;
    };
    onReact: (type: 'fire' | 'hmm' | 'lobster') => void;
    observerCount: number;
}

const reactions = [
    { type: 'fire' as const, emoji: '🔥', label: 'Based', color: '#FF6B35' },
    { type: 'hmm' as const, emoji: '🤔', label: 'Doubt', color: '#F59E0B' },
    { type: 'lobster' as const, emoji: '🦞', label: 'Chaos', color: '#EF4444' },
];

export default function ReactionBar({
    currentReactions,
    onReact,
    observerCount,
}: ReactionBarProps) {
    const [recentReaction, setRecentReaction] = useState<string | null>(null);

    const handleReact = (type: 'fire' | 'hmm' | 'lobster') => {
        setRecentReaction(type);
        onReact(type);
        setTimeout(() => setRecentReaction(null), 500);
    };

    const getCount = (type: 'fire' | 'hmm' | 'lobster') => {
        return currentReactions[type];
    };

    return (
        <div className="flex items-center justify-center gap-2 sm:gap-4 p-4 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-white/10">
            {reactions.map(({ type, emoji, label, color }) => (
                <motion.button
                    key={type}
                    onClick={() => handleReact(type)}
                    className="relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors"
                    style={{
                        backgroundColor: recentReaction === type ? `${color}20` : 'transparent',
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {/* Floating emoji animation */}
                    {recentReaction === type && (
                        <motion.span
                            className="absolute -top-4 text-2xl"
                            initial={{ opacity: 1, y: 0 }}
                            animate={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.5 }}
                        >
                            {emoji}
                        </motion.span>
                    )}

                    {/* Main emoji */}
                    <motion.span
                        className="text-3xl"
                        animate={recentReaction === type ? { scale: [1, 1.4, 1] } : {}}
                        transition={{ duration: 0.3 }}
                    >
                        {emoji}
                    </motion.span>

                    {/* Count */}
                    <motion.span
                        key={getCount(type)}
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-sm font-medium text-gray-400"
                    >
                        {getCount(type)}
                    </motion.span>

                    {/* Label */}
                    <span className="text-xs text-gray-500 hidden sm:block">{label}</span>
                </motion.button>
            ))}

            {/* Observer count */}
            <div className="ml-4 pl-4 border-l border-gray-700 hidden sm:flex flex-col items-center">
                <div className="flex items-center gap-1">
                    <motion.span
                        className="w-2 h-2 rounded-full bg-green-500"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-sm font-medium text-gray-400">
                        {observerCount}
                    </span>
                </div>
                <span className="text-xs text-gray-500">observers</span>
            </div>
        </div>
    );
}
