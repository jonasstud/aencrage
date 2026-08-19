import type { Metadata } from "next";
import ContactPage from "@/components/ContactPage";

export const metadata: Metadata = {
  title: "Contact — Fondation æncrage",
  description: "Contactez la Fondation æncrage pour consulter des archives, échanger ou contribuer.",
};

export default function Page() {
  return <ContactPage />;
}
