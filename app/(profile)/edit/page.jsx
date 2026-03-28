import EditProfile from "../../../Components/profile/EditProfile";

export const metadata = {
  title: "Edit Profile | My Account",
  description:
    "Update your personal information, contact details, and account settings.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function ProfilePage() {
  return <EditProfile />;
}