'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Grainient } from '@/components/backgrounds/grainient';

/** Panel palette per theme, mirrored from the product app's login brand panel:
 *  an accent-toned field with the primary pooling through it. */
const PALETTE = {
    light: { color1: '#eee0d3', color2: '#a45007', color3: '#eee0d3' },
    dark: { color1: '#2a211b', color2: '#af5608', color3: '#2a211b' },
} as const;

/**
 * Grainient preset matching the product app's login panel: theme-switched brand
 * colors, faster flow (timeSpeed 1.6), softened contrast, slightly darker gamma.
 * Renders nothing until mounted so the palette never flashes the wrong theme.
 */
export function BrandGrainient({ className }: { className?: string }) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const colors = resolvedTheme === 'dark' ? PALETTE.dark : PALETTE.light;
    return (
        <Grainient
            {...colors}
            timeSpeed={1.6}
            contrast={1.15}
            gamma={0.9}
            className={className}
        />
    );
}
