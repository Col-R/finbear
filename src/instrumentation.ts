/**
 * Next.js instrumentation hook — runs once when the server starts.
 *
 * Node.js 22+ exposes a built-in `localStorage` global. When Next.js spawns
 * its worker processes without a valid `--localstorage-file` path, the global
 * exists but its methods (getItem, setItem, etc.) throw. Libraries that
 * feature-detect `typeof localStorage !== 'undefined'` (e.g. @supabase/auth-js)
 * then crash with `TypeError: localStorage.getItem is not a function`.
 *
 * Deleting the broken global lets those libraries fall back to their own
 * cookie-based / in-memory storage as intended on the server.
 */
export function register() {
  if (
    typeof globalThis.localStorage !== 'undefined' &&
    typeof globalThis.localStorage.getItem !== 'function'
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (globalThis as any).localStorage;
  }
}