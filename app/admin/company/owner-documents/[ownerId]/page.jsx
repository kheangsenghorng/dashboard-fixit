import DocumentManagementPage from "../../../../../Components/admin/company/documents/DocumentManagementPage";

import AdminShell from "../../../AdminShell";


export const metadata = {
  title: "Viwe doucment Company | Admin Panel",
  description: "Update company metadata, branding, and account executive assignments.",
};


export default function Page() {
  return (
    <AdminShell>
      <DocumentManagementPage />
    </AdminShell>
  );
}
