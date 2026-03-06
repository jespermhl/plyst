import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

function normalizeClerkError(error: unknown): {
  status?: number;
  code?: string;
  message?: string;
} | null {
  if (!error || typeof error !== "object") return null;

  const anyError = error as Record<string, unknown>;

  const status =
    typeof anyError.status === "number" ? anyError.status : undefined;

  const errorArray = Array.isArray(anyError.errors)
    ? (anyError.errors as unknown[])
    : undefined;

  const firstError =
    errorArray && errorArray.length > 0
      ? (errorArray[0] as Record<string, unknown>)
      : undefined;
  const codeFromErrors =
    firstError && typeof firstError.code === "string"
      ? (firstError.code)
      : undefined;

  const code =
    typeof anyError.code === "string" ? anyError.code : codeFromErrors;

  const message =
    typeof anyError.message === "string" ? anyError.message : undefined;

  return { status, code, message };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  let data;
  try {
    data = await api.block.getPublicProfile({ handle });
    if (!data?.profile) {
      return notFound();
    }
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      return notFound();
    }
    throw error;
  }

  let clerkUser = null;
  try {
    const client = await clerkClient();
    clerkUser = await client.users.getUser(data.profile.clerkId);
  } catch (error) {
    const info = normalizeClerkError(error);
    console.error("Clerk API Error in PublicProfilePage", info ?? {});
  }

  return (
    <div className="font-body min-h-screen bg-[#fafafa] px-6 text-slate-900">
      <div className="mx-auto max-w-2xl pt-20 pb-10 text-center">
        <div className="mx-auto mb-6 h-24 w-24 rounded-full border-[3px] border-blue-500/10 p-2 shadow-sm">
          {clerkUser?.imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={clerkUser.imageUrl}
              alt={clerkUser.username ?? "Profile"}
              className="h-full w-full rounded-full bg-slate-100 object-cover"
            />
          ) : (
            <div className="h-full w-full rounded-full bg-slate-200" />
          )}
        </div>

        <h1 className="font-display text-2xl font-bold tracking-tight">
          {data.profile.displayName ?? `@${handle}`}
        </h1>

        {data.profile.bio && (
          <p className="mx-auto mt-3 max-w-sm leading-relaxed text-slate-500">
            {data.profile.bio}
          </p>
        )}

        <div className="mt-12 flex flex-col gap-4">
          {data.blocks.map((block) =>
            block.url ? (
              <a
                key={block.id}
                href={
                  block.url.startsWith("http")
                    ? block.url
                    : `https://${block.url}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex w-full items-center justify-center rounded-4xl border border-slate-100 bg-white px-6 py-5 font-bold shadow-sm transition-all hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
              >
                {block.title ?? "Unbenannt"}
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
            ) : (
              <div
                key={block.id}
                className="group relative flex w-full items-center justify-center rounded-4xl border border-dashed border-slate-200 bg-slate-50 px-6 py-5 font-bold text-slate-400"
                aria-disabled="true"
              >
                {block.title ?? "Ohne Titel"}
                <span className="ml-2 text-xs font-normal text-slate-400">
                  (kein Link hinterlegt)
                </span>
              </div>
            ),
          )}
        </div>

        <div className="mt-20 opacity-20 transition-opacity hover:opacity-100">
          <p className="font-display text-[10px] font-black tracking-[0.4em] uppercase">
            plyst.cc
          </p>
        </div>
      </div>
    </div>
  );
}
