'use client';
import React, { useState, useRef, useCallback } from 'react';
import { FaPlay, FaShuffle, FaStop } from 'react-icons/fa6';
import '@/styles/sliders.css';
import '@/styles/buttons.css';
import '@/styles/popups.css';

// ── Types ────────────────────────────────────────────────────────────────────

type BarColor = 'default' | 'comparing' | 'swapping' | 'sorted' | 'invalid';

interface BarData {
  value: number;
  color: BarColor;
  offset: string; // translateX CSS value, e.g. '0' or 'calc(200% + 2px)'
}

export interface SortVisualizer {
  length: number;
  idle: boolean;
  compare: (i: number, j: number) => Promise<number>;
  swap: (i: number, j: number) => Promise<void>;
  isSorted: () => Promise<{ sorted: boolean, index: number }>;
  scramble: (instant?: boolean) => Promise<void>;
}

export type SortAlgorithm = (visualizer: SortVisualizer) => Promise<void>;

// ── Helpers ──────────────────────────────────────────────────────────────────

function shuffledRange(size: number): BarData[] {
  const arr = Array.from({ length: size }, (_, i) => i + 1);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.map(v => ({ value: v, color: 'default' as BarColor, offset: '0' }));
}

const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

const BAR_COLORS: Record<BarColor, string> = {
  default:   'bg-blue-500 dark:bg-blue-400',
  comparing: 'bg-yellow-400 dark:bg-yellow-300',
  swapping:  'bg-orange-500 dark:bg-orange-400',
  sorted:    'bg-green-500 dark:bg-green-400',
  invalid:   'bg-red-500 dark:bg-red-400',
};

const DEFAULT_SIZE = 30;
const DEFAULT_DELAY = 30;

// ── SortVisualization (bar display) ──────────────────────────────────────────

interface SortVisualizationProps {
  bars: BarData[];
  doSwapAnimation: boolean;
  delayTime: number;
}

export function SortVisualization({ bars, doSwapAnimation, delayTime }: SortVisualizationProps) {
  const n = bars.length;
  return (
    <div className="relative w-full h-48 flex items-end" style={{ gap: n > 50 ? 0 : 1 }}>
      {bars.map((bar) => (
        <div
          key={bar.value}
          className="flex-1 flex items-end justify-center h-full"
          style={{
            transform: `translateX(${bar.offset})`,
            transition: (bar.offset !== '0' && doSwapAnimation)
              ? `transform ${Math.max(delayTime * 0.8, 50)}ms ease`
              : 'none',
          }}
        >
          <div
            className={`w-full rounded-t-sm ${BAR_COLORS[bar.color]} transition-colors duration-100`}
            style={{ height: `${(bar.value / n) * 100}%`, minHeight: 2 }}
          />
        </div>
      ))}
    </div>
  );
}

// ── SortVisualizationContainer ───────────────────────────────────────────────

interface ContainerProps {
  algorithm: SortAlgorithm;
  title?: string;
}

