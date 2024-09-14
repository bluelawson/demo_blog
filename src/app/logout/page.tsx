import Link from "next/link";
import React from "react";

const Logout = () => {
  return (
    <>
      <div className="h-[50vh] w-full flex items-center justify-center">
        <div className="text-center">
          <h1>ログアウトしました</h1>
          <Link href="/" className="underline hover:bg-sky-700">
            ホームへ戻る
          </Link>
        </div>
      </div>
    </>
  );
};

export default Logout;
