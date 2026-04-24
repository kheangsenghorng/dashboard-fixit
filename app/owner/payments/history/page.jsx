
import BookingHistoryPage from "../../../../Components/company/payment/history/BookingsHistory";
import AdminShell from "../../../admin/AdminShell";


export const metadata = {
  title: "Owner | Bookings History",
  description: "View completed booking history",
};

export default function Page() {
  return (
    <AdminShell>
      <BookingHistoryPage />
    </AdminShell>
  );
}