import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="font-body relative flex min-h-screen items-center justify-center overflow-hidden bg-white">
      {/* Dein Raster-Hintergrund vom Hero (Wiedererkennungswert!) */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-size-[3rem_3rem]">
        <div className="absolute inset-0 bg-white mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,transparent_0%,#fff_100%)]"></div>
      </div>

      <div className="flex flex-col items-center gap-8">
        {/* Kleines Branding über dem Formular */}
        <div className="font-display text-3xl font-black tracking-tighter text-slate-900">
          Plyst<span className="text-blue-600">.</span>
        </div>

        {/* Das eigentliche Clerk-Formular */}
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
              card: "shadow-2xl border border-slate-100 rounded-3xl",
            },
          }}
        />
      </div>
    </div>
  );
}
