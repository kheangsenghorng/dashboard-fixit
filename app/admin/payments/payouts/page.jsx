import AdminShell from "../../AdminShell";
import AdminPayoutPage from "../../../../Components/admin/payouts/payouts";

export const metadata = {
  title: "Payouts – Admin Panel",
  description: "View system analytics",
};

export default function Page() {
  return (
    <AdminShell>
      <AdminPayoutPage />
    </AdminShell>
  );
}
