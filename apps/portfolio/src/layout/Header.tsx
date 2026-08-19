import { Link } from "@tanstack/react-router";
import { ThomLogo } from "@th-m/thom-brand";

export function Header() {
  return (
    <header className="site-header">
      <Link className="header-brand" to="/brand" aria-label="THOM — brand">
        <ThomLogo variant="header" motion="compact" />
      </Link>
      <nav aria-label="Primary navigation">
        <Link to="/writing">Writings</Link>
      </nav>
    </header>
  );
}
