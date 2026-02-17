import AdminShell from "../AdminShell";
import AnalyticsPage from "../../../Components/admin/analytics/AnalyticsPage";

export const metadata = {
  title: "Analytics – Admin Panel",
  description: "View system analytics",
};

export default function Page() {
  return (
    <AdminShell>
      <AnalyticsPage />
    </AdminShell>
  );
}
