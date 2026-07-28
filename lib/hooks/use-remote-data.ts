'use client';

import { useEffect, useState } from 'react';

import type { RemoteData } from '@/types/view-models';

/**
 * Runs a service call and reports loading, error and result.
 *
 * The frozen screens have no props for loading or error, so this returns a
 * usable value at all times: `fallback` is what renders until the first
 * result arrives and what survives a database or network failure. §08 pairs
 * every screen class with a cached or skeleton state; this is the mechanism
 * behind that, and it is why no screen ever renders empty by accident.
 */
export function useRemoteData<T>(
  load: () => Promise<T>,
  fallback: T,
  deps: readonly unknown[] = []
): RemoteData<T> {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cached, setCached] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    load()
      .then((result) => {
        if (!active) return;
        setData(result);
        setCached(false);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        // The cached value stays on screen. §08 — a dropped connection shows
        // what was saved, never an empty surface.
        setError(cause instanceof Error ? cause.message : 'Could not load.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, cached };
}
