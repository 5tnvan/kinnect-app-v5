"use client";

import React from "react";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { Authentication } from "../../components/app/authentication/Login";
import AppContext from "~~/app/context";
import "~~/styles/app-reuse.css";
import "~~/styles/app.css";
import { Signup } from "~~/components/app/authentication/Signup";

export default function SignUpPage() {
  const router = useRouter();
  const { isLoading, isAuth, user, profile, refetch } = useContext(AppContext);

  if (isAuth == "yes") {
    router.push("/profile/view");
  }

  if (isAuth == "no") {
    return (
      <>
        <div className="font-semibold text-3xl mb-5">{"Create an account"}</div>
        {/* CONTENT */}
        <div id="wildpay-is-not-auth-sign-up" className="z-10">
          <Signup refetch={refetch} />
        </div>
      </>
    );
  }
}
