import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const client = await clerkClient();

  const users = await client.users.getUserList({
    username: [handle],
    limit: 1,
  });

  const clerkUser = users.data[0];
  if (!clerkUser) return notFound();

  try {
    const data = await api.block.getPublicProfile({ handle });

    return (
      <div className="font-body min-h-screen bg-[#fafafa] px-6 text-slate-900">
        <div className="mx-auto max-w-2xl pt-20 pb-10 text-center">
          <div className="mx-auto mb-6 h-24 w-24 rounded-full border-[3px] border-blue-500/10 p-2 shadow-sm">
            <img
              src={clerkUser.imageUrl}
              alt={clerkUser.username ?? "Profile"}
              className="h-full w-full rounded-full bg-slate-100 object-cover"
            />
          </div>

          <h1 className="font-display text-2xl font-bold tracking-tight">
            {clerkUser.username ?? `@${handle}`}
          </h1>

          {data.profile?.bio && (
            <p className="mx-auto mt-3 max-w-sm leading-relaxed text-slate-500">
              {data.profile?.bio}
            </p>
          )}

          <div className="mt-12 flex flex-col gap-4">
            {data.blocks.map((block) => (
              <a
                key={block.id}
                href={
                  block.url
                    ? block.url.startsWith("http")
                      ? block.url
                      : `https://${block.url}`
                    : "#"
                }
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

          <div className="mt-20 opacity-20 transition-opacity hover:opacity-100">
            <p className="font-display text-[10px] font-black tracking-[0.4em] uppercase">
              plyst.cc
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
