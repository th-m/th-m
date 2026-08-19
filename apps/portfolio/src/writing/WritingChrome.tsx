import { Link } from "@tanstack/react-router";
import { ThomLogo } from "../brand/thom/ThomLogo";

export function WritingChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header writing-header">
        <Link className="header-brand" to="/" aria-label="THOM — home">
          <ThomLogo variant="header" motion="compact" />
          <span className="header-domain">th-m.codes</span>
        </Link>
        <nav aria-label="Primary navigation">
          <Link to="/brand">Brand</Link>
          <Link to="/design-system">System</Link>
          <Link to="/writing" activeProps={{ "aria-current": "page" }}>Writing</Link>
        </nav>
      </header>
      <main className="writing-page" id="main">{children}</main>
      <footer className="writing-footer">
        <p>Thomas Valadez</p>
        <Link to="/brand">Brand</Link>
        <p className="footer-domain">th-m.codes</p>
      </footer>
    </>
  );
}

export function PublicationDate({ value }: { value: string }) {
  const formatted = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`));
  return <time dateTime={value}>{formatted}</time>;
}
