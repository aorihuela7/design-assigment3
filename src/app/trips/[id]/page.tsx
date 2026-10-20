import type { Metadata } from "next";
import { Suspense } from "react";
import { ListLoading } from "./ListLoading";
import { PackingList } from "./PackingList";

export const metadata: Metadata = { title: "Packing list" };

// useParams needs a Suspense boundary here: the id is only known at request time.
export default function PackingListPage() {
  return (
    <Suspense fallback={<ListLoading />}>
      <PackingList />
    </Suspense>
  );
}
