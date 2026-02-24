import CreateCompanyPage from "@/Components/admin/company/create/CreateCompany";
import AdminShell from "../../AdminShell";



export const metadata = {
  title: "Analytics – Admin Panel",
  description: "View system analytics",
};

export default function Page() {
  return (
    <AdminShell>
      <CreateCompanyPage />
    </AdminShell>
  );
}
