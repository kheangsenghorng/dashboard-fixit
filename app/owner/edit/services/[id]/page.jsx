
import EditServicePage from "../../../../../Components/company/edit/EditServicePage";
import AdminShell from "../../../../admin/AdminShell";


export const metadata = {
  title: "Owner | New Service",
  description: "Manage system types and configurations",
};

export default function Page() {
  return (
    <AdminShell>
      <EditServicePage />
    </AdminShell>
  );
}