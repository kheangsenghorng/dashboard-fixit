// app/admin/edit/users/[id]/page.jsx

import EditCompany from "../../../../../Components/admin/edit/company/Company";
import AdminShell from "../../../AdminShell";


export const metadata = {
  title: "Company Edit – Admin Panel",
  description: "Manage and update company owner information",

};

export default function Page() {
  return (
    <AdminShell>
      <EditCompany />
    </AdminShell>
  );
}
