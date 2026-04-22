import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blackma ",
  description: "Blackma",
  // other metadata
};

export default function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}
