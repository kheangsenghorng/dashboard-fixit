// app/admin/edit/users/[id]/page.jsx


import EditCoupon from "../../../../../Components/admin/edit/coupon/EditCoupon";
import AdminShell from "../../../AdminShell";


export const metadata = {
  title: "Company Edit – Admin Panel",
  description: "Manage and update company owner information",

};

export default function Page() {
  return (
    <AdminShell>
      <EditCoupon />
    </AdminShell>
  );
}
