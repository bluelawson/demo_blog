import React from "react";
import Icon from "./Icon";

type CrudType = "create" | "update" | "delete";
type ButtonType = "submit" | "button";

type ButtonProps = {
  type: ButtonType;
  crudType: CrudType;
  text: string;
  handleClick?: () => void;
};

export default function Button({
  type,
  crudType,
  text,
  handleClick,
}: ButtonProps) {
  const color =
    crudType === "create"
      ? "bg-sky-500"
      : crudType === "update"
      ? "bg-amber-600"
      : "bg-slate-500";
  const icon =
    crudType === "create"
      ? "edit"
      : crudType === "update"
      ? "refresh"
      : "trash";

  return (
    <button
      type={type}
      className={`px-3 py-2 mx-5 text-sm rounded-lg ${color}`}
      onClick={handleClick}
    >
      <Icon iconName={`${icon}`} />
      {text}
    </button>
  );
}
