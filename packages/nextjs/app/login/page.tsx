"use client";

import React from "react";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { Authentication } from "../../components/app/authentication/Authentication";
import AppContext from "~~/app/context";
import "~~/styles/app-reuse.css";
import "~~/styles/app.css";

export default function LoginPage() {
  const router = useRouter();
  const { isLoading, isAuth, user, profile } = useContext(AppContext);

  if (isAuth == "yes") {
    router.push("/profile/view");
  }

  if (isAuth == "no") {
    return (
      <>
        <div className="font-semibold text-3xl mb-5">{"Welcome back"}</div>
        {/* CONTENT */}
        <div id="wild-pay-is-not-auth-log-in" className="z-10">
          {/* Input */}
          <Authentication type="login" value="Login" linkSignUp="yes" linkLogin="no" />
        </div>
      </>
    );
  }
}
