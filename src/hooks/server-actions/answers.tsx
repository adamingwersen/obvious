"use client";

import {
  type handleCantAnswerType,
  type handleUpsertAnswerParams,
} from "@/server/actions/answer/actions";
import React, { createContext, useContext, type ReactNode } from "react";

interface AnswerContextProps {
  upsertAnswer: (params: handleUpsertAnswerParams) => Promise<number>;
  cantAnswer: (params: handleCantAnswerType) => Promise<void>;
}

const ServerActionContext = createContext<AnswerContextProps | undefined>(
  undefined,
);

type AnswerProviderProps = {
  children: ReactNode;
  pathToRevalidate?: string;
  handleUpsertAnswer: (
    params: handleUpsertAnswerParams,
    pathToRevalidate?: string,
  ) => Promise<number>;
  handleCantAnswer: (
    params: handleCantAnswerType,
    pathToRevalidate?: string,
  ) => Promise<void>;
};

export const AnswerActionProvider: React.FC<AnswerProviderProps> = ({
  children,
  pathToRevalidate,
  handleUpsertAnswer,
  handleCantAnswer,
}) => {
  const upsertAnswer = async (params: handleUpsertAnswerParams) => {
    return await handleUpsertAnswer(params, pathToRevalidate);
  };

  const cantAnswer = async (params: handleCantAnswerType) => {
    await handleCantAnswer(params, pathToRevalidate);
  };
  return (
    <ServerActionContext.Provider value={{ upsertAnswer, cantAnswer }}>
      {children}
    </ServerActionContext.Provider>
  );
};

export const useAnswerActions = (): AnswerContextProps => {
  const context = useContext(ServerActionContext);
  if (!context) {
    throw new Error(
      "useAnswerActions must be used within a AnswerActionsProvider",
    );
  }
  return context;
};
