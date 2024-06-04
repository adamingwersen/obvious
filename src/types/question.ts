import { type Translation } from "@/types/translation";

export type Question = {
  id: number;
  title: string;
  content: string;
  translations: Translation[];
  existingAnswer: {
    id: number;
    content: string;
    translations: Translation[];
    filePaths: string[];
  } | null;
};
