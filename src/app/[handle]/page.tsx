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
      ? firstError.code
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

  const rawTheme = data.profile.theme as Record<string, unknown> | null;
  const rawBtnTheme = rawTheme?.buttonStyle as Record<string, unknown> | null;

  const theme = {
    backgroundColor:
      typeof rawTheme?.backgroundColor === "string"
        ? rawTheme.backgroundColor
        : "#fafafa",
    textColor:
      typeof rawTheme?.textColor === "string" ? rawTheme.textColor : "#0f172a",
    fontFamily:
      typeof rawTheme?.fontFamily === "string" ? rawTheme.fontFamily : "Inter",
    buttonStyle: {
      backgroundColor:
        typeof rawBtnTheme?.backgroundColor === "string"
          ? rawBtnTheme.backgroundColor
          : "#ffffff",
      textColor:
        typeof rawBtnTheme?.textColor === "string"
          ? rawBtnTheme.textColor
          : "#0f172a",
      borderColor:
        typeof rawBtnTheme?.borderColor === "string"
          ? rawBtnTheme.borderColor
          : "#f1f5f9",
      borderWidth:
        typeof rawBtnTheme?.borderWidth === "number"
          ? rawBtnTheme.borderWidth
          : 1,
      borderRadius:
        typeof rawBtnTheme?.borderRadius === "number"
          ? rawBtnTheme.borderRadius
          : 24,
      shadow:
        typeof rawBtnTheme?.shadow === "string" ? rawBtnTheme.shadow : "sm",
    },
  };
  const btnTheme = theme.buttonStyle;

  return (
    <>
      <link
        href={`https://fonts.googleapis.com/css2?family=${theme.fontFamily.replace(/ /g, "+")}:wght@400;500;700;900&display=swap`}
        rel="stylesheet"
      />

      <div
        className="min-h-screen px-6 transition-colors duration-300"
        style={{
          backgroundColor: theme.backgroundColor,
          color: theme.textColor,
          fontFamily: `"${theme.fontFamily}", sans-serif`,
        }}
      >
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
              <div
                className="h-full w-full rounded-full"
                style={{ backgroundColor: theme.textColor, opacity: 0.1 }}
              />
            )}
          </div>

          <h1 className="text-2xl font-bold tracking-tight">
            {data.profile.displayName ?? `@${handle}`}
          </h1>

          {data.profile.bio && (
            <p
              className="mx-auto mt-3 max-w-sm leading-relaxed"
              style={{ opacity: 0.7 }}
            >
              {data.profile.bio}
            </p>
          )}

          <div className="mt-12 flex flex-col gap-4">
            {data.blocks.map((block) => {
              const shadowClass =
                {
                  none: "",
                  sm: "shadow-sm",
                  md: "shadow-md",
                  lg: "shadow-lg",
                  xl: "shadow-xl",
                }[btnTheme.shadow] ?? "shadow-sm";

              return block.url ? (
                <a
                  key={block.id}
                  href={
                    block.url.startsWith("http")
                      ? block.url
                      : `https://${block.url}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative flex w-full items-center justify-center px-6 py-5 font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${shadowClass}`}
                  style={{
                    backgroundColor: btnTheme.backgroundColor,
                    color: btnTheme.textColor,
                    borderColor: btnTheme.borderColor,
                    borderWidth: `${btnTheme.borderWidth}px`,
                    borderStyle: btnTheme.borderWidth > 0 ? "solid" : "none",
                    borderRadius: `${btnTheme.borderRadius}px`,
                  }}
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
                  className="group relative flex w-full items-center justify-center px-6 py-5 font-bold"
                  aria-disabled="true"
                  style={{
                    backgroundColor: btnTheme.backgroundColor,
                    color: theme.textColor,
                    opacity: 0.5,
                    borderStyle: "dashed",
                    borderColor: theme.textColor,
                    borderWidth: "1px",
                    borderRadius: `${btnTheme.borderRadius}px`,
                  }}
                >
                  {block.title ?? "Ohne Titel"}
                  <span className="ml-2 text-xs font-normal opacity-70">
                    (kein Link hinterlegt)
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-20 opacity-20 transition-opacity hover:opacity-100">
            <p className="font-display text-[10px] font-black tracking-[0.4em] uppercase">
              plyst.cc
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
