import { api, HydrateClient } from "~/trpc/server";
import { DashboardContent } from "../_components/dashboard-page";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Verwalte dein Plyst-Profil.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await api.block.getAll.prefetch();
  return (
    <HydrateClient>
      <DashboardContent />
    </HydrateClient>
  );
}
