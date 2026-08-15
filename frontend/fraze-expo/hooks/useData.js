import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useCrews() {
  const [crews, setCrews] = useState([]);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    const { data } = await supabase.from('crews').select('*, crew_members(user_id, profiles(display_name))').order('created_at');
    setCrews(data ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  return { crews, loading, refresh };
}

export function useMemories({ crewId, kind } = {}) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    let q = supabase.from('memories')
      .select('*, profiles:author_id(display_name), crews:crew_id(name)')
      .order('created_at', { ascending: false }).limit(50);
    if (crewId) q = q.eq('crew_id', crewId);
    if (kind) q = q.eq('kind', kind);
    const { data } = await q;
    setMemories(data ?? []);
    setLoading(false);
  }, [crewId, kind]);
  useEffect(() => { refresh(); }, [refresh]);
  return { memories, loading, refresh };
}
