import CreateAccountPage from "../../../../Components/company/create/payment-account/create-account-page";
import AdminShell from "../../../admin/AdminShell";


export const metadata = {
  title: "Owner | Bookings Payments",
  description: "Manage booking payments",
};

export default function Page() {
  return (
    <AdminShell>
      <CreateAccountPage />
    </AdminShell>
  );
}