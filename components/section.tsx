import { Fragment, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { RevealOnScroll } from '@/components/animations';

interface SectionProps {
    children?: ReactNode;
    title?: string | ReactNode;
    description?: string;
    className?: string;
    id?: string;
    titleAlign?: 'left' | 'center';
    header?: ReactNode;
    disableDefaultHeader?: boolean;
    /** Tinted section surfaces, centralized here so a retheme edits one
     * place and propagates to every page: pages pick a variant instead of
     * passing bg utilities via className. */
    variant?: 'default' | 'muted' | 'accent';
}

export function Section({
    children,
    title,
    description,
    className = '',
    id,
    titleAlign = 'left',
    header,
    disableDefaultHeader = false,
    variant = 'default',
}: SectionProps) {
    const titleAlignment = titleAlign === 'center' ? 'text-center mx-auto' : 'text-left';

  const descriptionContent = description
    ? description.split('\n').map((line, index, arr) => (
        <Fragment key={`section-desc-line-${index}`}>
          {line.trim()}
          {index < arr.length - 1 && <br />}
        </Fragment>
      ))
    : null;

  return (
        <section
            id={id}
            className={cn(
                "py-20 md:py-28 lg:py-40",
                variant === 'muted' && "bg-muted-foreground/10",
                // Elevated stripe: zero-offset blur casts the shadow above AND
                // below the band (stock shadows are downward-only), lifting it
                // over the page. Wide blur + low alpha keeps it a soft lift
                // rather than a drawn edge — a tight blur reads as a hard line
                // where the band meets the page. Dark needs ~5x the alpha to
                // register at all over a near-black page.
                variant === 'accent' &&
                    "relative bg-accent/70 shadow-[0_0_40px_hsl(0_0%_10%/0.045)] dark:shadow-[0_0_40px_hsl(0_0%_0%/0.22)]",
                className
            )}
        >
            <div className="container">
                <div className="max-w-7xl mx-auto">
                    {(header || (!disableDefaultHeader && (title || description))) && (
                        <div className={`${titleAlignment}${children ? ' mb-12 md:mb-16' : ''}`}>
                            {header}
                            {!disableDefaultHeader && title && (
                                <RevealOnScroll direction="up" duration={0.6}>
                                    <h2 className={`font-serif text-3xl md:text-4xl lg:text-4xl font-semibold mb-3 max-w-3xl ${titleAlign === 'center' ? 'mx-auto' : ''}`}>
                                        {title}
                                    </h2>
                                </RevealOnScroll>
                            )}
                            {!disableDefaultHeader && description && (
                                <RevealOnScroll direction="up" delay={0.15} duration={0.6}>
                                    <p className={`text-lg text-muted-foreground max-w-3xl ${titleAlign === 'center' ? 'mx-auto' : ''}`}>
                                        {descriptionContent}
                                    </p>
                                </RevealOnScroll>
                            )}
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </section>
    );
}
