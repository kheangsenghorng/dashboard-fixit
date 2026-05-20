import RefundsPage from "../../../../Components/admin/refunds/RefundsPage";
import AdminShell from "../../AdminShell";

export const metadata = {
  title: "Admin Dashboard",
  description: "Overview of system activity",
};

export default function Page() {
  return (
    <AdminShell>
      <RefundsPage />
    </AdminShell>
  );
}
