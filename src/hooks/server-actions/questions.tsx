"use client";

import { type upsertQuestionsType } from "@/components/forms/schemas/create-question";
import React, { createContext, useContext, type ReactNode } from "react";

interface QuestionContextProps {
  upsertQuestions: (questions: upsertQuestionsType) => Promise<void>;
  deleteQuestion: (
    questionId: number,
    allowAnswerCascading: boolean,
  ) => Promise<void>;
}

const ServerActionContext = createContext<QuestionContextProps | undefined>(
  undefined,
);

type QuestionProviderProps = {
  children: ReactNode;
  pathToRevalidate?: string;
  handleUpsertQuestions: (
    questions: upsertQuestionsType,
    pathToRevalidate?: string,
  ) => Promise<void>;
  handleDeleteQuestion: (
    questionId: number,
    allowAnswerCascading: boolean,
    pathToRevalidate?: string,
  ) => Promise<void>;
};

export const QuestionActionProvider: React.FC<QuestionProviderProps> = ({
  children,
  pathToRevalidate,
  handleUpsertQuestions,
  handleDeleteQuestion,
}) => {
  const deleteQuestion = async (
    questionId: number,
    allowAnswerCascading: boolean,
  ) => handleDeleteQuestion(questionId, allowAnswerCascading, pathToRevalidate);

  const upsertQuestions = async (questions: upsertQuestionsType) =>
    handleUpsertQuestions(questions, pathToRevalidate);
  return (
    <ServerActionContext.Provider value={{ upsertQuestions, deleteQuestion }}>
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
