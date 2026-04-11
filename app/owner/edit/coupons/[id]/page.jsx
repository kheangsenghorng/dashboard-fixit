
import EditCouponCompany from "../../../../../Components/company/edit/coupon/EditCouponCompany";
import AdminShell from "../../../../admin/AdminShell";


export const metadata = {
  title: "Owner | New Service",
  description: "Manage system types and configurations",
};

export default function Page() {
  return (
    <AdminShell>
      <EditCouponCompany />
    </AdminShell>
  );
}