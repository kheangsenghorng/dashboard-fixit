
import AdminShell from "../../admin/AdminShell";
import CompanyDocumentDashboard from "../../../Components/company/Document/page";


export const metadata = {
  title: "Viwe doucment Company | Admin Panel",
  description: "Update company metadata, branding, and account executive assignments.",
};


export default function Page() {
  return (
    <AdminShell>
     <CompanyDocumentDashboard/>
    </AdminShell>
  );
}
