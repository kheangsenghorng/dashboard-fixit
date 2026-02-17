// app/admin/analytics/page.jsx
import UsersPage from "../../../Components/admin/users/UsersPage";
import AdminShell from "../AdminShell";               // client layout
     // client page

export const metadata = {
  title: "Users – Admin Panel",
  description: "View system analytics",
};

export default function Page() {
  return (
    <AdminShell>
      <UsersPage />
    </AdminShell>
  );
}
