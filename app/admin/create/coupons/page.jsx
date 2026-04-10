
import AdminShell from "../../AdminShell";
import CreateCoupon from "../../../../Components/admin/create/coupon/CreateCoupon";



export const metadata = {
  title: "Analytics – Admin Panel",
  description: "View system analytics",
};

export default function Page() {
  return (
    <AdminShell>
      <CreateCoupon />
    </AdminShell>
  );
}
