"use client";

import * as React from "react";

export type Range = readonly [number, number];

export interface DualRangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  /** Controlled value. Omit to let the slider manage its own state. */
  value?: Range;
  defaultValue?: Range;
  onChange?: (value: [number, number]) => void;
  disabled?: boolean;
  id?: string;
  /** Base name for form submission (`name-min` / `name-max`). */
  name?: string;
  className?: string;
  /** Used for the header labels and `aria-valuetext`. */
  formatValue?: (value: number) => string;
  minLabel?: string;
  maxLabel?: string;
  /** Minimum gap between the two thumbs, in value units. Defaults to one step. */
  minGap?: number;
  title?: string;

}

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

// Static strings so Tailwind's scanner can see every class.
const THUMB_CLASSES = [
  // WebKit / Blink
  "[&::-webkit-slider-thumb]:appearance-none",
  "[&::-webkit-slider-thumb]:pointer-events-auto",
  "[&::-webkit-slider-thumb]:h-5",
  "[&::-webkit-slider-thumb]:w-5",
  "[&::-webkit-slider-thumb]:rounded-full",
  "[&::-webkit-slider-thumb]:border-2",
  "[&::-webkit-slider-thumb]:border-[var(--khg)]",
  "[&::-webkit-slider-thumb]:bg-white",
  "[&::-webkit-slider-thumb]:shadow-sm",
  "[&::-webkit-slider-thumb]:cursor-grab",
  // Firefox
  "[&::-moz-range-thumb]:pointer-events-auto",
  "[&::-moz-range-thumb]:h-5",
  "[&::-moz-range-thumb]:w-5",
  "[&::-moz-range-thumb]:rounded-full",
  "[&::-moz-range-thumb]:border-2",
  "[&::-moz-range-thumb]:border-[var(--khg)]",
  "[&::-moz-range-thumb]:bg-white",
  "[&::-moz-range-thumb]:shadow-sm",
  "[&::-moz-range-thumb]:cursor-grab",
  "[&::-moz-range-track]:bg-transparent",
  "[&::-moz-focus-outer]:border-0",
  // Keyboard focus ring, drawn on the thumb
  "[&:focus-visible::-webkit-slider-thumb]:ring-4",
  "[&:focus-visible::-webkit-slider-thumb]:ring-[var(--khg)]/30",
  "[&:focus-visible::-moz-range-thumb]:ring-4",
  "[&:focus-visible::-moz-range-thumb]:ring-[var(--khg)]/30",
].join(" ");

export default function DualRangeSlider({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  onChange,
  disabled = false,
  id,
  name,
  className,
  formatValue = (v) => String(v),
  minLabel = "Minimum value",
  maxLabel = "Maximum value",
  minGap,
  title,
}: DualRangeSliderProps) {
  const autoId = React.useId();
  const baseId = id ?? autoId;

  // Tolerate inverted bounds and a zero-width range. Extend the upper bound to
  // the next step boundary so the right end is always reachable on the grid.
  const lower = Math.min(min, max);
  const rawUpper = Math.max(min, max);
  const stepSize = step > 0 ? step : 1;
  const upper = lower + Math.ceil((rawUpper - lower) / stepSize) * stepSize;
  const span = upper - lower || 1;

  const normalize = React.useCallback(
    (pair: Range): [number, number] => {
      const snap = (v: number) =>
        clamp(Math.round((v - lower) / stepSize) * stepSize + lower, lower, upper);
      const a = snap(pair[0]);
      const b = snap(pair[1]);
      return a <= b ? [a, b] : [b, a];
    },
    [lower, upper, stepSize],
  );

  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState<[number, number]>(() =>
    normalize(defaultValue ?? [lower, upper]),
  );

  // Re-clamp internal state whenever the bounds/step change.
  React.useEffect(() => {
    if (isControlled) return;
    setUncontrolled((prev) => {
      const next = normalize(prev);
      return next[0] === prev[0] && next[1] === prev[1] ? prev : next;
    });
  }, [isControlled, normalize]);

  const [lo, hi] = isControlled ? normalize(value) : uncontrolled;

  // Keeps the thumb being dragged above the other one when they overlap.
  const [active, setActive] = React.useState<"min" | "max" | null>(null);

  const commit = React.useCallback(
    (next: [number, number]) => {
      if (next[0] === lo && next[1] === hi) return;
      if (!isControlled) setUncontrolled(next);
      onChange?.(next);
    },
    [lo, hi, isControlled, onChange],
  );

  const gap = Math.max(minGap ?? stepSize, 0);

  const setLow = (raw: number) =>
    commit([clamp(Math.min(raw, hi - gap), lower, upper), hi]);

  const setHigh = (raw: number) =>
    commit([lo, clamp(Math.max(raw, lo + gap), lower, upper)]);

  const loPct = ((lo - lower) / span) * 100;
  const hiPct = ((hi - lower) / span) * 100;

  const inputClass =
    "absolute inset-0 h-5 w-full appearance-none bg-transparent pointer-events-none outline-none disabled:cursor-not-allowed " +
    THUMB_CLASSES;

  return (
    <div
      className={["w-full space-y-1", disabled ? "opacity-50" : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex justify-between text-sm font-medium tabular-nums tc2">
        <span>{formatValue(lo)}</span>
        <span className='tc1 font-bold'>{title}</span>
        <span>{formatValue(hi)}</span>
      </div>

      <div className="relative h-5 w-full">
        {/* Track + active range */}
        <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-gray-500/50">
          <div
            className="absolute h-full rounded-full bg-[var(--khg)]"
            style={{ left: `${loPct}%`, right: `${100 - hiPct}%` }}
          />
        </div>

        {/* Min thumb */}
        <input
          id={`${baseId}-min`}
          name={name ? `${name}-min` : undefined}
          type="range"
          min={lower}
          max={upper}
          step={stepSize}
          value={lo}
          disabled={disabled}
          aria-label={minLabel}
          aria-valuetext={formatValue(lo)}
          onChange={(e) => setLow(Number(e.target.value))}
          onPointerDown={() => setActive("min")}
          onPointerUp={() => setActive(null)}
          onPointerCancel={() => setActive(null)}
          onBlur={() => setActive(null)}
          style={{ zIndex: active === "min" ? 30 : 20 }}
          className={inputClass}
        />

        {/* Max thumb */}
        <input
          id={`${baseId}-max`}
          name={name ? `${name}-max` : undefined}
          type="range"
          min={lower}
          max={upper}
          step={stepSize}
          value={hi}
          disabled={disabled}
          aria-label={maxLabel}
          aria-valuetext={formatValue(hi)}
          onChange={(e) => setHigh(Number(e.target.value))}
          onPointerDown={() => setActive("max")}
          onPointerUp={() => setActive(null)}
          onPointerCancel={() => setActive(null)}
          onBlur={() => setActive(null)}
          style={{ zIndex: active === "max" ? 30 : 21 }}
          className={inputClass}
        />
      </div>
    </div>
  );
}