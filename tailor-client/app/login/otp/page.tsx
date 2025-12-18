"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api, { setAccessToken } from "@/lib/axios";

export default function OtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
 const [email, setEmail] = useState("");

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
     if (!searchParams) return;
  const e = searchParams.get("email");
    if (e) setEmail(e);
  }, [searchParams]);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next box
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const verifyOtp = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length < 6) {
      return alert("Enter full OTP");
    }

    try {
      const res = await api.post(
        "/api/auth/verify-otp",
        { email, otp: finalOtp },
      );

      console.log(res.data, 'res.data from verify otp')

      setAccessToken(res.data.accessToken)

      if (!res.data.user.isProfileCompleted) {

        router.push("/profile");
      } else if (res.data.user.role === "staff") {
        router.push("/dashboard/orders");
      } else{
        router.push("/dashboard")
      }
     
    } catch (err: any) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    try {
      await api.post("/api/auth/resend-otp", { email });
      alert("OTP resent successfully");
      setTimer(60);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to resend");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h2 className="text-xl font-semibold mb-2">Enter OTP</h2>
      <p className="text-sm text-gray-600 mb-6">{email}</p>
      <div className="flex gap-3 mb-5">
        {otp.map((digit, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            type="text"
            maxLength={1}
            value={digit}
            className="w-12 h-12 text-center border rounded-md text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            onChange={(e) => handleChange(e.target.value, i)}
          />
        ))}
      </div>

      <button
        onClick={verifyOtp}
        className="bg-emerald-600 text-white px-6 py-2 rounded-md w-48"
      >
      Verify OTP
      </button>

      {/* Timer */}
      <div className="mt-4 text-sm text-gray-600">
        {timer > 0 ? (
          <p>Resend OTP in {timer}s</p>
        ) : (
          <button
            disabled={loading}
            onClick={resendOtp}
            className="text-emerald-600 font-medium"
          >
            {loading ? "Sending..." : "Resend OTP"}
          </button>
        )}
      </div>
    </div>
  );
}
