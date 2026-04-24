

import BookingDetail from "../../../../../Components/company/booking/detail/BookingDetail";
import AdminShell from "../../../../admin/AdminShell"


export const metadata = {
  title: "Owner | New Service",
  description: "Manage system types and configurations",
};

export default function Page() {
  return (
    <AdminShell>
      <BookingDetail />
    </AdminShell>
  );
}