"use client";
import Breadcrumb from "@/components/Common/Breadcrumb";
import React, { useState, Suspense } from "react";
import { authService } from "@/services/authService";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "@/redux/store";
import { setAuth } from "@/redux/features/auth-slice";

const VerifyContent = () => {
  const [code, setCode] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";
  const clientId = searchParams.get("clientId") || "";
  const dispatch = useAppDispatch();

  const verifyMutation = useMutation({
    mutationFn: authService.verify,
    onSuccess: (response) => {
      if (response.status) {
        dispatch(
          setAuth({ user: response.data.client, token: response.data.token })
        );
        toast.success("Tizimga muvaffaqiyatli kirdingiz!");
        router.push("/");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Xatolik yuz berdi");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      toast.error("Xatolik: clientId topilmadi");
      return;
    }
    verifyMutation.mutate({ clientId, code: Number(code) });
  };

  return (
    <>
      <Breadcrumb title={"Verify Account"} pages={["Verify"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Verify Your Account
              </h2>
              <p>Enter the 6-digit code sent to {phone}</p>
            </div>

            <div>
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="code" className="block mb-2.5">
                    Verification Code
                  </label>

                  <input
                    type="text"
                    name="code"
                    id="code"
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={verifyMutation.isPending}
                  className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5 disabled:opacity-50"
                >
                  {verifyMutation.isPending ? "Verifying..." : "Verify Account"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
