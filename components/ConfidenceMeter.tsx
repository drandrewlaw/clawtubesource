'use client';

import { motion } from 'framer-motion';

interface ConfidenceMeterProps {
    confidence: number; // 0-1
    color: string;
}

export default function ConfidenceMeter({ confidence, color }: ConfidenceMeterProps) {
    // Calculate arc position (180 degrees = full confidence)
    const rotation = confidence * 180 - 90; // -90 to 90 degrees

    const getConfidenceLabel = () => {
        if (confidence < 0.3) return 'Uncertain';
        if (confidence < 0.6) return 'Sensing';
        if (confidence < 0.8) return 'Confident';
        return 'Certain';
    };

    const getConfidenceColor = () => {
        if (confidence < 0.3) return '#EF4444'; // red
        if (confidence < 0.6) return '#F59E0B'; // yellow
        if (confidence < 0.8) return '#10B981'; // green
        return '#14F195'; // bright green
    };

    return (
        <div className="relative w-full max-w-[280px] mx-auto py-4">
            {/* Background arc */}
            <svg viewBox="0 0 200 110" className="w-full overflow-visible">
                <defs>
                    <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#374151" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#4B5563" stopOpacity="0.5" />
                    </linearGradient>
                    <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#EF4444" />
                        <stop offset="40%" stopColor="#F59E0B" />
                        <stop offset="80%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#14F195" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Track */}
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#1F2937"
                    strokeWidth="12"
                    strokeLinecap="round"
                    className="opacity-50"
                />

                {/* Active progress */}
                <motion.path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="url(#activeGradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: confidence }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{ filter: "url(#glow)" }}
                />

                {/* Tick marks */}
                {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
                    const angle = tick * 180 - 180;
                    const rad = (angle * Math.PI) / 180;
                    const innerR = 72;
                    const outerR = 88;
                    return (
                        <line
                            key={i}
                            x1={100 + innerR * Math.cos(rad)}
                            y1={100 + innerR * Math.sin(rad)}
                            x2={100 + outerR * Math.cos(rad)}
                            y2={100 + outerR * Math.sin(rad)}
                            stroke="#374151"
                            strokeWidth="2"
                            className="opacity-50"
                            transform="rotate(-90 100 100)" // Adjust for SVG coordinate system
                        />
                    );
                })}

                {/* Needle */}
                <motion.g
                    initial={{ rotate: -90 }}
                    animate={{ rotate: rotation }}
                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                    style={{ transformOrigin: "100px 100px" }}
                >
                    {/* Shadow */}
                    <line
                        x1="100"
                        y1="100"
                        x2="100"
                        y2="25"
                        stroke="black"
                        strokeWidth="4"
                        strokeLinecap="round"
                        opacity="0.2"
                        transform="translate(2, 2)"
                    />
                    {/* Needle Body */}
                    <path
                        d="M 97 100 L 100 25 L 103 100 Z"
                        fill="#E5E7EB"
                        filter="drop-shadow(0 0 2px rgba(0,0,0,0.5))"
                    />
                    <circle cx="100" cy="100" r="6" fill="#1F2937" stroke="#E5E7EB" strokeWidth="2" />
                </motion.g>
            </svg>

            {/* Labels container */}
            <div className="flex justify-between px-6 -mt-6 relative z-10">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">Doubt</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">Certainty</span>
            </div>

            {/* Center Value Display - Moved below gauge */}
            <div className="text-center mt-2">
                <motion.div
                    key={confidence}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                >
                    <span className="text-4xl font-bold tracking-tight text-white drop-shadow-xl"
                        style={{ textShadow: `0 0 30px ${getConfidenceColor()}60` }}>
                        {Math.round(confidence * 100)}<span className="text-lg align-top opacity-60 ml-0.5">%</span>
                    </span>
                    <span
                        className="text-xs font-medium px-3 py-1 rounded-full mt-2 border border-white/10 shadow-lg backdrop-blur-sm"
                        style={{
                            color: getConfidenceColor(),
                            backgroundColor: `${getConfidenceColor()}15`,
                            boxShadow: `0 0 20px ${getConfidenceColor()}10`
                        }}
                    >
                        {getConfidenceLabel()}
                    </span>
                </motion.div>
            </div>
        </div>
    );
}
