'use client';
import React, { useState, useCallback } from 'react';
import { FaArrowRight } from 'react-icons/fa6';

// ── Helpers ───────────────────────────────────────────────────────────────────

function randomSortedArray(size = 20): number[] {
  const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
  arr.sort((a, b) => a - b);
  return arr;
}

function randomTarget(arr: number[]): number {
  // 70% chance of picking a value in the array so there's usually a match
  if (Math.random() < 0.7) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  return Math.floor(Math.random() * 90) + 10;
}

// ── Exhaustive Search ─────────────────────────────────────────────────────────

type ExhaustivePhase = 'fetch' | 'no-match' | 'match' | 'not-found';

interface ExhaustiveState {
  arr: number[];
  target: number;
  index: number;
  phase: ExhaustivePhase;
  done: boolean;
}

function initExhaustive(): ExhaustiveState {
  const arr = randomSortedArray();
  return { arr, target: randomTarget(arr), index: 0, phase: 'fetch', done: false };
}

export function ExhaustiveVisualization() {
  const [state, setState] = useState<ExhaustiveState>(initExhaustive);

	const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
    setState(prev => {
      if (prev.done) return initExhaustive();

      const { arr, target, index, phase } = prev;

      if (phase === 'fetch') {
        if (arr[index] === target) return { ...prev, phase: 'match', done: true };
        return { ...prev, phase: 'no-match' };
      }

      if (phase === 'no-match') {
        const next = index + 1;
        if (next >= arr.length) return { ...prev, phase: 'not-found', done: true };
        return { ...prev, index: next, phase: 'fetch' };
      }

      return prev;
    });
  }, []);

  const { arr, target, index, phase, done } = state;

  const boxClass = (i: number) => {
    if (i !== index) return 'bg-gray-200 dark:bg-gray-700 ';
    if (phase === 'fetch')     return 'bg-yellow-300 dark:bg-yellow-400 text-black';
    if (phase === 'no-match')  return 'bg-red-400 dark:bg-red-500 ';
    if (phase === 'match')     return 'bg-green-400 dark:bg-green-500 ';
    return 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  };

  const statusText = () => {
    if (phase === 'not-found') return `Target ${target} is not in the array`;
    if (phase === 'match')     return `Index ${index} is a match! ✓`;
    if (phase === 'no-match')  return `Index ${index} is not a match`;
    return `Fetching index: ${index}`;
  };

  const statusColor = () => {
    if (phase === 'match')    return 'text-green-600 dark:text-green-400';
    if (phase === 'no-match' || phase === 'not-found') return 'text-red-500 dark:text-red-400';
    return 'text-yellow-600 dark:text-yellow-400';
  };

  return (
		<div className="mb-6 p-4 rounded-2xl bg-black/5 dark:bg-white/5 w-full">
			<div className="flex mb-3">
			<button
				className="tc1 lecture-link hover:opacity-70 active:opacity-50 transition-opacity flex items-center mr-auto"
				onClick={handleClick}
			>
				<span>{done ? 'Reset (randomize)' : 'Next step'}</span> {!done && <FaArrowRight className="ml-1 mt-0.5"/>}
				</button>
				<span className="lecture-bold text-base font-bold text-center">Exhaustive Search — O(n)</span>
			</div>
			
      {/* Array row */}
      <div className="flex gap-1 my-3 justify-center">
        {arr.map((val, i) => (
          <div
            key={i}
            className={`flex flex-col items-center justify-center w-[10%] aspect-square rounded transition-colors duration-200 ${boxClass(i)}`}
          >
            <div className="lecture-small leading-none opacity-60 -mb-1 mt-1">{i}</div>
            <div className="lecture-text font-bold">{val}</div>
          </div>
        ))}
      </div>

      {/* Status */}

      {/* Info row */}
			<div className="flex gap-4 justify-center text-sm mb-4 tc2 w-full lecture-text">
				<p className={`text-center font-semibold mr-auto ${statusColor()}`}>{statusText()}</p>
        <span>Index: <b className="tc1">{phase === 'not-found' ? '—' : index}</b></span>
        <span>Value: <b className="tc1">{phase === 'not-found' ? '—' : arr[index] ?? '—'}</b></span>
        <span>Target: <b className="tc1">{target}</b></span>
      </div>

      {/* Button */}
      <div className="flex justify-center">
        
      </div>
    </div>
  );
}

// ── Binary Search ─────────────────────────────────────────────────────────────

type BinaryPhase = 'fetch-middle' | 'too-high' | 'too-low' | 'found' | 'not-found';

interface BinaryState {
  arr: number[];
  target: number;
  low: number;
  high: number;
  mid: number;
  phase: BinaryPhase;
  done: boolean;
}

function initBinary(): BinaryState {
  const arr = randomSortedArray();
  const target = randomTarget(arr);
  const low = 0;
  const high = arr.length - 1;
  const mid = Math.floor((low + high) / 2);
  return { arr, target, low, high, mid, phase: 'fetch-middle', done: false };
}

