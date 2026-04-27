
import CreateProvider from "../../../../Components/company/create/provider/ProvidersPage";

import AdminShell from "../../../admin/AdminShell";


export const metadata = {
  title: "Owner | New Service",
  description: "Manage system types and configurations",
};

export default function Page() {
  return (
    <AdminShell>
      <CreateProvider />
    </AdminShell>
  );
}