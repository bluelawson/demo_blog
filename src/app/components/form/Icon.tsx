"use client";
import React, { useEffect } from "react";

type IconProps = {
  iconName: string;
};

export default function Icon({ iconName }: IconProps) {
  useEffect(() => {}, []);

  return (
    <span className={`i-tabler-${iconName} mr-2 relative top-[2px] `}></span>
  );
}
