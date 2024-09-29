'use client';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef } from 'react';

import { useMessage } from '@/context/MessageContext';

const MessageDisplay = () => {
  const { errorMessage, snackbarMessage, clearErrorMessage } = useMessage();
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  // パスが変更されたときにエラーメッセージをクリアする
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      clearErrorMessage();
      prevPathname.current = pathname; //前回のパスを記録しておく
    }
  }, [pathname, clearErrorMessage]);

  const handleClose = () => {
    clearErrorMessage();
  };

  return (
    <>
      {errorMessage && (
        <div className="fixed z-50 px-4 py-3 text-white bg-red-500 top-2 right-2">
          <button
            onClick={handleClose}
            className="absolute top-0 right-0 px-1 text-sm text-white rounded"
          >
            ×
          </button>
          {errorMessage}
        </div>
      )}

      {snackbarMessage && (
        <div className="fixed z-50 px-4 py-3 text-white bg-green-500 bottom-2 right-2">
          {snackbarMessage}
        </div>
      )}
    </>
  );
};

export default MessageDisplay;
