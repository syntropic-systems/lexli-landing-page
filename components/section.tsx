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
            className={cn("py-20 md:py-28 lg:py-40", className)}
        >
            <div className="container">
                <div className="max-w-7xl mx-auto">
                    {(header || (!disableDefaultHeader && (title || description))) && (
                        <div className={`${titleAlignment}${children ? ' mb-16 md:mb-20' : ''}`}>
                            {header}
                            {!disableDefaultHeader && title && (
                                <RevealOnScroll direction="up" duration={0.6}>
                                    <h2 className={`text-3xl md:text-4xl lg:text-5xl font-semibold mb-3 max-w-3xl ${titleAlign === 'center' ? 'mx-auto' : ''}`}>
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
