import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";

import Navbar from "@/components/Navbar";
import { buildProductWhatsAppLink, formatFcfa, getProduct } from "@/lib/api";

export const dynamic = "force-dynamic";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const productId = Number.parseInt(id, 10);

  if (Number.isNaN(productId)) {
    notFound();
  }

  const product = await getProduct(productId);

  if (!product) {
    notFound();
  }

  const whatsappHref = buildProductWhatsAppLink(product);

  return (
    <div className="min-h-screen bg-sand">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-5 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-earth transition hover:text-clay"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Retour au catalogue
        </Link>

        <section className="bg-loom mt-6 overflow-hidden rounded-[2rem] border border-black/5 shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[360px] bg-zinc-100">
              <img
                src={product.image_url}
                alt={product.nom}
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>

            <div className="flex flex-col justify-between gap-8 p-8 sm:p-10">
              <div>
                <p className="inline-flex rounded-full border border-black/5 bg-white/70 px-4 py-2 text-xs font-semibold tracking-wide text-earth">
                  Piece artisanale malienne
                </p>

                <h1 className="font-display mt-5 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                  {product.nom}
                </h1>

                <div className="mt-5 inline-flex rounded-full bg-amber-50 px-4 py-2 text-lg font-semibold text-amber-800">
                  {formatFcfa(product.prix_fcfa)}
                </div>

                <p className="mt-6 text-base leading-8 text-zinc-700">
                  {product.description}
                </p>

                <div className="mt-8 rounded-2xl border border-black/5 bg-white/80 p-5 text-sm leading-7 text-muted">
                  Echange direct avec l'artisan sur WhatsApp pour confirmer la
                  disponibilite, la livraison et les details de la commande.
                </div>
              </div>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!whatsappHref}
                className={[
                  "inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition",
                  whatsappHref
                    ? "bg-amber-600 text-white hover:bg-amber-700"
                    : "cursor-not-allowed bg-zinc-200 text-zinc-500",
                ].join(" ")}
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Acheter via WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
