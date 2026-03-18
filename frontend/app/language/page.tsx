import { Volume2 } from "lucide-react";

import Navbar from "@/components/Navbar";
import { getLanguageLessons, type LanguageLesson } from "@/lib/api";

export const dynamic = "force-dynamic";

const categoryLabels: Record<LanguageLesson["categorie"], string> = {
  vocabulaire: "Vocabulaire",
  expression: "Expression",
  grammaire: "Grammaire",
};

export default async function LanguagePage() {
  let lessons = await getLanguageLessons().catch(() => null);
  const errorMessage =
    lessons === null
      ? "Impossible de charger les leçons de bambara pour le moment. Vérifie que l'API FastAPI tourne sur http://127.0.0.1:8000."
      : null;

  if (lessons === null) {
    lessons = [];
  }

  return (
    <div className="min-h-screen bg-sand">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-5 py-10">
        <section className="bg-loom relative overflow-hidden rounded-3xl border border-black/5 p-8 shadow-sm sm:p-12">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[rgba(212,154,38,0.18)] blur-3xl" />
          <div className="pointer-events-none absolute left-0 bottom-0 h-72 w-72 rounded-full bg-[rgba(92,59,34,0.12)] blur-3xl" />

          <div className="relative max-w-3xl">
            <p className="inline-flex items-center rounded-full border border-black/5 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-earth">
              Apprentissage
            </p>
            <h1 className="font-display mt-6 text-4xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-5xl">
              Premières expressions en bambara, sous forme de fiches claires
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
              Une interface simple pour mémoriser du vocabulaire utile, avec la
              traduction et le contexte d&apos;usage directement visibles.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-earth/70">
                Fiches de vocabulaire
              </p>
              <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-ink">
                Bambara essentiel
              </h2>
            </div>
            <div className="text-sm text-muted">
              {lessons.length} fiche{lessons.length > 1 ? "s" : ""} disponible
              {lessons.length > 1 ? "s" : ""}
            </div>
          </div>

          {errorMessage ? (
            <div className="mt-6 rounded-2xl border border-black/5 bg-paper p-6 text-sm leading-7 text-muted">
              {errorMessage}
            </div>
          ) : lessons.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-black/5 bg-paper p-6 text-sm leading-7 text-muted">
              Aucune leçon de langue n&apos;est encore publiée.
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {lessons.map((lesson) => (
                <article
                  key={lesson.id}
                  className="overflow-hidden rounded-[2rem] border border-black/5 bg-paper shadow-sm"
                >
                  <div className="bg-[linear-gradient(135deg,rgba(212,154,38,0.18),rgba(200,106,43,0.08))] p-6 sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="rounded-full border border-black/5 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-earth">
                          {categoryLabels[lesson.categorie]}
                        </span>
                        <h3 className="font-display mt-5 text-3xl font-semibold leading-tight text-ink">
                          {lesson.mot_francais}
                        </h3>
                      </div>

                      <button
                        type="button"
                        disabled
                        className="inline-flex h-11 items-center gap-2 rounded-xl border border-black/5 bg-white/80 px-4 text-sm font-semibold text-earth opacity-70"
                      >
                        <Volume2 className="h-4 w-4" aria-hidden="true" />
                        Écouter
                      </button>
                    </div>

                    <p className="mt-6 text-xl font-semibold text-clay sm:text-2xl">
                      {lesson.traduction_bambara}
                    </p>
                  </div>

                  <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-7">
                    <div className="rounded-2xl border border-black/5 bg-white/80 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-earth/70">
                        Exemple français
                      </p>
                      <p className="mt-3 text-base leading-8 text-muted">
                        {lesson.exemple_francais}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-black/5 bg-white/80 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-earth/70">
                        Exemple bambara
                      </p>
                      <p className="mt-3 text-base leading-8 text-muted">
                        {lesson.exemple_bambara}
                      </p>
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
