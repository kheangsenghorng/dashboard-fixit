
import ComingSoon from "../../../Components/ComingSoon";
import AdminShell from "../../admin/AdminShell";

export const metadata = {
  title: "Analytics – Admin Panel",
  description: "View system analytics",
};

export default function Page() {
  return (
    <AdminShell>
      <ComingSoon />
    </AdminShell>
  );
}
