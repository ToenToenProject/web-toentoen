"use client";

import React, { createContext, useContext, useState } from "react";

type RoleType = "user" | "merchant";

interface EarlyAccessContextType {
  isOpen: boolean;
  initialRole: RoleType;
  openEarlyAccess: (role?: RoleType) => void;
  closeEarlyAccess: () => void;
}

const EarlyAccessContext = createContext<EarlyAccessContextType | undefined>(undefined);

export const EarlyAccessProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialRole, setInitialRole] = useState<RoleType>("user");

  const openEarlyAccess = (role: RoleType = "user") => {
    setInitialRole(role);
    setIsOpen(true);
  };

  const closeEarlyAccess = () => {
    setIsOpen(false);
  };

  return (
    <EarlyAccessContext.Provider value={{ isOpen, initialRole, openEarlyAccess, closeEarlyAccess }}>
      {children}
    </EarlyAccessContext.Provider>
  );
};

export const useEarlyAccess = () => {
  const context = useContext(EarlyAccessContext);
  if (!context) {
    throw new Error("useEarlyAccess must be used within an EarlyAccessProvider");
  }
  return context;
};
