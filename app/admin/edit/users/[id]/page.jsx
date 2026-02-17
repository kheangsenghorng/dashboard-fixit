// app/admin/edit/users/[id]/page.jsx

import AdminShell from "../../../AdminShell";
import EditUserClient from "./EditUserClient"; // Client wrapper

export const metadata = {
  title: "Edit User – Admin Panel",
  description: "Edit system user details",
};

export default function Page() {
  return (
    <AdminShell>
      <EditUserClient />
    </AdminShell>
  );
}
