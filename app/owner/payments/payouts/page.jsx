
import AdminShell from "../../../admin/AdminShell";
import PayoutPage from "../../../../Components/company/payouts/payouts";
export const metadata = {
  title: "Owner | Service Management",
  description: "Manage system types and configurations",
};

export default function Page() {
  return (
    <AdminShell>
      <PayoutPage />
    </AdminShell>
  );
}
