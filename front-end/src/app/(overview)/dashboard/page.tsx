import { Metadata } from "next";

import DashboardClient from "@/app/_ui/dashboard/dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function Dashboard() {
  return <DashboardClient />;
}
