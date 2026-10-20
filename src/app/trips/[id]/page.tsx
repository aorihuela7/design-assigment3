import type { Metadata } from "next";
import { Card } from "@/components/Card";
import { Page } from "@/components/Page";

export const metadata: Metadata = { title: "Packing list" };

export default function PackingListPage() {
  return (
    <Page title="Packing list" back={{ href: "/", label: "Back to My trips" }}>
      <Card>
        <p>Placeholder. The packing list will go here.</p>
      </Card>
    </Page>
  );
}
