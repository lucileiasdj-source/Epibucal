import { supabase } from './supabase';

function getOrCreateSessionId(): string {
  const key = 'profsmoc_session_id';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

function truncateUserAgent(ua: string): string {
  return ua.slice(0, 512);
}

export async function logPageLoad(): Promise<void> {
  try {
    await supabase.from('access_logs').insert({
      session_id: getOrCreateSessionId(),
      event_type: 'page_load',
      tab_name: null,
      user_agent: truncateUserAgent(navigator.userAgent),
    });
  } catch {
    // Silently fail — tracking must never break the app
  }
}

export async function logTabNavigation(tabName: string): Promise<void> {
  try {
    await supabase.from('access_logs').insert({
      session_id: getOrCreateSessionId(),
      event_type: 'tab_navigation',
      tab_name: tabName,
      user_agent: truncateUserAgent(navigator.userAgent),
    });
  } catch {
    // Silently fail
  }
}
