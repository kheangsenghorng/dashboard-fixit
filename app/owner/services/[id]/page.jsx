import ServiceDetailPage from "../../../../Components/company/services/ServiceDetailPage";

import AdminShell from "../../../admin/AdminShell";

export const metadata = {
  title: "Owner | Service Management",
  description: "Manage system types and configurations",
};

export default function Page() {
  return (
    <AdminShell>
      <ServiceDetailPage />
    </AdminShell>
  );
}
