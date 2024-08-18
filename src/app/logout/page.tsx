import Link from "next/link";
import React from "react";

const Logout = () => {
  return (
    <>
      <div className="h-[50vh] w-screen flex items-center justify-center">
        <div className="text-center">
          <h1>ログアウトしました</h1>
          <Link href="/" className="hover:bg-sky-700 underline">
            ホームへ戻る
          </Link>
        </div>
      </div>
    </>
  );
};

export default Logout;
