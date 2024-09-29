// Tabler Icons をサーバサイドで使用する場合はあらかじめすべてインポートしておかないと取得できなくてエラーになる
import * as TablerIcons from '@tabler/icons-react';
import React from 'react';

type CrudType = 'create' | 'update' | 'delete';
type ButtonType = 'submit' | 'button';

type ButtonProps = {
  type: ButtonType;
  crudType: CrudType;
  text: string;
  disabled?: boolean;
  handleClick?: () => void;
};

export default function Button({
  type,
  crudType,
  text,
  disabled,
  handleClick,
}: ButtonProps) {
  const color = disabled
    ? 'bg-gray-400'
    : crudType === 'create'
      ? 'bg-sky-500 hover:bg-sky-600'
      : crudType === 'update'
        ? 'bg-amber-600 hover:bg-amber-700'
        : 'bg-slate-500 hover:bg-slate-600';
  const IconComponent =
    crudType === 'create'
      ? TablerIcons.IconEdit
      : crudType === 'update'
        ? TablerIcons.IconRefresh
        : TablerIcons.IconTrash;

  return (
    <button
      type={type}
      className={`flex px-3 py-2 mx-5 text-sm rounded-lg ${color} ${disabled ? 'cursor-not-allowed' : ''}`}
      onClick={handleClick}
      disabled={disabled}
    >
      <IconComponent className="mr-2 relative top-[2px]" size={16} />
      {text}
    </button>
  );
}
