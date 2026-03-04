import CategoryTablePage from "../../../Components/admin/category/CategoryTablePage";

import AdminShell from "../AdminShell";


export const metadata = {
  title: "Admin Categories",
  description: "Overview of system activity",
};

export default function Page() {
  return (
    <AdminShell>
    <CategoryTablePage />
  </AdminShell>
  );

}
