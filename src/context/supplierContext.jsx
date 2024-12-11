import { createContext, useContext, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_APP_SOCKET_URL || '/');

const SupplierContext = createContext();

export const SupplierProvider = ({ children }) => {
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [quill, setQuill] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const triggerUpdate = () => {
    setShouldUpdate((prev) => !prev);
  };

  return (
    <SupplierContext.Provider
      value={{
        darkMode,
        setDarkMode,
        shouldUpdate,
        triggerUpdate,
        loading,
        setLoading,
        currentDoc,
        setCurrentDoc,
        quill,
        setQuill,
        socket, // Provide the global socket here
      }}
    >
      {children}
    </SupplierContext.Provider>
  );
};

export const useSupplier = () => useContext(SupplierContext);
