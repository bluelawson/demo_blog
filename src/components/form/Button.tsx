import * as TablerIcons from '@tabler/icons-react'; // Tabler Icons をすべてインポート
import React from 'react';

type CrudType = 'create' | 'update' | 'delete';
type ButtonType = 'submit' | 'button';

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
    crudType === 'create'
      ? 'bg-sky-500'
      : crudType === 'update'
        ? 'bg-amber-600'
        : 'bg-slate-500';
  const IconComponent =
    crudType === 'create'
      ? TablerIcons.IconEdit
      : crudType === 'update'
        ? TablerIcons.IconRefresh
        : TablerIcons.IconTrash;

  return (
    <button
      type={type}
      className={`flex px-3 py-2 mx-5 text-sm rounded-lg ${color}`}
      onClick={handleClick}
    >
      <IconComponent className="mr-2 relative top-[2px]" size={16} />
      {text}
    </button>
  );
}
