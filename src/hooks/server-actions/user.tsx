"use client";

import { type SettingsFormField } from "@/components/forms/schemas/settings";
import React, { createContext, useContext, type ReactNode } from "react";

interface UserContextProps {
  updateUser: (data: SettingsFormField) => Promise<void>;
}

const ServerActionContext = createContext<UserContextProps | undefined>(
  undefined,
);

type UserProviderProps = {
  children: ReactNode;
  pathToRevalidate?: string;
  updateUser: (
    data: SettingsFormField,
    pathToRevalidate?: string,
  ) => Promise<void>;
};

export const UserActionProvider: React.FC<UserProviderProps> = ({
  children,
  pathToRevalidate,
  updateUser,
}) => {
  const _updateUser = async (data: SettingsFormField) => {
    await updateUser(data, pathToRevalidate);
  };

  return (
    <ServerActionContext.Provider value={{ updateUser: _updateUser }}>
      {children}
    </ServerActionContext.Provider>
  );
};

export const useUserActions = (): UserContextProps => {
  const context = useContext(ServerActionContext);
  if (!context) {
    throw new Error("useUserActions must be used within a UserActionProvider");
  }
  return context;
};
