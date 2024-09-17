import React from 'react';

type ButtonFrameProps = {
  children: React.ReactNode;
};

export default function ButtonFrame({ children }: ButtonFrameProps) {
  return (
    <div className="flex items-center justify-center pt-4 mt-4 ml-4">
      {children}
    </div>
  );
}
