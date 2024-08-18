"use client";
import React, { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (!error) {
      router.push("/");
    } else {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          className="text-black"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          className="text-black"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <button
          className="px-3 mx-3 bg-orange-300 rounded-md"
          onClick={handleSignUp}
        >
          Sign Up
        </button>
      </div>
    </>
  );
};

export default SignUp;
