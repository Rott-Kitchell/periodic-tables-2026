import { Metadata } from "next";

import DashboardClient from "@/app/_ui/dashboard/dashboard-client";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <DashboardClient />
    </Suspense>
  );
}
