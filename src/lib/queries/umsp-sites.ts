import { createClient } from '@/lib/supabase/client';
import { UmspSite } from '@/types/database';

export function isActiveSite(site: UmspSite): boolean {
  return site.status?.toLowerCase() === 'active';
}

export async function fetchUmspSites(): Promise<UmspSite[]> {
  const { data, error } = await createClient()
    .from('umsp_sites')
    .select('*')
    .order('site');

  if (error) throw error;
  return data ?? [];
}
