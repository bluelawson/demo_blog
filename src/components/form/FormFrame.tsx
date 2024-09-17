import React, { ReactNode, FormEventHandler } from 'react';

interface FormFrameProps {
  children?: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export default function FormFrame({ children, onSubmit }: FormFrameProps) {
  return (
    <div className="w-3/4 px-4 py-8">
      <form onSubmit={onSubmit} className="">
        {children}
      </form>
    </div>
  );
}
