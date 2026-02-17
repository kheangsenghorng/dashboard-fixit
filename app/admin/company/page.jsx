// app/admin/edit/users/[id]/page.jsx


import CompanyOwnerPage from "../../../Components/admin/company/CompanyOwnerPage";
import AdminShell from "../AdminShell";


export const metadata = {
  title: "Edit Company | Admin Panel",
  description: "Update company metadata, branding, and account executive assignments.",
};


export default function Page() {
  return (
    <AdminShell>
      <CompanyOwnerPage />
    </AdminShell>
  );
}
