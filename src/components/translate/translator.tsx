"use client";

import { type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import * as React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandList,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, Check, ChevronsUpDown, Languages } from "lucide-react";
import Spinner from "@/components/ui/spinner";
import { createTranslationInDb } from "@/app/actions";
import { type Translation } from "@/types/translation";

type TranslatorProps = {
  children: ReactNode;
  content: string;
  translations: Translation[];
  answerId: number | undefined;
  questionId: number | undefined;
  handleTranslate: (
    content: string,
    targetLangName: string,
  ) => Promise<{ translation: string }>;
};

const Translator = ({
  children,
  content,
  translations: existingTranslations,
  answerId,
  questionId,
  handleTranslate,
}: TranslatorProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [language, setLanguage] = useState<string>("");

  const [translations, setTranslations] = useState<Record<string, string>>(
    existingTranslations.reduce(
      (acc: Record<string, string>, obj) => {
        acc[obj.language] = obj.translatedContent;
        return acc;
      },
      {} as Record<string, string>,
    ),
  );

  const currentTranslation = translations[language] ?? null;

  const saveTranslationToDb = async (
    language: string,
    translatedContent: string,
  ) => {
    await createTranslationInDb({
      translatedContent: translatedContent,
      language: language,
      answerId: answerId,
      questionId: questionId,
    });
  };

  const handleLanguageChanged = async (lang: string) => {
    const existingTranslation = translations[lang] ?? null;

    if (existingTranslation === null) {
      setIsLoading(true);
      const translation = await handleTranslate(content, lang);
      if (translation === undefined) {
        setIsLoading(false);
        return;
      }
      setTranslations((prev) => ({
        ...prev,
        [lang]: translation.translation,
      }));
      setLanguage(lang);
      await saveTranslationToDb(lang, translation.translation);
      setIsLoading(false);
    } else {
      setLanguage(lang);
    }
  };

  return (
    <div className="flex flex-row justify-center gap-2">
      {children}
      <Popover>
        <PopoverTrigger>
          {/* This button is for some reason causing hydration error? */}
          <div className="relative flex h-7 w-7 items-center justify-center rounded-lg border p-1">
            <Languages size={12} className="" />
            {Object.keys(translations).length > 0 && (
              <span className="absolute right-0 top-0 inline-flex -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-red-300 px-1 py-1 text-xs font-bold leading-none text-red-100">
                <Bell size={8} strokeWidth={3}></Bell>
              </span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-96">
          <div>
            <div className="flex items-center justify-start gap-2">
              <Languages size={12}></Languages>
              <p className="text-xs font-semibold">
                Translate {questionId !== null ? "question" : "answer"}
              </p>
              <LanguageSelect
                languageSelected={handleLanguageChanged}
              ></LanguageSelect>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 p-5 ">
            {language === "" && !isLoading && (
              <p>Select a language to get a translation</p>
            )}
            {isLoading && <Spinner className="size-10"></Spinner>}
            {currentTranslation !== null && !isLoading && (
              <div>
                <p className="pb-1 font-semibold">
                  Translated {questionId !== null ? "question" : "answer"}
                </p>

                <p className="w-full rounded-md border p-2">
                  {currentTranslation}
                </p>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Translator;

type LanguageSelectProps = {
  languageSelected: (language: string) => void;
};

function LanguageSelect({ languageSelected }: LanguageSelectProps) {
  const languages = [
    {
      value: "danish",
      label: "Danish",
    },
    {
      value: "polish",
      label: "Polish",
    },
    {
      value: "german",
      label: "German",
    },
    {
      value: "french",
      label: "French",
    },
  ];

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleSetLang = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue);
    setOpen(false);
    languageSelected(currentValue);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? languages.find((lang) => lang.value === value)?.label
            : "Select language..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search langauge..." />
          <CommandEmpty>No language found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {languages.map((lang) => (
                <CommandItem
                  key={lang.value}
                  value={lang.value}
                  onSelect={handleSetLang}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === lang.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {lang.label}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
