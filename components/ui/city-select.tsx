'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, MapPin } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export interface CityGroup {
  state: string;
  cities: string[];
}

// Punctuation-blind matching: typography never blocks a match.
const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

interface CitySelectProps {
  value: string;
  onChange: (city: string) => void;
  groups: CityGroup[];
  id?: string;
  invalid?: boolean;
  /** Id of the error text, when there is one. */
  describedBy?: string;
}

/**
 * Ported from the product app (ui/apps/web/src/components/CitySelect.tsx): type to search,
 * pick to select, single value, grouped under state headings. At rest the input shows the
 * selection; focusing opens the panel and clears the input for filtering, so typing is always
 * a filter, never an edit. Escape or clicking away closes with the selection untouched.
 *
 * One change for the website: the list is short, so a search with no exact match offers
 * "Use …" as the last row and the visitor's own city is never refused.
 */
export function CitySelect({ value, onChange, groups, id, invalid, describedBy }: CitySelectProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);

  const needle = normalize(query);
  const shown = useMemo(() => {
    const filtered = needle
      ? groups.map((g) => ({ ...g, cities: g.cities.filter((c) => normalize(c).includes(needle)) }))
      : groups;
    return filtered.filter((g) => g.cities.length > 0);
  }, [groups, needle]);
  const custom = needle && !groups.some((g) => g.cities.some((c) => normalize(c) === needle)) ? query.trim() : null;
  // One flat index across the groups and the custom row; headings aren't stops.
  const flat = useMemo(() => [...shown.flatMap((g) => g.cities), ...(custom ? [custom] : [])], [shown, custom]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector(`[data-idx="${activeIdx}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx, open]);

  const openPanel = () => {
    setOpen(true);
    setQuery('');
    setActiveIdx(0);
  };
  const close = () => {
    setOpen(false);
    setQuery('');
  };
  const pick = (c: string) => {
    onChange(c);
    close();
  };

  const row = (c: string, i: number, label: React.ReactNode) => (
    <button
      key={`${i}-${c}`}
      type="button"
      data-idx={i}
      onClick={() => pick(c)}
      onMouseEnter={() => setActiveIdx(i)}
      className={cn(
        'flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm',
        i === activeIdx && 'bg-accent text-accent-foreground'
      )}
    >
      {label}
      {c === value && <Check className="size-4 shrink-0 text-primary" />}
    </button>
  );

  return (
    <div
      ref={wrapRef}
      className="relative"
      onBlur={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget as Node)) close();
      }}
    >
      <MapPin className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
      {/* Chrome's address autofill overlays its own popup on a "city" input; one-time-code is
          the field kind it never address-fills (the app's fix, kept). */}
      <Input
        id={id}
        type="search"
        name="q"
        role="combobox"
        aria-expanded={open}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        value={open ? query : value}
        placeholder={open && value ? value : 'Type any city'}
        onFocus={openPanel}
        onChange={(e) => {
          setQuery(e.target.value);
          setActiveIdx(0);
          if (!open) setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            close();
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!open) openPanel();
            else setActiveIdx((i) => Math.min(flat.length - 1, i + 1));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIdx((i) => Math.max(0, i - 1));
          } else if (e.key === 'Enter') {
            e.preventDefault();
            if (open && flat[activeIdx]) pick(flat[activeIdx]);
          }
        }}
        autoComplete="one-time-code"
        spellCheck={false}
        // A typed city is kept to a city-name length.
        maxLength={60}
        className={cn('pl-9 [&::-webkit-search-cancel-button]:hidden', invalid && 'border-destructive-foreground')}
      />
      {open && (
        <div
          ref={panelRef}
          // Keep clicks inside from blurring the input before they land.
          onMouseDown={(e) => e.preventDefault()}
          className="absolute right-0 left-0 z-20 mt-1 max-h-64 overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
        >
          {/* The list is short; say up front that any city works, before they scroll for theirs. */}
          {!needle && (
            <p className="border-b px-2 pt-1 pb-2 mb-1 text-xs text-muted-foreground">
              Not listed? Type your city to use it.
            </p>
          )}
          {shown.map((g, gi) => {
            // Where this group starts in the flat index.
            const start = shown.slice(0, gi).reduce((n, prev) => n + prev.cities.length, 0);
            return (
              <div key={g.state}>
                <p className="px-2 pt-1.5 pb-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  {g.state}
                </p>
                {g.cities.map((c, ci) => row(c, start + ci, c))}
              </div>
            );
          })}
          {custom &&
            row(
              custom,
              flat.length - 1,
              <span>
                Use <span className="font-medium">&ldquo;{custom}&rdquo;</span>
              </span>
            )}
        </div>
      )}
    </div>
  );
}
