import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import { type Metadata } from "next";

interface Props {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;

  try {
    const data = await api.block.getPublicProfile({ handle });
    const name = data.profile.displayName ?? `@${handle}`;
    const bio = data.profile.bio ?? `Check out ${name} on Plyst.`;

    return {
      title: name,
      description: bio,
      openGraph: {
        title: name,
        description: bio,
        type: "website",
      },
      twitter: {
        card: "summary",
        title: name,
        description: bio,
      },
    };
  } catch {
    return {
      title: "Profil nicht gefunden",
    };
  }
}

export default async function PublicProfilePage({ params }: Props) {
  const { handle } = await params;

  let data;
  try {
    data = await api.block.getPublicProfile({ handle });
  } catch {
    return notFound();
  }

  return (
    <div className="font-body min-h-screen bg-[#fafafa] text-slate-900">
      <div className="mx-auto max-w-2xl px-6 pt-20 pb-10 text-center">
        <div className="mx-auto mb-6 h-24 w-24 rounded-full border-[3px] border-blue-500/10 p-2 shadow-sm">
          <div className="h-full w-full rounded-full bg-slate-200" />
        </div>

        <h1 className="font-display text-2xl font-bold tracking-tight">
          {data.profile.displayName ?? `@${handle}`}
        </h1>
        {data.profile.bio && (
          <p className="mt-2 text-slate-500">{data.profile.bio}</p>
        )}

        <div className="mt-12 flex flex-col gap-4">
          {data.blocks.map((block) => (
            <a
              key={block.id}
              href={block.url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex w-full items-center justify-center rounded-4xl border border-slate-100 bg-white px-6 py-5 font-bold shadow-sm transition-all hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
            >
              {block.title}
              <div className="absolute right-6 opacity-0 transition-opacity group-hover:opacity-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-20 opacity-30">
          <p className="font-display text-xs font-black tracking-[0.3em] uppercase">
            plyst.cc
          </p>
        </div>
      </div>
    </div>
  );
}
