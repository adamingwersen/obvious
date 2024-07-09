import { type esrsDataType } from "@/types/esrs/esrs-data";
import { z } from "zod";

// Define your different Zod schemas
const contentSchema = z.object({
  content: z.union([z.number(), z.string(), z.date().nullable()]),
});

// Union type for possible form data based on schemas
export type AnswerFormData = z.infer<typeof contentSchema>;

export const getFormValationSchema = (datatype?: esrsDataType) => {
  const defaultSchema = z.object({
    content: z.string().min(10),
  });

  if (!datatype) return defaultSchema;

  switch (datatype.formDataType) {
    case "date":
      return z.object({
        content: z.date({ message: "You need to provide a date" }), //.transform((x) => x.toDateString())
      });
    case "number":
      const errMsg = datatype.unit
        ? `You need to provide a number of ${datatype.unit}`
        : "You need to provide a number";

      return z.object({
        content: z
          .number({
            message: errMsg,
          })
          .transform((x) => x.toString()),
      });
    case "text":
      return defaultSchema;
    case "table":
      return defaultSchema;
    default:
      return defaultSchema;
  }
};
