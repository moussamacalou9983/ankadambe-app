import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const currentYear = new Date().getFullYear();

  let products = await getProducts().catch(() => null);
  const errorMessage =
    products === null
      ? "Impossible de charger le catalogue pour le moment. Vérifie que l'API FastAPI tourne sur http://127.0.0.1:8000."
      : null;

  if (products === null) {
    products = [];
  }

  return (
    <div className="min-h-screen bg-sand">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-5 py-10">
        <section className="bg-loom relative overflow-hidden rounded-3xl border border-black/5 p-8 shadow-sm sm:p-12">
          <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[rgba(212,154,38,0.22)] blur-3xl" />
          <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-[rgba(92,59,34,0.14)] blur-3xl" />

          <div className="relative">
            <p className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/70 px-4 py-2 text-xs font-semibold tracking-wide text-earth">
              Marketplace culturelle du Mali
            </p>

            <h1 className="font-display mt-6 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl">
              L'authenticité de l'artisanat malien chez vous
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              Bogolans, sculptures, bijoux touaregs: des pièces faites main,
              directement depuis les ateliers.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#catalogue"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-ochre px-5 text-sm font-semibold text-white transition hover:bg-clay"
              >
                Voir le catalogue
              </a>
              <div className="text-sm text-muted">
                Achat via WhatsApp aujourd'hui, Mobile Money bientôt.
              </div>
            </div>
          </div>
        </section>

        <section id="catalogue" className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
              Catalogue
            </h2>
            <div className="text-sm text-muted">
              {products.length} produit{products.length > 1 ? "s" : ""}
            </div>
          </div>

          {errorMessage ? (
            <div className="mt-6 rounded-2xl border border-black/5 bg-paper p-6 text-sm text-muted">
              {errorMessage}
            </div>
          ) : products.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-black/5 bg-paper p-6 text-sm text-muted">
              Aucun produit pour le moment.
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        <footer className="mt-16 pb-10 text-xs text-muted">
          © {currentYear} An ka dambé. Artisanat malien, fait avec soin.
        </footer>
      </main>
    </div>
  );
}