export function SortVisualizationContainer({ algorithm, title }: ContainerProps) {
  const [bars, setBars] = useState<BarData[]>(() => shuffledRange(DEFAULT_SIZE));
  const [arraySize, setArraySize] = useState(DEFAULT_SIZE);
  const [delayTime, setDelayTime] = useState(DEFAULT_DELAY);
  const [doAnimate, setDoAnimate] = useState(true);
  const [running, setRunning] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);

  const barsRef = useRef(bars);
  const delayRef = useRef(delayTime);
  const animateRef = useRef(doAnimate);
  const cancelRef = useRef(false);

  // Keep refs in sync
  delayRef.current = delayTime;
  animateRef.current = doAnimate;

  const update = useCallback((fn: (b: BarData[]) => BarData[]) => {
    setBars(prev => {
      const next = fn(prev);
      barsRef.current = next;
      return next;
    });
  }, []);

  const createVisualizer = useCallback((): SortVisualizer => {
    let _idle = true;
    const check = () => { if (cancelRef.current) throw new Error('cancelled'); };

    return {
      get length() { return barsRef.current.length; },
      get idle() { return _idle; },
      set idle(v) { _idle = v; },

      async compare(i, j) {
        check();
        update(b => b.map((bar, idx) => ({
          ...bar,
          color: (idx === i || idx === j) ? 'comparing' : 'default',
          offset: '0',
        })));
        await wait(delayRef.current);
        check();
        return barsRef.current[i].value - barsRef.current[j].value;
      },

      async swap(i, j) {
        check();
        const n = barsRef.current.length;
        const gapPx = n > 50 ? 0 : 1;
        const offsetStr = (delta: number) =>
          delta === 0 ? '0' : `calc(${delta * 100}% + ${delta * gapPx}px)`;
        if (animateRef.current) {
          // slide bars via transform offset
          update(b => b.map((bar, idx) => ({
            ...bar,
            color: (idx === i || idx === j) ? 'swapping' : 'default',
            offset: idx === i ? offsetStr(j - i) : idx === j ? offsetStr(i - j) : '0',
          })));
          await wait(delayRef.current);
          check();
        }
        // actually swap values and reset visuals
        update(b => {
          const next = [...b];
          [next[i], next[j]] = [next[j], next[i]];
          return next.map(bar => ({ ...bar, color: 'default', offset: '0' }));
        });
        if (!animateRef.current) {
          await wait(delayRef.current);
          check();
        }
      },

      async isSorted() {
        check();
        const len = barsRef.current.length;
        for (let k = 0; k < len - 1; k++) {
          check();
          if (barsRef.current[k].value > barsRef.current[k + 1].value) {
            // highlight validated bars green, first invalid red
            update(b => b.map((bar, idx) => ({
              ...bar,
              color: idx <= k ? 'sorted' : idx === k + 1 ? 'invalid' : 'default',
              offset: '0',
            })));
            await wait(delayRef.current);
            update(b => b.map(bar => ({ ...bar, color: 'default', offset: '0' })));
            return {sorted: false, index: k};
          }
          update(b => b.map((bar, idx) => ({
            ...bar,
            color: idx <= k ? 'sorted' : 'default',
            offset: '0',
          })));
          await wait(delayRef.current / 3);
        }
        // all sorted
        update(b => b.map(bar => ({ ...bar, color: 'sorted', offset: '0' })));
        return {sorted: true, index: -1};
      },

      async scramble(instant = false) {
        check();
        const size = barsRef.current.length;
        if (instant) {
          update(() => shuffledRange(size));
          return;
        }
        const gapPx = size > 50 ? 0 : 1;
        const offsetStr = (delta: number) =>
          delta === 0 ? '0' : `calc(${delta * 100}% + ${delta * gapPx}px)`;
        update(b => b.map(bar => ({ ...bar, color: 'default', offset: '0' })));
        for (let i = size - 1; i > 0; i--) {
          check();
          const j = Math.floor(Math.random() * (i + 1));
          if (i !== j) {
            if (animateRef.current) {
              update(b => b.map((bar, idx) => ({
                ...bar,
                color: (idx === i || idx === j) ? 'swapping' : 'default',
                offset: idx === i ? offsetStr(j - i) : idx === j ? offsetStr(i - j) : '0',
              })));
              await wait(delayRef.current / 2);
            }
            update(b => {
              const next = [...b];
              [next[i], next[j]] = [next[j], next[i]];
              return next.map(bar => ({ ...bar, color: 'default', offset: '0' }));
            });
          }
        }
      },
    };
  }, [update]);

  const handleStart = useCallback(async () => {
    if (running) {
      cancelRef.current = true;
      return;
    }
    cancelRef.current = false;
    setRunning(true);
    try {
      await algorithm(createVisualizer());
    } catch {
      // cancelled
    }
    setRunning(false);
  }, [running, algorithm, createVisualizer]);

  const handleScramble = useCallback(async () => {
    cancelRef.current = true;
    if (running) await wait(100);
    cancelRef.current = false;
    setRunning(true);
    setIsScrambling(true);

    const size = barsRef.current.length;
    const scrambleDelay = Math.max(Math.floor(delayRef.current / 4), 5);
    const gapPx = size > 50 ? 0 : 1;
    const offsetStr = (delta: number) =>
      delta === 0 ? '0' : `calc(${delta * 100}% + ${delta * gapPx}px)`;

    update(b => b.map(bar => ({ ...bar, color: 'default', offset: '0' })));
    try {
      for (let k = 0; k < 4 * size; k++) {
        if (cancelRef.current) break;
        const i = Math.floor(Math.random() * size);
        const j = Math.floor(Math.random() * size);
        if (i !== j) {
          update(b => b.map((bar, idx) => ({
            ...bar,
            color: (idx === i || idx === j) ? 'swapping' : 'default',
            offset: idx === i ? offsetStr(j - i) : idx === j ? offsetStr(i - j) : '0',
          })));
          await wait(scrambleDelay);
          if (cancelRef.current) break;
          update(b => {
            const next = [...b];
            [next[i], next[j]] = [next[j], next[i]];
            return next.map(bar => ({ ...bar, color: 'default', offset: '0' }));
          });
          await wait(scrambleDelay);
        }
      }
    } catch {
      // cancelled
    }

    setIsScrambling(false);
    setRunning(false);
  }, [running, update]);

  const handleSizeChange = useCallback((newSize: number) => {
    if (running) {
      cancelRef.current = true;
      setRunning(false);
    }
    setArraySize(newSize);
    setBars(() => {
      const next = shuffledRange(newSize);
      barsRef.current = next;
      return next;
    });
  }, [running]);

  return (
    <div className="mb-6 p-4 rounded-2xl bg-black/5 dark:bg-white/5 w-full">
      {/* Header row */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <button
          className="tc1 lecture-link hover:opacity-70 active:opacity-50 transition-opacity flex items-center gap-1.5"
          onClick={handleStart}
        >
          {running ? <><FaStop className="text-sm" /> Stop</> : <><FaPlay className="text-sm" /> Sort</>}
        </button>
        <button
          className="tc1 lecture-link hover:opacity-70 active:opacity-50 transition-opacity flex items-center gap-1.5"
          onClick={handleScramble}
        >
          <FaShuffle className="text-sm" /> Scramble
        </button>
        {title && <span className="lecture-bold text-base font-bold ml-auto">{title}</span>}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-3 flex-wrap tc2 text-sm">
        <label className="flex items-center gap-2" style={{opacity: running? 0.5:1}}>
					Size: <span className="font-courier cont-bold">{arraySize.toLocaleString().padStart(3, '\u00A0')}</span>
          <input
            type="range" min={5} max={100} value={arraySize}
            onChange={e => handleSizeChange(Number(e.target.value))}
            className="w-24 accent-[var(--khv)]"
            disabled={running}
          />
        </label>
        <label className="flex items-center gap-2">
          Delay: <span className="font-courier cont-bold">{delayTime.toLocaleString().padStart(4, '\u00A0')}</span>ms
          <input
            type="range" min={1} max={500} value={delayTime}
            onChange={e => setDelayTime(Number(e.target.value))}
            className="w-24 accent-[var(--khv)]"
          />
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox" checked={doAnimate}
            onChange={e => setDoAnimate(e.target.checked)}
            className="accent-[var(--khv)]"
          />
          Animate swaps
        </label>
      </div>

      {/* Bars */}
      <SortVisualization
        bars={bars}
        doSwapAnimation={doAnimate || isScrambling}
        delayTime={isScrambling ? Math.max(Math.floor(delayTime / 4), 5) : delayTime}
      />
    </div>
  );
}