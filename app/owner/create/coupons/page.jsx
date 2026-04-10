import CreateCouponCompany from "../../../../Components/company/create/coupon/CreateCouponsCompany";
import AdminShell from "../../../admin/AdminShell";


export const metadata = {
  title: "Owner | New Service",
  description: "Manage system types and configurations",
};

export default function Page() {
  return (
    <AdminShell>
      <CreateCouponCompany />
    </AdminShell>
  );
}