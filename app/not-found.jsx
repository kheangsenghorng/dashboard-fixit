import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold">404</h1>

        <p className="text-gray-600">
          Page not found
        </p>

        <Link href="/login" className="text-indigo-600 font-semibold">
          Go to Login
        </Link>
      </div>
    </div>
  );
}
