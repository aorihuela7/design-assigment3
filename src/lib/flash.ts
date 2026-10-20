// A one-off message carried to the next page in this tab, like "Deleted Beach
// weekend" after leaving a deleted trip. Memory only: never stored, gone on reload.
let message: string | null = null;

export function setFlash(text: string) {
  message = text;
}

export function peekFlash() {
  return message;
}

export function clearFlash() {
  message = null;
}
