import { useSyncExternalStore } from "react";

// The current time, read only on the client: null on the server and during
// hydration, so date-based UI can't cause a mismatch. Read once per page load.
let now: number | null = null;

const subscribe = () => () => {};

export function useNow(): number | null {
  return useSyncExternalStore(
    subscribe,
    () => (now ??= Date.now()),
    () => null,
  );
}
