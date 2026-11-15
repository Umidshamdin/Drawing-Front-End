import { useEffect, useState } from 'react';
import { get } from './api';
import { demoMode, errText } from './helpers';

export function useRemote<T>(path: string | null, fallback?: T, deps = '') {
  const [data, setData] = useState<T | null>(demoMode && fallback !== undefined ? fallback : null);
  const [loading, setLoading] = useState(!demoMode);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let alive = true;
    if (path === null) { setLoading(false); return; }
    if (demoMode && fallback !== undefined) { setData(fallback); setLoading(false); setError(''); return; }
    setLoading(true);
    get<T>(path).then(value => { if (alive) { setData(value); setError(''); } }).catch(reason => { if (alive) { setError(errText(reason)); setData(null); } }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [path, deps, version]);
  return { data, loading, error, reload: () => setVersion(old => old + 1), setData };
}
