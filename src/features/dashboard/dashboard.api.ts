import { apiClient } from "@/lib/api/client";

import type { DashboardData } from "./dashboard.types";

export async function getDashboard(): Promise<DashboardData> {
  return apiClient<DashboardData>("/api/dashboard");
}
