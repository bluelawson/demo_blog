import React from "react";

type IconProps = {
  iconName: string;
};

export default function Icon({ iconName }: IconProps) {
  return <span className={`i-tabler-edit mr-2 relative top-[2px] `}></span>;
}
