import type { Metadata } from "next";
import { NewTrip } from "./NewTrip";

export const metadata: Metadata = { title: "New trip type" };

export default function NewTripPage() {
  return <NewTrip />;
}
