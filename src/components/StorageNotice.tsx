import type { StorageProblem } from "@/lib/storage";
import { Notice } from "./Notice";

const MESSAGES: Record<StorageProblem, string> = {
  blocked: "This browser isn’t saving. Your trips will disappear when you close it.",
  recovered: "We couldn’t read your saved trips. We kept a copy and started fresh.",
  full: "Your last change wasn’t saved because this browser’s storage is full.",
  newer: "Your trips were saved by a newer version of Pack Again. Reload the page to open them.",
};

export function StorageNotice({ problem }: { problem: StorageProblem | null }) {
  return problem ? <Notice>{MESSAGES[problem]}</Notice> : null;
}
