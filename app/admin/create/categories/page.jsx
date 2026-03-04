import CreateCategoryPage from "../../../../Components/admin/create/category/CreateCategoryPage";

import AdminShell from "../../AdminShell";

export const metadata = {
  title: "Create || Category",
  description: "Overview of system activity",
};

export default function Page() {
  return (
    <AdminShell>
    <CreateCategoryPage />
  </AdminShell>
  );

}
