import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-size-[3rem_3rem]">
          <div className="absolute inset-0 bg-white mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,transparent_0%,#fff_100%)]"></div>
        </div>
        <h1 className="font-display text-center text-5xl font-bold tracking-tighter text-slate-900 md:text-8xl">
          Plyst ist deine <br />
          <span className="text-blue-600">digitale Identität</span>
        </h1>
        <p className="font-body mt-6 max-w-xl text-center text-lg leading-relaxed text-slate-500 md:text-xl">
          Erstelle in Sekunden eine wunderschöne Landingpage für deine Links und
          Socials. Komplett anpassbar, extrem schnell.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <button className="rounded-full bg-slate-900 px-8 py-4 font-semibold text-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all hover:scale-105 hover:bg-black active:scale-95">
            Kostenlos starten
          </button>
          <button className="rounded-full border border-slate-200 bg-white px-8 py-4 text-slate-600 hover:border-slate-300 hover:bg-slate-50">
            Demo ansehen
          </button>
        </div>
      </section>
    </HydrateClient>
  );
}
