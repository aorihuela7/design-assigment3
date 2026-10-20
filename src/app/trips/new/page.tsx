import type { Metadata } from "next";
import { Card } from "@/components/Card";
import { Page } from "@/components/Page";

export const metadata: Metadata = { title: "New trip type" };

export default function NewTripPage() {
  return (
    <Page title="New trip type" back={{ href: "/", label: "Back to My trips" }}>
      <Card>
        <p>Placeholder. The form to name a new trip type will go here.</p>
      </Card>
    </Page>
  );
}
