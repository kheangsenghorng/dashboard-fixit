
import CouponRegistryCompany from "../../../Components/company/coupon/CouponRegistryCompany";
import AdminShell from "../../admin/AdminShell";


export const metadata = {
  title: "Owner | New Service",
  description: "Manage system types and configurations",
};

export default function Page() {
  return (
    <AdminShell>
      <CouponRegistryCompany />
    </AdminShell>
  );
}