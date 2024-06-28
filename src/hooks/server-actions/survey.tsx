"use client";

import React, { createContext, useContext, type ReactNode } from "react";

interface SurveyActionsContextProps {
  rename: (surveyId: number, newName: string) => Promise<void>;
}

const ServerActionContext = createContext<
  SurveyActionsContextProps | undefined
>(undefined);

type SurveyActionsProviderProps = {
  children: ReactNode;
  pathToRevalidate?: string;
  handleRenameSurvey: (
    surveyId: number,
    newName: string,
    pathToRevalidate?: string,
  ) => Promise<void>;
};

export const SurveyActionsProvider: React.FC<SurveyActionsProviderProps> = ({
  children,
  handleRenameSurvey,
  pathToRevalidate,
}) => {
  const rename = async (surveyId: number, newName: string) => {
    await handleRenameSurvey(surveyId, newName, pathToRevalidate);
  };

  return (
    <ServerActionContext.Provider value={{ rename }}>
      {children}
    </ServerActionContext.Provider>
  );
};

export const useSurveyActions = (): SurveyActionsContextProps => {
  const context = useContext(ServerActionContext);
  if (!context) {
    throw new Error(
      "useSurveyActions must be used within a SurveyActionsProvider",
    );
  }
  return context;
};
