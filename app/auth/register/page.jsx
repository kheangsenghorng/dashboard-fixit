import { Suspense } from "react";

import RegisterPage from "../../../Components/auth/Register";

export const metadata = {
  title: "Register",
  description: "RegisterPage",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterPage />
    </Suspense>
  );
}