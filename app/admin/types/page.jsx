
import TypeTablePage from "../../../Components/admin/type/TypeTablePage";
import AdminShell from "../AdminShell";

export const metadata = {
  title: "Admin | Type Registry",
  description: "Manage system types and configurations",
};

export default function Page() {
  return (
    <AdminShell>
      <TypeTablePage />
    </AdminShell>
  );
}