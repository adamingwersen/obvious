"use client";

import { CreateQuestionFormFields } from "@/components/forms/schemas/create-question";
import React, { createContext, useContext, type ReactNode } from "react";

interface QuestionContextProps {
  upsertQuestion: (data: CreateQuestionFormFields) => Promise<void>;
  deleteQuestion: (questionId: number) => Promise<void>;
}

const ServerActionContext = createContext<QuestionContextProps | undefined>(
  undefined,
);

type QuestionProviderProps = {
  children: ReactNode;
  pathToRevalidate?: string;
  handleUpsertQuestion: (
    data: CreateQuestionFormFields,
    pathToRevalidate?: string,
  ) => Promise<void>;
  handleDeleteQuestion: (
    questionId: number,
    pathToRevalidate?: string,
  ) => Promise<void>;
};

export const QuestionActionProvider: React.FC<QuestionProviderProps> = ({
  children,
  pathToRevalidate,
  handleUpsertQuestion,
  handleDeleteQuestion,
}) => {
  const deleteQuestion = async (questionId: number) =>
    handleDeleteQuestion(questionId, pathToRevalidate);

  const upsertQuestion = async (data: CreateQuestionFormFields) =>
    handleUpsertQuestion(data, pathToRevalidate);
  return (
    <ServerActionContext.Provider value={{ upsertQuestion, deleteQuestion }}>
      {children}
    </ServerActionContext.Provider>
  );
};

export const useQuestionActions = (): QuestionContextProps => {
  const context = useContext(ServerActionContext);
  if (!context) {
    throw new Error(
      "useQuestionActions must be used within a QuestionActionProvider",
    );
  }
  return context;
};
