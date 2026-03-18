import Link from "next/link";

const links = [
  { href: "/#catalogue", label: "Boutique" },
  { href: "/culture", label: "Culture & Histoire" },
  { href: "/language", label: "Apprentissage" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="font-display text-lg tracking-tight text-zinc-950"
        >
          An ka dambe
        </Link>

        <nav
          aria-label="Navigation principale"
          className="flex flex-wrap items-center gap-2"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-black/5 bg-white/70 px-4 py-2 text-sm font-medium text-earth transition hover:border-ochre/40 hover:bg-amber-50 hover:text-clay"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
