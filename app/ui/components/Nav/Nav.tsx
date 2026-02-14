import { TabNav } from "@radix-ui/themes";
import { Link, useLocation } from "react-router";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/conversations", label: "Conversations" },
  { to: "/alerts", label: "Alerts" },
] as const;

export function Nav() {
  const { pathname } = useLocation();

  return (
    <nav className="py-2">
      <TabNav.Root justify="start">
        {navItems.map(({ to, label }) => (
          <TabNav.Link
            key={to}
            asChild
            active={to === "/" ? pathname === "/" : pathname.startsWith(to)}
          >
            <Link to={to}>{label}</Link>
          </TabNav.Link>
        ))}
      </TabNav.Root>
    </nav>
  );
}
