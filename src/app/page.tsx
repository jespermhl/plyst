import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { HydrateClient } from "~/trpc/server";
import { WaitlistForm } from "./_components/waitlist-form";

const Navbar = () => (
  <nav className="fixed top-0 right-0 left-0 z-50 flex justify-center p-4">
    <div className="flex h-16 w-full max-w-7xl items-center rounded-2xl border border-slate-200/50 bg-white/70 px-6 shadow-sm backdrop-blur-xl">
      <div className="font-display text-xl font-black tracking-tight text-slate-900">
        Plyst<span className="text-blue-600">.</span>
      </div>

      <div className="ml-10 hidden gap-8 md:flex">
        {["Features", "Preise", "Showcase"].map((item) => (
          <a
            key={item}
            href="#"
            className="font-body text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            {item}
          </a>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-4">
        <SignedOut>
          <Link href="/sign-in">
            <button className="font-body text-sm font-semibold text-slate-900 hover:text-slate-600">
              Login
            </button>
          </Link>
          <Link href="/sign-up">
            <button className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all hover:bg-black active:scale-95">
              Kostenlos starten
            </button>
          </Link>
        </SignedOut>
        <SignedIn>
          <Link href="/dashboard">
            <button className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all hover:bg-black active:scale-95">
              Dashboard
            </button>
          </Link>
        </SignedIn>
      </div>
    </div>
  </nav>
);

export default async function Home() {
  return (
    <HydrateClient>
      <Navbar />
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

        <WaitlistForm />

        <div className="mt-8 flex items-center gap-2">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-8 w-8 rounded-full border-2 border-white bg-slate-200"
              />
            ))}
          </div>
          <p className="text-xs font-medium tracking-widest text-slate-400 uppercase">
            67+ Creator warten bereits
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-32">
        <div className="mb-16 text-center">
          <p className="font-body text-sm font-semibold tracking-widest text-blue-600 uppercase">
            Features
          </p>
          <h2 className="font-display mt-3 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Alles, was du brauchst
          </h2>
          <p className="font-body mx-auto mt-4 max-w-lg text-base leading-relaxed text-slate-500">
            Von individuellen Designs bis hin zu detaillierten Analytics – Plyst
            gibt dir die volle Kontrolle.
          </p>
        </div>

        <div className="grid auto-rows-[minmax(200px,auto)] grid-cols-1 gap-4 md:grid-cols-3">
          <div className="group relative row-span-2 overflow-hidden rounded-3xl border border-slate-200/60 bg-linear-to-br from-blue-50 to-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100/40">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"
                />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900">
              Custom Designs
            </h3>
            <p className="font-body mt-3 text-sm leading-relaxed text-slate-500">
              Wähle aus hunderten Templates oder erstelle dein eigenes Design
              von Grund auf. Farben, Schriften, Layouts – alles anpassbar.
            </p>
            <div className="pointer-events-none absolute -right-8 -bottom-8 h-40 w-40 rounded-full bg-blue-200/30 blur-2xl transition-all group-hover:bg-blue-300/40" />
          </div>

          <div className="group relative col-span-1 overflow-hidden rounded-3xl border border-slate-200/60 bg-linear-to-br from-violet-50 to-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100/40 md:col-span-2">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 transition-colors group-hover:bg-violet-600 group-hover:text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900">
              Detaillierte Analytics
            </h3>
            <p className="font-body mt-3 max-w-md text-sm leading-relaxed text-slate-500">
              Sieh in Echtzeit, wer deine Seite besucht. Klicks, Views und
              Conversions – alles in einem übersichtlichen Dashboard.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-linear-to-br from-amber-50 to-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-100/40">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 transition-colors group-hover:bg-amber-600 group-hover:text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900">
              Smart Links
            </h3>
            <p className="font-body mt-3 text-sm leading-relaxed text-slate-500">
              Verknüpfe alle deine Socials, Shops und Projekte an einem Ort.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-linear-to-br from-emerald-50 to-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100/40">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900">
              Blitzschnell
            </h3>
            <p className="font-body mt-3 text-sm leading-relaxed text-slate-500">
              Edge-optimiert und weltweit in unter 100ms geladen. Deine Besucher
              warten nie.
            </p>
          </div>

          <div className="group relative col-span-1 overflow-hidden rounded-3xl border border-slate-200/60 bg-linear-to-br from-rose-50 to-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-100/40 md:col-span-2">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 transition-colors group-hover:bg-rose-600 group-hover:text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900">
              Mobile First
            </h3>
            <p className="font-body mt-3 max-w-md text-sm leading-relaxed text-slate-500">
              Jede Seite sieht auf jedem Gerät perfekt aus. Responsives Design
              ist bei Plyst kein Nachgedanke – es ist der Standard.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-linear-to-br from-cyan-50 to-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-100/40">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600 transition-colors group-hover:bg-cyan-600 group-hover:text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900">
              Sicher & Privat
            </h3>
            <p className="font-body mt-3 text-sm leading-relaxed text-slate-500">
              SSL, DSGVO-konform und vollständig verschlüsselt. Deine Daten
              gehören dir.
            </p>
          </div>
        </div>
      </section>

      <footer className="relative mt-40 overflow-hidden border-t border-slate-200/60 bg-linear-to-b from-slate-50 to-white px-4 pt-20 pb-10">
        <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-64 w-[600px] -translate-x-1/2 rounded-full bg-blue-100/40 blur-3xl" />

        <div className="mx-auto flex max-w-7xl flex-col gap-16 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <div className="font-display text-2xl font-black tracking-tight text-slate-900">
              Plyst<span className="text-blue-600">.</span>
            </div>
            <p className="font-body mt-4 text-sm leading-relaxed text-slate-500">
              Die Plattform für Creator, die ihre digitale Präsenz auf das
              nächste Level heben wollen.
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition-all hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-600/20"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition-all hover:bg-linear-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white hover:shadow-lg hover:shadow-pink-500/20"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="TikTok"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition-all hover:bg-slate-900 hover:text-white hover:shadow-lg hover:shadow-slate-900/20"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13a8.28 8.28 0 005.58 2.17v-3.44a4.85 4.85 0 01-1.42-.23 4.83 4.83 0 01-1.58-.81V6.69h3z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 sm:grid-cols-3 sm:gap-16">
            <div className="flex flex-col gap-4">
              <h4 className="font-body text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                Produkt
              </h4>
              <nav className="flex flex-col gap-3">
                {["Features", "Preise", "Showcase"].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="font-body text-sm text-slate-600 transition-colors hover:text-blue-600"
                  >
                    {link}
                  </a>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-body text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                Rechtliches
              </h4>
              <nav className="flex flex-col gap-3">
                {["Datenschutz", "Impressum", "AGB"].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="font-body text-sm text-slate-600 transition-colors hover:text-blue-600"
                  >
                    {link}
                  </a>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-body text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                Support
              </h4>
              <nav className="flex flex-col gap-3">
                {["Hilfe", "Kontakt", "FAQ"].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="font-body text-sm text-slate-600 transition-colors hover:text-blue-600"
                  >
                    {link}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-slate-200/60 pt-8 sm:flex-row">
          <p className="font-body text-xs text-slate-400">
            © {new Date().getFullYear()} Plyst. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span>Gebaut mit</span>
            <span className="text-red-500">♥</span>
            <span>in Deutschland</span>
          </div>
        </div>
      </footer>
    </HydrateClient>
  );
}
