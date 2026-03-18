import Navbar from "@/components/Navbar";
import { getCultureContents, type CultureContent } from "@/lib/api";

export const dynamic = "force-dynamic";

const typeLabels: Record<CultureContent["type_contenu"], string> = {
  conte: "Conte",
  histoire: "Histoire",
  site_touristique: "Site touristique",
};

export default async function CulturePage() {
  let contents = await getCultureContents().catch(() => null);
  const errorMessage =
    contents === null
      ? "Impossible de charger les récits et sites culturels pour le moment. Vérifie que l'API FastAPI tourne sur http://127.0.0.1:8000."
      : null;

  if (contents === null) {
    contents = [];
  }

  return (
    <div className="min-h-screen bg-sand">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-5 py-10">
        <section className="bg-loom relative overflow-hidden rounded-3xl border border-black/5 p-8 shadow-sm sm:p-12">
          <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-[rgba(212,154,38,0.20)] blur-3xl" />
          <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[rgba(92,59,34,0.12)] blur-3xl" />

          <div className="relative max-w-3xl">
            <p className="inline-flex items-center rounded-full border border-black/5 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-earth">
              Culture & Tourisme
            </p>
            <h1 className="font-display mt-6 text-4xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-5xl">
              Histoires fondatrices, mémoire vivante et lieux à transmettre
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
              Explorez les récits majeurs du Mali, des contes mandingues aux
              grands repères historiques, dans une lecture calme et accessible.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-earth/70">
                Collection éditoriale
              </p>
              <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-ink">
                Cartes d&apos;histoire
              </h2>
            </div>
            <div className="text-sm text-muted">
              {contents.length} récit{contents.length > 1 ? "s" : ""} disponible
              {contents.length > 1 ? "s" : ""}
            </div>
          </div>

          {errorMessage ? (
            <div className="mt-6 rounded-2xl border border-black/5 bg-paper p-6 text-sm leading-7 text-muted">
              {errorMessage}
            </div>
          ) : contents.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-black/5 bg-paper p-6 text-sm leading-7 text-muted">
              Aucun contenu culturel n&apos;est encore publié.
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {contents.map((content) => (
                <article
                  key={content.id}
                  className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-paper shadow-sm"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-earth via-ochre to-clay" />

                  {content.image_url ? (
                    <div className="relative h-56 overflow-hidden bg-zinc-100">
                      <img
                        src={content.image_url}
                        alt={content.titre}
                        className="h-full w-full object-cover"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                    </div>
                  ) : (
                    <div className="bg-loom relative h-40 border-b border-black/5">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,154,38,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(92,59,34,0.12),transparent_40%)]" />
                    </div>
                  )}

                  <div className="relative p-7 sm:p-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-black/5 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-earth">
                        {typeLabels[content.type_contenu]}
                      </span>
                      <span className="text-xs uppercase tracking-[0.2em] text-muted/70">
                        Héritage malien
                      </span>
                    </div>

                    <h3 className="font-display mt-5 text-3xl font-semibold leading-tight text-ink">
                      {content.titre}
                    </h3>

                    <p className="mt-5 text-base leading-8 text-muted">
                      {content.contenu_texte}
                    </p>

                    <div className="mt-8 rounded-2xl border border-black/5 bg-white/70 p-4 text-sm leading-7 text-earth">
                      Lecture pensée pour une consultation lente, avec un ton
                      éditorial et lisible sur mobile comme sur desktop.
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
