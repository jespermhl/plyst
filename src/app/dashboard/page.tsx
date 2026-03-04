import { api, HydrateClient } from "~/trpc/server";
import { DashboardContent } from "../_components/dashboard-page";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  void api.block.getAll.prefetch();
  return (
    <HydrateClient>
      <DashboardContent />
    </HydrateClient>
  );
}
