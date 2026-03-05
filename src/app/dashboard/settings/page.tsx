import { api, HydrateClient } from "~/trpc/server";
import { DashboardContent } from "../../_components/dashboard-page";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Einstellungen",
  description: "Verwalte dein Plyst-Profil und deinen Account.",
};

export const dynamic = "force-dynamic";

export default async function DashboardSettingsPage() {
  await api.block.getAll.prefetch();

  return (
    <HydrateClient>
      <DashboardContent initialTab="settings" />
    </HydrateClient>
  );
}

