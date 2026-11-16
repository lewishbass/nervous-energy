import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "app-state"; // use your existing key
const WRITE_DELAY_MS = 200;

// ---- (de)serialization: Set/Map survive JSON round-trips ----
const replacer = (_: string, v: unknown) =>
	v instanceof Set ? { __type: "Set", value: Array.from(v) }
	: v instanceof Map ? { __type: "Map", value: Array.from(v) }
	: v;

const reviver = (_: string, v: any) =>
	v && typeof v === "object" && v.__type === "Set" ? new Set(v.value)
	: v && typeof v === "object" && v.__type === "Map" ? new Map(v.value)
	: v;

function readStore(): Record<string, unknown> {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		const parsed = raw ? JSON.parse(raw, reviver) : {};
		return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
	} catch {
		return {}; // corrupt JSON or storage unavailable
	}
}

// ---- shared write queue: one debounced write for ALL keys ----
const pending = new Map<string, unknown>();
let timer: ReturnType<typeof setTimeout> | null = null;

function flush() {
	if (timer) {
		clearTimeout(timer);
		timer = null;
	}
	if (pending.size === 0) return;
	try {
		const store = readStore();
		pending.forEach((v, k) => { store[k] = v; });
		localStorage.setItem(STORAGE_KEY, JSON.stringify(store, replacer));
	} catch {
		/* quota exceeded / storage disabled: ignore */
	}
	pending.clear();
}

function scheduleWrite(key: string, value: unknown) {
	pending.set(key, value);
	if (timer) clearTimeout(timer); // trailing debounce: resets on each change
	timer = setTimeout(flush, WRITE_DELAY_MS);
}

export function usePersistedState<T>(
	key: string,
	initial: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
	const [value, setValue] = useState<T>(initial);
	const [hydrated, setHydrated] = useState(false);
	const initialRef = useRef(initial);
	const lastPersisted = useRef<T>(initial);

	// Load once on mount (effects don't run during SSR, so no hydration mismatch)
	useEffect(() => {
		let found = false;
		let stored: unknown;

		if (pending.has(key)) {
			// a write is still queued (e.g. quick remount), so it's newer than storage
			stored = pending.get(key);
			found = true;
		} else {
			const store = readStore();
			if (key in store) {
				stored = store[key];
				found = true;
			}
		}

		if (found) {
			// backwards compat: old format saved Sets as plain arrays
			const next = (
				initialRef.current instanceof Set && Array.isArray(stored)
					? new Set(stored)
					: stored
			) as T;
			lastPersisted.current = next; // so the load itself doesn't trigger a save
			setValue(next);
		}
		setHydrated(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps -- key is assumed stable
	}, []);

	// Queue a debounced save whenever the value changes after hydration
	useEffect(() => {
		if (!hydrated) return;
		if (Object.is(lastPersisted.current, value)) return;
		lastPersisted.current = value;
		scheduleWrite(key, value);
	}, [key, value, hydrated]);

	// Don't lose a pending write if the tab is closed/hidden within the 200ms window
	useEffect(() => {
		const onHide = () => {
			if (document.visibilityState === "hidden") flush();
		};
		window.addEventListener("pagehide", flush);
		document.addEventListener("visibilitychange", onHide);
		return () => {
			window.removeEventListener("pagehide", flush);
			document.removeEventListener("visibilitychange", onHide);
		};
	}, []);

	return [value, setValue];
}