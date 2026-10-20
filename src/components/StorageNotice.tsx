import type { StorageProblem } from "@/lib/storage";
import { Notice } from "./Notice";

const MESSAGES: Record<StorageProblem, string> = {
  blocked: "This browser isn’t saving. Your lists will disappear when you close it.",
  recovered: "We couldn’t read your saved lists. We kept a copy and started fresh.",
  full: "Your last change wasn’t saved because this browser’s storage is full.",
  newer: "Your lists were saved by a newer version of Pack Again. Reload the page to open them.",
};

export function StorageNotice({ problem }: { problem: StorageProblem | null }) {
  return problem ? <Notice>{MESSAGES[problem]}</Notice> : null;
}
