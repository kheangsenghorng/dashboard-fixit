import AdminShell from "../../AdminShell";
import AdminPayoutPage from "../../../../Components/admin/payouts/payouts";

export const metadata = {
  title: "Analytics – Admin Panel",
  description: "View system analytics",
};

export default function Page() {
  return (
    <AdminShell>
      <AdminPayoutPage />
    </AdminShell>
  );
}
