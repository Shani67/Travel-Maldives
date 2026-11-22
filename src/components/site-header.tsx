import Link from "next/link";

const navigation = [
  { href: "/destinations", label: "Destinations" },
  { href: "/plan", label: "Plan a trip" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-foam bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-semibold whitespace-nowrap"
        >
          <svg aria-hidden="true" viewBox="0 0 32 32" className="size-8">
            <circle cx="16" cy="16" r="15" className="fill-foam" />
            <ellipse cx="16" cy="17" rx="9" ry="5" className="fill-lagoon" />
            <ellipse cx="16" cy="17" rx="5" ry="2.5" className="fill-sand" />
          </svg>
          Travel Maldives
        </Link>
        <nav aria-label="Main">
          <ul className="flex items-center gap-1 sm:gap-3">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-full px-2 py-2 text-sm font-medium hover:bg-foam sm:px-3"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
