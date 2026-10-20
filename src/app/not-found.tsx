import type { Metadata } from "next";
import { Card } from "@/components/Card";
import { Page } from "@/components/Page";

// Unknown URLs keep the Departures header and a way back, like every other page.
export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <Page title="Page not found" back={{ href: "/", label: "Back to My trips" }}>
      <Card>
        <p>There’s no page at this address.</p>
      </Card>
    </Page>
  );
}
