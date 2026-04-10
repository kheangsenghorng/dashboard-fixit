
import AdminShell from "../../admin/AdminShell";
import CouponRegistry from "../../../Components/admin/coupon/CouponRegistry";


export const metadata = {
  title: "Viwe doucment Company | Admin Panel",
  description: "Update company metadata, branding, and account executive assignments.",
};


export default function Page() {
  return (
    <AdminShell>
      <CouponRegistry />
    </AdminShell>
  );
}
