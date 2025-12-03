// app/about/page.jsx

import AboutContent from "./content";

export const metadata = {
  title: "About Us - Topeve | Redefining Luxury Fashion in Nigeria",
  description:
    "Discover Topeve's journey in bringing world-class luxury fashion to Nigeria. Learn about our commitment to quality, authenticity, and exceptional customer experience.",
  openGraph: {
    title: "About Us - Topeve",
    description:
      "Redefining luxury fashion in Nigeria with curated collections and unparalleled service.",
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
