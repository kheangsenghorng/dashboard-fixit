import AdminDashboard from "../../../Components/admin/dashboard/AdminDashboard";
import AdminShell from "../AdminShell";


export const metadata = {
  title: "Admin Dashboard",
  description: "Overview of system activity",
};

export default function Page() {
  return (
    <AdminShell>
    <AdminDashboard />
  </AdminShell>
  );

}
