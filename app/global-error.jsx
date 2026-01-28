"use client";

export default function GlobalError({ reset }) {
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2>Application error</h2>

          <button onClick={reset}>
            Retry
          </button>
        </div>
      </body>
    </html>
  );
}
