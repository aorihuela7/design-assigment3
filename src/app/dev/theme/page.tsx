import type { Metadata } from "next";
import { ThemePreview } from "./ThemePreview";

// Review page for the theme and shared components. Remove before shipping.
export const metadata: Metadata = { title: "Theme preview", robots: { index: false } };

export default function ThemePreviewPage() {
  return <ThemePreview />;
}
