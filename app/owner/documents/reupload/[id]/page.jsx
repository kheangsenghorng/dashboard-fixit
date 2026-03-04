
import ReuploadPage from "../../../../../Components/company/ReuploadPage";
import AdminShell from "../../../../admin/AdminShell";



export const metadata = {
  title: "Viwe doucment Company | Admin Panel",
  description: "Update company metadata, branding, and account executive assignments.",
};


export default function Page() {
  return (
    <AdminShell>
     <ReuploadPage/>
    </AdminShell>
  );
}
