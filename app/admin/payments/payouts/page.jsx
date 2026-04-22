import AdminShell from "../../AdminShell";
import PaymentPage from "../../../../Components/admin/payment/PaymentPage";

export const metadata = {
  title: "Analytics – Admin Panel",
  description: "View system analytics",
};

export default function Page() {
  return (
    <AdminShell>
      <PaymentPage />
    </AdminShell>
  );
}
