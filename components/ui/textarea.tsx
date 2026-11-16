import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Matches Input: same surface, border, focus ring and text size.
 *
 * Grows with its text instead of a drag handle: it starts at its min-height, gets taller line
 * by line up to its max-height, and scrolls inside after that. Set both with classes
 * (defaults below). CSS `field-sizing: content` would do this alone, but is not yet in
 * every browser our visitors use, so the height is measured here.
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, value, ...props }, ref) => {
    const innerRef = React.useRef<HTMLTextAreaElement>(null)
    React.useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement)

    const fit = React.useCallback(() => {
      const el = innerRef.current
      if (!el) return
      // Collapse first so the measurement can shrink as well as grow; CSS min/max-height clamp it.
      el.style.height = "auto"
      el.style.height = `${el.scrollHeight + el.offsetHeight - el.clientHeight}px`
    }, [])

    // Refit whenever the value changes (typing, pasting, a reset after sending). Used controlled.
    React.useLayoutEffect(fit, [fit, value])

    return (
      <textarea
        className={cn(
          "flex min-h-[88px] max-h-60 w-full resize-none overflow-y-auto rounded-md border border-input bg-muted px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={innerRef}
        value={value}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
