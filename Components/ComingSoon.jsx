"use client";
import React, { useState } from "react";
import Head from "next/head";

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center antialiased text-slate-900">
      <Head>
        <title>Coming Soon</title>
      </Head>

      <main className="w-full max-w-md px-6">
        {/* Minimalist Badge */}
        <div className="flex justify-center mb-6">
          <span className="px-3 py-1 text-xs font-medium tracking-widest uppercase bg-slate-100 text-slate-500 rounded-full">
            Coming 2027
          </span>
        </div>

        {/* Big Bold Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-center tracking-tight mb-4">
          Something better is <br />
          <span className="text-blue-600">on the way.</span>
        </h1>

        {/* Short & Clean Input Area */}
        <div className="mt-10">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="relative group">
              <input
                type="email"
                required
                placeholder="Email address"
                className="w-full pb-4 pt-2 bg-transparent border-b-2 border-slate-200 focus:border-blue-600 outline-none transition-all text-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-0 top-2 text-sm font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 transition-colors"
              >
                Notify Me
              </button>
            </form>
          ) : (
            <p className="text-center text-slate-500 font-medium animate-pulse">
              See you at launch.
            </p>
          )}
        </div>

        {/* Minimal Social Icons (No text) */}
        <div className="flex justify-center gap-8 mt-16">
          <a
            href="#"
            className="opacity-40 hover:opacity-100 transition-opacity"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
          </a>
          <a
            href="#"
            className="opacity-40 hover:opacity-100 transition-opacity"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
        </div>
      </main>

      <footer className="absolute bottom-10 text-[10px] text-slate-400 uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Your Brand
      </footer>
    </div>
  );
}
