
import AdminShell from "../../admin/AdminShell"
import OwnerSettings from "../../../Components/company/settings/OwnerSettings";


export const metadata = {
  title: "Owner | Company Settings",
  description: "Manage system types and configurations",
};

export default function Page() {
  return (
    <AdminShell>
      <OwnerSettings />
    </AdminShell>
  );
}