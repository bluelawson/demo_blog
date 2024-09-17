import React from "react";

type Props = {
  header?: boolean;
};

export default function Loading({ header }: Props) {
  return (
    <div
      className={`flex items-center justify-center ${
        header ? "" : "min-h-screen"
      }`}
    >
      <div
        className={`border-t-4 border-orange-500 rounded-full  ${
          header ? "w-10 h-10" : "w-16 h-16"
        } animate-spin`}
      ></div>
    </div>
  );
}
