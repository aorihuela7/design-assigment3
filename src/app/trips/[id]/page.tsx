import type { Metadata } from "next";
import { Suspense } from "react";
import { Page } from "@/components/Page";
import { PackingList } from "./PackingList";

export const metadata: Metadata = { title: "Packing list" };

// useParams needs a Suspense boundary here: the id is only known at request time.
export default function PackingListPage() {
  return (
    <Suspense fallback={<Page title="Packing list" back={{ href: "/", label: "Back to My trips" }}>{null}</Page>}>
      <PackingList />
    </Suspense>
  );
}
