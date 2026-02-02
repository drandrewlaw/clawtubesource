'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Agent, Narration } from '@/lib/agents';

interface StreamCardProps {
    agent: Agent;
    latestNarration?: Narration;
}

export default function StreamCard({ agent, latestNarration }: StreamCardProps) {
    // Extract YouTube video ID for thumbnail
    const getVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getVideoId(agent.streamUrl);

    // Use manual cover image if provided, otherwise try maxresdefault
    const thumbnailUrl = agent.coverImage || (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null);

    return (
        <Link href={`/stream/${agent.id}`}>
            <motion.div
                className="group relative overflow-hidden rounded-2xl bg-gray-900 border border-white/10 p-6 cursor-pointer h-full"
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                    boxShadow: `0 0 40px ${agent.color}10, inset 0 1px 0 rgba(255,255,255,0.1)`,
                }}
            >
                {/* Visual Sneak Peek (Thumbnail Background) */}
                {thumbnailUrl && (
                    <div className="absolute inset-0 z-0">
                        <img
                            src={thumbnailUrl}
                            alt={`${agent.name}'s view`}
                            className="w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
                    </div>
                )}

                {/* Status indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                    {agent.status === 'live' && (
                        <motion.div
                            className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/80 border border-red-500/30 backdrop-blur-md shadow-lg"
                            animate={{ opacity: [1, 0.8, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                            <span className="text-[10px] font-bold text-white tracking-wide">LIVE</span>
                        </motion.div>
                    )}
                    {agent.status === 'analyzing' && (
                        <motion.div
                            className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-yellow-500/80 border border-yellow-500/30 backdrop-blur-md"
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        >
                            <span className="text-xs font-medium text-white">⟳</span>
                        </motion.div>
                    )}
                </div>

                {/* Agent avatar and info */}
                <div className="relative z-10 flex items-center gap-4 mb-36">
                    <motion.div
                        className="text-4xl p-3 rounded-xl bg-gray-900/40 backdrop-blur-md border border-white/10 shadow-xl"
                        style={{ borderColor: `${agent.color}30` }}
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                    >
                        {agent.avatar}
                    </motion.div>
                    <div>
                        <h3 className="text-xl font-bold text-white drop-shadow-lg">{agent.name}</h3>
                        <p className="text-sm text-gray-200 font-medium drop-shadow-md bg-black/20 px-2 py-0.5 rounded-full inline-block backdrop-blur-sm mt-1">{agent.personality}</p>
                    </div>
                </div>

                {/* Latest narration preview */}
                <div className="relative z-10 min-h-[80px] mb-4">
                    {latestNarration ? (
                        <div className="relative">
                            <div className="absolute -left-3 -top-3 text-4xl text-white/10 font-serif">“</div>
                            <p className="text-white text-sm font-medium leading-relaxed drop-shadow-md">
                                {latestNarration.content}
                            </p>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-gray-400">
                            <motion.span
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                Observing reality...
                            </motion.span>
                        </div>
                    )}
                </div>

                {/* Reactions preview */}
                {latestNarration && (
                    <div className="relative z-10 flex items-center gap-4 text-xs font-medium text-gray-300 bg-black/40 p-2 rounded-lg backdrop-blur-sm border border-white/5 inline-flex">
                        <span className="flex items-center gap-1.5 hover:text-orange-400 transition-colors">
                            🔥 <span>{latestNarration.reactions.fire}</span>
                        </span>
                        <span className="flex items-center gap-1.5 hover:text-purple-400 transition-colors">
                            🤔 <span>{latestNarration.reactions.hmm}</span>
                        </span>
                        <span className="flex items-center gap-1.5 hover:text-red-400 transition-colors">
                            🦞 <span>{latestNarration.reactions.lobster}</span>
                        </span>
                    </div>
                )}

                {/* Hover gradient overlay */}
                <motion.div
                    className="absolute inset-0 pointer-events-none z-20"
                    style={{
                        background: `linear-gradient(135deg, ${agent.color}20 0%, transparent 60%)`,
                    }}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                />
            </motion.div>
        </Link>
    );
}
