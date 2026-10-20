import type { Metadata } from "next";
import { Card } from "@/components/Card";
import { Page } from "@/components/Page";

// The title template only applies below the root layout.
export const metadata: Metadata = { title: { absolute: "My trips · Pack Again" } };

export default function MyTripsPage() {
  return (
    <Page title="My trips">
      <Card>
        <p>Placeholder. Your packing lists will appear here.</p>
      </Card>
    </Page>
  );
}
