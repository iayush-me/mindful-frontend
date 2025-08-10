import React, { createContext, useContext, useCallback } from 'react';
import { toast } from 'react-toastify';

// 1. Create context
const NotificationContext = createContext();

// 2. Provider component
export const NotificationProvider = ({ children }) => {
  // show error toast
  const notifyError = useCallback((message) => {
    toast.error(message || 'Something went wrong');
  }, []);

  // show success toast
  const notifySuccess = useCallback((message) => {
    toast.success(message || 'Success!');
  }, []);

  // show info toast
  const notifyInfo = useCallback((message) => {
    toast.info(message || '');
  }, []);

  return (
    <NotificationContext.Provider value={{ notifyError, notifySuccess, notifyInfo }}>
      {children}
    </NotificationContext.Provider>
  );
};

// 3. Custom hook to access notifications easily
export const useNotification = () => useContext(NotificationContext);
