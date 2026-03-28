import { Link } from "@tanstack/react-router";

interface BreadcrumbItem {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-3 text-sm font-medium">
      {items.map((item, i) => (
        <div key={item.label} className="flex items-center gap-3">
          {i > 0 && <span className="text-text-muted opacity-30">/</span>}
          {item.to ? (
            <Link
              to={item.to}
              className="text-text-secondary hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white font-bold">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
