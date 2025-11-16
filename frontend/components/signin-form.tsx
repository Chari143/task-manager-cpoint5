"use client";
import { signInCredentialProps, SignInSchema } from "@/types/types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";

const SignInForm = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState<signInCredentialProps>({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error,setError] = useState<string>("");
  const [serverMessage, setServerMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignin = async () => {
    const parsedData = SignInSchema.safeParse(credentials);
    if (!parsedData.success) {
      const error: Record<string, string> = {};
      parsedData.error.issues.forEach((issue) => {
        const fieldname = issue.path[0] as string;
        error[fieldname] = issue.message;
      });
      setFieldErrors(error);
      return;
    }
    setLoading(true);
    setError("");
    setServerMessage("");
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      const res = await fetch(`${base}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Signin failed");
        return;
      }
      setServerMessage("Signin successful! Redirecting...");
      router.replace("/");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center h-full">
      <div className="p-10 space-y-6 flex flex-col mx-auto w-[400px] h-full shadow-xl rounded-2xl">
        <h2 className="font-bold text-3xl capitalize items-center flex justify-center">
          Sign In
        </h2>
        <div className="flex flex-col gap-y-2">
          <label htmlFor="email" className="font-semibold">
            Email:
          </label>
          <input
            name="email"
            type="email"
            required
            value={credentials.email}
            onChange={handleChange}
            placeholder="Email"
            className="border border-gray-300 rounded-md p-2"
          />
          {fieldErrors.email && (
            <span className="text-red-400">{fieldErrors.email}</span>
          )}
        </div>
        <div className="flex flex-col gap-y-2">
          <label htmlFor="password" className="font-semibold">
            Password:
          </label>
          <input
            name="password"
            type="password"
            required
            min={4}
            value={credentials.password}
            onChange={handleChange}
            placeholder="Password"
            className="border border-gray-300 rounded-md p-2"
          />
          {fieldErrors.password && (
            <span className="text-red-400">{fieldErrors.password}</span>
          )}
        </div>
        {error && (
          <span className="text-center text-sm text-red-600">{error}</span>
        )}
        {serverMessage && (
          <span className="text-center text-sm text-green-600">{serverMessage}</span>
        )}
        <button
          className="bg-blue-600 p-3 text-white rounded-md hover:opacity-90 hover:cursor-pointer flex justify-center items-center"
          onClick={handleSignin}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <Link
          href={"/signup"}
          className="flex justify-center text-blue-500  hover:underline"
        >
          Don't Have Account?
        </Link>
      </div>
    </div>
  );
};

export default SignInForm;
