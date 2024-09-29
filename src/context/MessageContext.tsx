'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface MessageContextProps {
  errorMessage: string | null;
  snackbarMessage: string | null;
  showErrorMessage: (message: string) => void;
  showSnackbarMessage: (message: string) => void;
  clearErrorMessage: () => void;
  clearSnackbarMessage: () => void;
}

const MessageContext = createContext<MessageContextProps | undefined>(
  undefined,
);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
  };

  const showSnackbarMessage = (message: string) => {
    setSnackbarMessage(message);
    setTimeout(() => {
      setSnackbarMessage(null);
    }, 3000);
  };

  const clearErrorMessage = () => {
    setErrorMessage(null);
  };

  const clearSnackbarMessage = () => {
    setSnackbarMessage(null);
  };

  return (
    <MessageContext.Provider
      value={{
        errorMessage,
        snackbarMessage,
        showErrorMessage,
        showSnackbarMessage,
        clearErrorMessage,
        clearSnackbarMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};
