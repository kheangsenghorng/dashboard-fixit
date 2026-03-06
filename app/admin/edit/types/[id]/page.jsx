// app/admin/edit/users/[id]/page.jsx

import EditTypePage from "../../../../../Components/admin/edit/types/EditTypePage";
import AdminShell from "../../../AdminShell";

export const metadata = {
  title: "Edit Types – Admin Panel",
  description: "Edit system user details",
};

export default function Page() {
  return (
    <AdminShell>
      <EditTypePage />
    </AdminShell>
  );
}
