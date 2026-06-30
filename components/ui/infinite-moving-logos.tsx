"use client";

import { cn } from "@/lib/utils";
import { ThemeAwareImage } from "@/components/theme-aware-image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import React, { useEffect, useState, useCallback } from "react";

type LogoItem = {
  src: string;
  srcDark?: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
};

type InfiniteMovingLogosProps = {
  items: LogoItem[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
  variant?: "infinite" | "static";
};

export const InfiniteMovingLogos = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
  variant = "infinite",
}: InfiniteMovingLogosProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);
  const isStatic = variant === "static";
  const infiniteGapOffset = "1.25rem"; // half of gap-10 spacing
  // Render 6 copies for seamless infinite scrolling
  const duplicationCount = isStatic ? 1 : 7;

  useEffect(() => {
    if (isStatic) return;

    const initAnimation = () => {
      if (!scrollerRef.current || !containerRef.current) return;

      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse",
      );

      const duration =
        speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";
      containerRef.current.style.setProperty("--animation-duration", duration);

      setStart(true);
    };

    initAnimation();
  }, [direction, speed, isStatic]);

  // Touch handlers for mobile: hold to pause
  const handleTouchStart = useCallback(() => {
    if (scrollerRef.current) scrollerRef.current.style.animationPlayState = "paused";
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (scrollerRef.current) scrollerRef.current.style.animationPlayState = "running";
  }, []);

  return (
    <TooltipProvider>
      <div
        ref={isStatic ? undefined : containerRef}
        className={cn(
          isStatic
            ? "relative z-20 mx-auto flex w-full justify-center"
            : "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,var(--background)_15%,var(--background)_85%,transparent)]",
          className,
        )}
        onTouchStart={isStatic ? undefined : handleTouchStart}
        onTouchEnd={isStatic ? undefined : handleTouchEnd}
        onTouchCancel={isStatic ? undefined : handleTouchEnd}
      >
        <ul
          ref={isStatic ? undefined : scrollerRef}
          className={cn(
            isStatic
              ? "flex flex-wrap items-center justify-center gap-20"
              : "flex w-max min-w-full shrink-0 flex-nowrap gap-12 sm:gap-20 py-4",
            !isStatic && start && "animate-scroll",
            !isStatic && pauseOnHover && "hover:[animation-play-state:paused]",
          )}
          style={
            !isStatic
              ? ({ "--scroll-offset": infiniteGapOffset } as React.CSSProperties)
              : undefined
          }
        >
          {Array.from({ length: isStatic ? 1 : duplicationCount }).map((_, copyIndex) =>
            items.map((item, index) => (
              <li
                key={`${item.src}-${copyIndex}-${index}`}
                className="flex h-20 w-20 items-center justify-center transition-all md:w-32"
                aria-label={item.alt ?? "Client logo"}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-pointer">
                      <ThemeAwareImage
                        src={item.src}
                        srcDark={item.srcDark}
                        alt={item.alt ?? "Client logo"}
                        width={item.width ?? 140}
                        height={item.height ?? 48}
                        className={cn("w-auto object-contain", isStatic ? "h-12" : "h-10", item.className)}
                        draggable={false}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.alt ?? "Client logo"}</p>
                  </TooltipContent>
                </Tooltip>
              </li>
            ))
          )}
        </ul>
      </div>
    </TooltipProvider>
  );
};

