'use client'
import { useState } from 'react'
import { useRouter } from "next/navigation";
import api from "@/lib/axios";


export default function AuthPage() {
  const [mode, setMode] = useState<'google'|'otp'|'password'>('google')
  const [email, setEmail] = useState("");
  const router = useRouter();


  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16">
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="hidden md:flex flex-col justify-center gap-6 p-8 rounded-2xl bg-gradient-to-b from-emerald-50 to-white">
          <h2 className="text-2xl font-bold">Welcome to TailorPro</h2>
          <p className="text-gray-600">Log in to manage orders, measurements and calendar — or create an account to get started.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex gap-2 mb-4">
            <button onClick={() => setMode('google')} className={`flex-1 py-2 rounded ${mode==='google' ? 'bg-emerald-500 text-white' : 'border'}`}>Google</button>
            <button onClick={() => setMode('otp')} className={`flex-1 py-2 rounded ${mode==='otp' ? 'bg-emerald-500 text-white' : 'border'}`}>Email OTP</button>
            <button onClick={() => setMode('password')} className={`flex-1 py-2 rounded ${mode==='password' ? 'bg-emerald-500 text-white' : 'border'}`}>Email / Password</button>
          </div>

          <div>
            {mode === 'google' && (
              <div className="space-y-4">
                <button className="w-full border rounded py-3 flex items-center justify-center gap-3">
                  <img src="/icons/google.svg" alt="g" className="w-5 h-5" />
                  Continue with Google
                </button>
                <div className="text-xs text-gray-500 text-center mt-2">You’ll be redirected to Google — for now this is a UI button.</div>
              </div>
            )}

            {mode === 'otp' && (
  <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
    <label className="block text-sm">Email</label>

    <input
      type="email"
      name="email"
      placeholder="you@domain.com"
      className="w-full border p-2 rounded"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <button
      type="button"
      onClick={async () => {
        if (!email) return alert("Enter email");

        try {
          await api.post("/api/auth/send-otp", { email });
          router.push(`/login/otp?email=${email}`);
        } catch (err: any) {
          console.log(err.response?.data?.message, 'error from the auth page')
          alert(err.response?.data?.message || "Failed to send OTP");
        }
      }}
      className="w-full bg-emerald-500 text-white py-2 rounded"
    >
      Send OTP
    </button>
  </form>
)}


            {mode === 'password' && (
              <form className="space-y-3">
                <label className="block text-sm">Email</label>
                <input type="email" name="email" className="w-full border p-2 rounded" />
                <label className="block text-sm">Password</label>
                <input type="password" name="password" className="w-full border p-2 rounded" />
                <div className="flex items-center justify-between">
                  <button type="submit" className="bg-emerald-500 text-white py-2 px-4 rounded">Sign in</button>
                  <a href="#" className="text-sm text-emerald-500">Forgot?</a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
