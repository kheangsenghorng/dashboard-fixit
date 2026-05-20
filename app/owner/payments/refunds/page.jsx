import RefundsCompanyPage from "../../../../Components/company/RefundsPage/RefundsCompanyPage";
import AdminShell from "../../../admin/AdminShell";

export const metadata = {
  title: "Admin Dashboard",
  description: "Overview of system activity",
};

export default function Page() {
  return (
    <AdminShell>
      <RefundsCompanyPage />
    </AdminShell>
  );
}
