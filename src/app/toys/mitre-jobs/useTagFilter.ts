// useTagFilter.ts
import { useCallback, useMemo, useRef } from 'react';
import { usePersistedState } from './persistant-state'; // adjust path


export type TriState = boolean | null;
/** true = required, false = excluded, absent = ignored */
export type TagFilterState = ReadonlyMap<string, boolean>;

const EMPTY: TagFilterState = new Map<string, boolean>();

// Hoisted: stable identities, no per-render allocation
const serialize = (m: TagFilterState) => JSON.stringify(Array.from(m));

const deserialize = (raw: string | null | undefined): TagFilterState => {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    const map = new Map<string, boolean>();
    for (const entry of parsed) {
      if (Array.isArray(entry) && typeof entry[0] === 'string' && typeof entry[1] === 'boolean') {
        map.set(entry[0], entry[1]);
      }
    }
    return map.size ? map : EMPTY;
  } catch {
    return EMPTY;
  }
};

const PERSIST_OPTIONS = { serialize, deserialize };

export interface TagFilter {
  readonly state: TagFilterState;
  /** O(1) */ get(tag: string): TriState;
  /** O(1), no-op if unchanged (no re-render) */ set(tag: string, value: TriState): void;
  /** many writes → one render; accepts one-shot iterables */
  setMany(updates: Iterable<readonly [string, TriState]>): void;
  /** null → true → false → null */ cycle(tag: string): void;
  clear(): void;
  /** drop persisted tags that no longer exist (call once your tag list has loaded) */
  prune(validTags: ReadonlySet<string>): void;
  /** stable onChange per tag, safe for memo()'d checkboxes */
  setterFor(tag: string): (value: TriState) => void;
  readonly included: ReadonlySet<string>;
  readonly excluded: ReadonlySet<string>;
  readonly active: boolean;
  readonly activeCount: number;
  /** exclusions win, then all includes must be present */
  matches(tags: readonly string[] | ReadonlySet<string>): boolean;
}

const cycleValue = (v: TriState): TriState => (v === null ? true : v === true ? false : null);

/** Returns the same Map if nothing changed; otherwise a new one. */
function applyUpdates(
  prev: TagFilterState,
  updates: readonly (readonly [string, TriState | undefined])[],
  exclusive: boolean,
): TagFilterState {
  let next: Map<string, boolean> | null = null; // copy lazily, once
  for (const [tag, raw] of updates) {
    const value = raw ?? null;
    if (((next ?? prev).get(tag) ?? null) === value) continue;
    next ??= new Map(prev);
    if (value === null) next.delete(tag);
    else {
      if (exclusive) next.clear(); // only one tag may be active
      next.set(tag, value);
    }
  }
  return next ?? prev;
}

const isSetLike = (t: readonly string[] | ReadonlySet<string>): t is ReadonlySet<string> =>
  typeof (t as ReadonlySet<string>).has === 'function';

export function useTagFilter(key = 'tag-filter', exclusive = false): TagFilter {
  const [state, setState] = usePersistedState<TagFilterState>(key, EMPTY);

  // Assumes setState supports functional updates.
  const setStateRef = useRef(setState);
  setStateRef.current = setState;

  const setMany = useCallback((updates: Iterable<readonly [string, TriState]>) => {
    const list = Array.from(updates); // materialize BEFORE the updater can run twice
    if (list.length === 0) return;
    setStateRef.current((prev) => applyUpdates(prev, list, exclusive));
  }, [exclusive]);

  const set = useCallback((tag: string, value: TriState) => {
    setStateRef.current((prev) => applyUpdates(prev, [[tag, value]], exclusive));
  }, [exclusive]);

  const cycle = useCallback((tag: string) => {
    setStateRef.current((prev) =>
      applyUpdates(prev, [[tag, cycleValue(prev.get(tag) ?? null)]], exclusive),
    );
  }, [exclusive]);

  const clear = useCallback(() => {
    setStateRef.current((prev) => (prev.size === 0 ? prev : EMPTY));
  }, []);

  const prune = useCallback((validTags: ReadonlySet<string>) => {
    setStateRef.current((prev) => {
      let next: Map<string, boolean> | null = null;
      for (const tag of prev.keys()) {
        if (validTags.has(tag)) continue;
        next ??= new Map(prev);
        next.delete(tag);
      }
      return next ?? prev;
    });
  }, []);

  const settersRef = useRef(new Map<string, (value: TriState) => void>());
  const setterFor = useCallback(
    (tag: string) => {
      let fn = settersRef.current.get(tag);
      if (!fn) {
        fn = (value: TriState) => set(tag, value);
        settersRef.current.set(tag, fn);
      }
      return fn;
    },
    [set],
  );

  const { included, excluded } = useMemo(() => {
    const inc = new Set<string>();
    const exc = new Set<string>();
    for (const [tag, value] of state) (value ? inc : exc).add(tag);
    return { included: inc as ReadonlySet<string>, excluded: exc as ReadonlySet<string> };
  }, [state]);

  const get = useCallback((tag: string): TriState => state.get(tag) ?? null, [state]);

  const matches = useCallback(
    (tags: readonly string[] | ReadonlySet<string>) => {
      if (state.size === 0) return true;
      if (excluded.size > 0) {
        for (const t of tags) if (excluded.has(t)) return false;
      }
      if (included.size > 0) {
        const has = isSetLike(tags)
          ? (t: string) => tags.has(t)
          : (t: string) => tags.includes(t); // small arrays: cheaper than building a Set
        for (const t of included) if (!has(t)) return false;
      }
      return true;
    },
    [state, included, excluded],
  );

  return useMemo<TagFilter>(
    () => ({
      state, get, set, setMany, cycle, clear, prune, setterFor,
      included, excluded,
      active: state.size > 0,
      activeCount: state.size,
      matches,
    }),
    [state, get, set, setMany, cycle, clear, prune, setterFor, included, excluded, matches],
  );
}