export function BinaryVisualization() {
  const [state, setState] = useState<BinaryState>(initBinary);

	const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
    setState(prev => {
      if (prev.done) return initBinary();

      const { arr, target, low, high, mid, phase } = prev;

      if (phase === 'fetch-middle') {
        if (arr[mid] === target) return { ...prev, phase: 'found', done: true };
        if (arr[mid] > target)   return { ...prev, phase: 'too-high' };
        return { ...prev, phase: 'too-low' };
      }

      if (phase === 'too-high') {
        const newHigh = mid - 1;
        if (newHigh < low) return { ...prev, phase: 'not-found', done: true };
        const newMid = Math.floor((low + newHigh) / 2);
        return { ...prev, high: newHigh, mid: newMid, phase: 'fetch-middle' };
      }

      if (phase === 'too-low') {
        const newLow = mid + 1;
        if (newLow > high) return { ...prev, phase: 'not-found', done: true };
        const newMid = Math.floor((newLow + high) / 2);
        return { ...prev, low: newLow, mid: newMid, phase: 'fetch-middle' };
      }

      return prev;
    });
  }, []);

  const { arr, target, low, high, mid, phase, done } = state;

  const boxClass = (i: number): string => {
    // Outside active range — dim
    if (i < low || i > high) {
      return 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 opacity-40';
    }

    if (phase === 'found' && i === mid) {
      return 'bg-green-400 dark:bg-green-500 text-white scale-110';
    }
    if (phase === 'not-found') {
      return 'bg-gray-200 dark:bg-gray-700 text-gray-500';
    }
    if (phase === 'fetch-middle') {
      if (i === mid) return 'bg-yellow-300/80 dark:bg-yellow-400/80 text-gray-900 scale-105';
			return 'bg-yellow-200/50 dark:bg-yellow-300/25 text-gray-700 dark:text-gray-300';
		}
		// too-high: mid..high are eliminated (green)
		if (phase === 'too-high') {
			if (i == mid) return 'bg-red-500/80 dark:bg-red-600/80 text-gray-700 dark:text-gray-300'
			if (i >= mid) return 'bg-red-300/60 dark:bg-red-600/30 text-gray-700 dark:text-gray-300';
			return 'bg-yellow-200/50 dark:bg-yellow-300/25 text-gray-700 dark:text-gray-300';
		}
		// too-low: low..mid are eliminated (green)
		if (phase === 'too-low') {
			if (i == mid) return 'bg-red-500/80 dark:bg-red-600/80 text-gray-700 dark:text-gray-300'
			if (i <= mid) return 'bg-red-300/60 dark:bg-red-600/30 text-gray-700 dark:text-gray-300';
			return 'bg-yellow-200/50 dark:bg-yellow-300/25 text-gray-700 dark:text-gray-300';
		}
		return 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  };

  const statusText = () => {
    switch (phase) {
      case 'fetch-middle': return `Fetching middle: index ${mid} → value ${arr[mid]}`;
      case 'too-high':     return `arr[${mid}] = ${arr[mid]} is too high — discarding right half`;
      case 'too-low':      return `arr[${mid}] = ${arr[mid]} is too low — discarding left half`;
      case 'found':        return `Found ${target} at index ${mid}! ✓`;
      case 'not-found':    return `Target ${target} is not in the array`;
    }
  };

  const statusColor = () => {
    if (phase === 'found')    return 'text-green-600 dark:text-green-400';
    if (phase === 'not-found') return 'text-red-500 dark:text-red-400';
    if (phase === 'too-high' || phase === 'too-low') return 'text-green-600 dark:text-green-400';
    return 'text-yellow-600 dark:text-yellow-400 text-black';
  };

  return (
    <div className="mb-6 p-4 rounded-2xl bg-black/5 dark:bg-white/5 w-full">
      <div className="flex mb-3">
        <button
          className="tc1 lecture-link hover:opacity-70 active:opacity-50 transition-opacity flex items-center mr-auto"
          onClick={handleClick}
        >
          <span>{done ? 'Reset (randomize)' : 'Next step'}</span> {!done && <FaArrowRight className="ml-1 mt-0.5"/>}
        </button>
        <span className="lecture-bold text-base font-bold text-center">Binary Search — O(log n)</span>
      </div>

      {/* Array row */}
      <div className="flex gap-1 my-3 justify-center">
        {arr.map((val, i) => (
          <div
            key={i}
            className={`flex flex-col items-center justify-center w-[10%] aspect-square rounded transition-all duration-200 ${boxClass(i)}`}
          >
            <div className="lecture-small leading-none opacity-60 -mb-1 mt-1">{i}</div>
            <div className="lecture-text font-bold">{val}</div>
          </div>
        ))}
      </div>

      {/* Status */}

      {/* Info row */}
			<div className="flex gap-4 justify-center text-sm mb-4 tc2 w-full lecture-text">
				<p className={`text-center font-semibold mr-auto ${statusColor()}`}>{statusText()}</p>
        <span>Low: <b className="tc1">{low}</b></span>
        <span>High: <b className="tc1">{high}</b></span>
        <span>Mid: <b className="tc1">{mid}</b></span>
        <span>Mid Value: <b className="tc1">{arr[mid]}</b></span>
        <span>Target: <b className="tc1">{target}</b></span>
      </div>

      {/* Button */}
      <div className="flex justify-center">
      </div>
    </div>
  );
}
