import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: {
    default: "Fundora | Crowdfunding Platform",
    template: "%s | Fundora",
  },
};

export default function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)] flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
