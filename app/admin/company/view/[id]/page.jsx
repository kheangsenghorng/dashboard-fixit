import DocumentManagementPage from "../../../../../Components/admin/company/documents/DocumentManagementPage";
import CompanyView from "../../../../../Components/admin/company/view/CompanyView";

import AdminShell from "../../../AdminShell";


export const metadata = {
  title: "Viwe doucment Company | Admin Panel",
  description: "Update company metadata, branding, and account executive assignments.",
};


export default function Page() {
  return (
    <AdminShell>
      <CompanyView />
    </AdminShell>
  );
}
