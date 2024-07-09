import { type MetadataType } from "@/server/db/schema/enums";

export type FormField = {
  metadataAnswerId: number | undefined;
  questionId: number;
  question: string;
  fieldType: MetadataType;
  value: string;
};

export type FormSchema = {
  fields: FormField[];
  isTocChecked: boolean;
};

export const getFieldRules = (fieldType: MetadataType) => {
  switch (fieldType) {
    case "TEXT":
      return {
        required: "You need to provide a bit of text here",
      };
    case "NUMBER":
      return {
        pattern: {
          value: /^-?\d+(\.|\,\d+)?$/,
          message: "You need to provide a number",
        },
        required: "Please provide a number",
      };

    case "RANGE":
      return {
        pattern: {
          value: /^([1-9][0-9]*)-([1-9][0-9]*)$/,
          message: "Provide a range like 10-99",
        },
        required: "Please provide a range",
      };

    case "URL":
      return {
        pattern: {
          value: new RegExp(
            "^(https?://)?(www.)?([a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)+)(/[a-zA-Z0-9-._~:?#@!$&'()*+,;=]*)?$",
          ),
          message: "Provide a valid URL",
        },
        required: "Please provide a URL",
      };

    case "EMAIL":
      return {
        pattern: {
          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          message: "Please provide a valid email",
        },
        required: "Please provide an email",
      };
      break;

    default:
      return {
        required: "You need to provide a bit of text here",
      };
  }
};
