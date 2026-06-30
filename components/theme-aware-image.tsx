'use client';

import * as React from 'react';
import Image, { type ImageProps } from 'next/image';
import { useTheme } from 'next-themes';

interface ThemeAwareImageProps extends Omit<ImageProps, 'src'> {
    src: string;
    srcDark?: string;
}

export function ThemeAwareImage({ src, srcDark, ...props }: ThemeAwareImageProps) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Use dark mode image if provided and theme is dark, otherwise use regular src
    const imageSrc = mounted && resolvedTheme === 'dark' && srcDark ? srcDark : src;

    return <Image src={imageSrc} {...props} />;
}

