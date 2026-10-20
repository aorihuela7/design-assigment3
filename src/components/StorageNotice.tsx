"use client";

import type { StorageProblem } from "@/lib/storage";
import { Button } from "./Button";
import { Notice } from "./Notice";

const MESSAGES: Record<StorageProblem, string> = {
  blocked: "This browser isn’t saving. Your trips will disappear when you close it.",
  recovered: "We couldn’t read your saved trips. We kept a copy and started fresh.",
  full: "Your last change wasn’t saved because this browser’s storage is full.",
  newer: "Your trips were saved by a newer version of Pack Again. Reload to open them.",
};

export function StorageNotice({ problem }: { problem: StorageProblem | null }) {
  if (!problem) return null;
  // A newer version saved these trips; reloading loads that version, so offer it.
  const action = problem === "newer" ? <Button onClick={() => window.location.reload()}>Reload</Button> : undefined;
  return <Notice action={action}>{MESSAGES[problem]}</Notice>;
}
