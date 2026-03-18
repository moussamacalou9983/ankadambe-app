import Link from "next/link";
import { MessageCircle } from "lucide-react";

import {
  buildProductWhatsAppLink,
  formatFcfa,
  type Product,
} from "@/lib/api";

export default function ProductCard({ product }: { product: Product }) {
  const whatsappHref = buildProductWhatsAppLink(product);

  return (
    <article className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link
        href={`/product/${product.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-zinc-100"
        aria-label={`Voir le produit ${product.nom}`}
      >
        <img
          src={product.image_url}
          alt={product.nom}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-70" />
      </Link>

      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <Link
            href={`/product/${product.id}`}
            className="text-base font-semibold leading-snug text-zinc-950 transition hover:text-amber-700"
          >
            {product.nom}
          </Link>
          <div className="shrink-0 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-800">
            {formatFcfa(product.prix_fcfa)}
          </div>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-zinc-600">
          {product.description}
        </p>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!whatsappHref}
          className={[
            "mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition",
            whatsappHref
              ? "bg-amber-600 text-white hover:bg-amber-700"
              : "cursor-not-allowed bg-zinc-200 text-zinc-500",
          ].join(" ")}
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Acheter via WhatsApp
        </a>
      </div>
    </article>
  );
}
