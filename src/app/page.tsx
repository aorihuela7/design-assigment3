import type { Metadata } from "next";
import { MyTrips } from "./MyTrips";

// The title template only applies below the root layout.
export const metadata: Metadata = { title: { absolute: "My trips · Pack Again" } };

export default function MyTripsPage() {
  return <MyTrips />;
}
