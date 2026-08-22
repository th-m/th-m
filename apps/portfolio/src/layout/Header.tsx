import { Link, useRouterState } from "@tanstack/react-router";
import { ThomLogo } from "@th-m/thom-brand";

export function Header() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const fromRoot = pathname === "/";
  return (
    <header className="site-header">
      <Link
        className="header-brand"
        to={fromRoot ? "/brand" : "/"}
        aria-label={fromRoot ? "THOM — brand" : "THOM — home"}
      >
        <ThomLogo variant="header" motion="compact" />
      </Link>
      <nav aria-label="Primary navigation">
        <Link to="/writing">Writings</Link>
      </nav>
    </header>
  );
}
