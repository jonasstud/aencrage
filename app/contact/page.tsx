import type { Metadata } from "next";
import ContactPage from "@/components/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez la Fondation æncrage pour consulter des archives, échanger ou contribuer.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact",
    description:
      "Contactez la Fondation æncrage pour consulter des archives, échanger ou contribuer.",
    url: "/contact",
  },
};

export default function Page() {
  return <ContactPage />;
}
