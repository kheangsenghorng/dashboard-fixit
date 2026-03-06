

import CreateTypePage from "../../../../Components/admin/create/types/CreateTypePage";
import AdminShell from "../../AdminShell";

export const metadata = {
  title: "Create || Type",
  description: "Overview of system activity",
};

export default function Page() {
  return (
    <AdminShell>
    <CreateTypePage />
  </AdminShell>
  );

}
