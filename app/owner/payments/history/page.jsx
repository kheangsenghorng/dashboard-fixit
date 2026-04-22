import BookingPaymentPage from "../../../../Components/company/payment/bookings/BookingsPayments";
import AdminShell from "../../../admin/AdminShell";


export const metadata = {
  title: "Owner | Bookings History",
  description: "View completed booking history",
};

export default function Page() {
  return (
    <AdminShell>
      <BookingPaymentPage />
    </AdminShell>
  );
}