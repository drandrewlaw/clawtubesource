'use client';

import { motion } from 'framer-motion';

interface DemoModeBannerProps {
    isVisible?: boolean;
}

/**
 * Demo mode indicator banner
 * Shows a subtle badge when the app is running in demo mode
 */
export default function DemoModeBanner({ isVisible = true }: DemoModeBannerProps) {
    if (!isVisible) return null;

    return (
        <motion.div
            className="fixed top-4 right-4 z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
        >
            <div className="px-3 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center gap-2">
                <motion.span
                    className="w-2 h-2 rounded-full bg-yellow-400"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-xs font-medium text-yellow-300">
                    Demo Mode
                </span>
            </div>
        </motion.div>
    );
}
