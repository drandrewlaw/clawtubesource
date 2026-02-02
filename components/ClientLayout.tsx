'use client';

import { useEffect, useState } from 'react';
import DemoModeBanner from './DemoModeBanner';

interface ClientLayoutProps {
    children: React.ReactNode;
}

/**
 * Client-side layout wrapper for demo mode features
 */
export default function ClientLayout({ children }: ClientLayoutProps) {
    const [isDemoMode, setIsDemoMode] = useState(false);

    useEffect(() => {
        // Check demo mode from environment variable
        setIsDemoMode(process.env.NEXT_PUBLIC_DEMO_MODE === 'true');
    }, []);

    return (
        <>
            <DemoModeBanner isVisible={isDemoMode} />
            {children}
        </>
    );
}
