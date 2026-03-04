
import AdminShell from "../../../admin/AdminShell";
import DocumentUploadPage from "../../../../Components/company/upload/DocumentUploadPage";


export const metadata = {
  title: "Viwe doucment Company | Admin Panel",
  description: "Update company metadata, branding, and account executive assignments.",
};


export default function Page() {
  return (
    <AdminShell>
     <DocumentUploadPage/>
    </AdminShell>
  );
}
