import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="font-body relative flex min-h-screen items-center justify-center overflow-hidden bg-white">
      {/* Das bewährte Raster für das Branding */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-size-[3rem_3rem]">
        <div className="absolute inset-0 bg-white mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,transparent_0%,#fff_100%)]"></div>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="font-display text-3xl font-black tracking-tighter text-slate-900">
          Plyst<span className="text-blue-600">.</span>
        </div>

        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-blue-600 hover:bg-blue-700 text-sm normal-case shadow-none",
              card: "shadow-2xl border border-slate-100 rounded-3xl",
              headerTitle: "font-display text-2xl font-bold tracking-tight",
              headerSubtitle: "font-body text-slate-500",
            },
          }}
        />
      </div>
    </div>
  );
}
