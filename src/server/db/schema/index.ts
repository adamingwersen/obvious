import {
  TableConfig,
  AnyPgTable,
  GetColumnsTableName,
} from "drizzle-orm/pg-core";

export * from "./enums";
export * from "./shared";

export * from "./user.schema";
export * from "./answer.schema";
export * from "./question.schema";
export * from "./survey.schema";
export * from "./metadata-question.schema";
export * from "./metadata-answer.schema";
export * from "./respondent.schema";
export * from "./translation.schema";
export * from "./organisation.schema";
export * from "./survey-respondent.schema";

// export function conflictUpdateAllExcept<
//   T extends AnyPgTable,
//   E extends (keyof T["$inferInsert"])[],
// >(table: T, except: E) {
//     const cols = GetColumnsTableName()
//   const columns = getTableColumns(table);
//   const updateColumns = Object.entries(columns).filter(
//     ([col]) => !except.includes(col as keyof typeof table.$inferInsert),
//   );

//   return updateColumns.reduce(
//     (acc, [colName, table]) => ({
//       ...acc,
//       [colName]: sql.raw(`excluded.${table.name}`),
//     }),
//     {},
//   ) as Omit<Record<keyof typeof table.$inferInsert, SQL>, E[number]>;
// }
