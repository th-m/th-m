import { ThomLogo } from "@th-m/thom-brand";
import { FloatingDockFooter } from "./FloatingDockFooter";

export function Footer() {
  return (
    <footer className="site-footer">
      <ThomLogo variant="static" motion="none" ariaLabel="THOM" />
      <div>
        <p>Thomas Valadez</p>
        <a href="#top">Return to top ↑</a>
      </div>
      <p className="footer-domain">th-m.codes</p>
      <FloatingDockFooter />
    </footer>
  );
}
