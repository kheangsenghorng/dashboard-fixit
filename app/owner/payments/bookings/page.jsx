import AdminShell from "../../../admin/AdminShell";
import BookingPaymentPage from "../../../../Components/company/payment/bookings/BookingsPayments";

export const metadata = {
  title: "Owner | Bookings Payments",
  description: "Manage booking payments",
};

export default function Page() {
  return (
    <AdminShell>
      <BookingPaymentPage />
    </AdminShell>
  );
}