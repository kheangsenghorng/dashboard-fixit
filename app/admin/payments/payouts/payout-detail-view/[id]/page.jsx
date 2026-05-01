import AdminShell from "../../../../AdminShell";
import PayoutDetailView from "../../../../../../Components/admin/payouts/detailview/PayoutDetailView";

export const metadata = {
  title: "Payouts – Admin Panel",
  description: "View system analytics",
  
  // 1. Browser Tab Icon (Favicon)
  icons: {
    icon: "/images/bakong-khqr.png",
    apple: "/images/bakong-khqr.png", 
  },

  // 2. Social Media Sharing Image (Open Graph)
  openGraph: {
    title: "Payouts – Admin Panel",
    description: "Securely manage and view owner payout records.",
    images: [
      {
        url: "/images/bakong-khqr.png", // Path inside your 'public' folder
        width: 1200,
        height: 630,
        alt: "Payout Analytics Dashboard Preview",
      },
    ],
  },
};

export default function Page() {
  return (
    <AdminShell>
      <PayoutDetailView />
    </AdminShell>
  );
}