import { Body } from "./Body";
import { FloatingDockFooter } from "./FloatingDockFooter";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-layout" id="top">
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <Body>{children}</Body>
      <Footer />
      <FloatingDockFooter />
    </div>
  );
}
