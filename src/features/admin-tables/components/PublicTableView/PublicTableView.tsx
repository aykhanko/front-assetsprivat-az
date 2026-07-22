import Link from "next/link";
import type { AdminTable, ChildTablesByCell } from "../../types";
import styles from "./PublicTableView.module.css";

export interface PublicTableViewProps {
  table: AdminTable;
  /** Cari cədvəlin dashboard-dakı URL seqmentləri, məs. ["enterprises"]. */
  dashboardPath: string[];
  childTablesByCell: ChildTablesByCell;
}

/**
 * Admin Panel-də idarə olunan dinamik cədvəli `/dashboard` tərəfində
 * READ-ONLY (redaktə imkanı olmadan) göstərir. Admin tərəfindən əlavə
 * edilmiş sütun/sətir dəyişiklikləri birbaşa burada da görünür, çünki hər
 * iki tərəf eyni data mənbəyini oxuyur.
 *
 * Hər hansı hüceyrəyə alt cədvəl bağlanıbsa, həmin hüceyrə funksional
 * linkə çevrilir və alt cədvəlin read-only görünüşünə aparır. Digər
 * "link" tipli sütunlar isə yalnız vizual (mavi, altı xətli) görünür.
 */
export function PublicTableView({
  table,
  dashboardPath,
  childTablesByCell,
}: PublicTableViewProps) {
  if (table.columns.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Bu cədvəldə hələ məlumat yoxdur.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">S.N</th>
            {table.columns.map((column) => (
              <th scope="col" key={column.id}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.length === 0 ? (
            <tr>
              <td className={styles.emptyRow} colSpan={table.columns.length + 1}>
                Bu cədvəldə hələ sətir yoxdur.
              </td>
            </tr>
          ) : (
            table.rows.map((row, index) => (
              <tr key={row.id}>
                <td className={styles.serialCell}>{index + 1}</td>
                {table.columns.map((column) => {
                  const value = row.values[column.key] ?? "";
                  const subTable = childTablesByCell[row.id]?.[column.id]?.[0];

                  return (
                    <td key={column.id}>
                      {subTable ? (
                        <Link
                          href={`/dashboard/${[...dashboardPath, subTable.slug].join("/")}`}
                          className={styles.subTableValue}
                          title="Alt cədvələ bax"
                        >
                          <span className={styles.subTableIcon} aria-hidden="true">
                            🗂
                          </span>
                          {value || subTable.title}
                        </Link>
                      ) : column.type === "file" ? (
                        <span className={styles.filePlaceholder}>
                          {value || "Fayl əlavə olunmayıb"}
                        </span>
                      ) : column.type === "link" ? (
                        <span className={styles.link}>{value}</span>
                      ) : (
                        <span>{value}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
