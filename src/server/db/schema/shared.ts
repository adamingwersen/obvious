import { getTableColumns, sql } from "drizzle-orm";
import {
  getTableConfig,
  type PgTable,
  type PgUpdateSetSource,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";

export const createdUpdatedTime = {
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at").default(sql`null`),
};

export const defaultRows = {
  id: serial("id").notNull().primaryKey(),
  ...createdUpdatedTime,
} as const;

export function conflictUpdateSetAllColumns<TTable extends PgTable>(
  table: TTable,
): PgUpdateSetSource<TTable> {
  const columns = getTableColumns(table);
  const { name: tableName } = getTableConfig(table);
  const conflictUpdateSet = Object.entries(columns).reduce(
    (acc, [columnName, columnInfo]) => {
      if (!columnInfo.default) {
        // @ts-expect-error because
        acc[columnName] = sql.raw(
          `COALESCE(excluded.${columnInfo.name}, ${tableName}.${columnInfo.name})`,
        );
      }
      return acc;
    },
    {},
  ) as PgUpdateSetSource<TTable>;
  return conflictUpdateSet;
}
