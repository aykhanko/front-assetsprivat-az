import Link from "next/link";
import type { AdminTable, ChildTablesByCell } from "../../types";
import { toAbsoluteExternalUrl } from "../../utils/external-url";
import styles from "./PublicTableView.module.css";

export interface PublicTableViewProps {
  table: AdminTable;
  /** Cari cədvəlin dashboard-dakı URL seqmentləri, məs. ["enterprises"]. */
  dashboardPath: string[];
  childTablesByCell: ChildTablesByCell;
}

/**
 * Admin Panel-də idarə olunan dinamik cədvəli `/dashboard` tərəfində
 * READ-ONLY göstərir. Alt cədvəli və ya xarici URL olan hüceyrələr mavi
 * hiperlink kimi, digərləri adi mətn kimi görünür.
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
                  const meta = row.cellMeta?.[column.key];
                  const subTable = childTablesByCell[row.id]?.[column.id]?.[0];

                  return (
                    <td key={column.id}>
                      {subTable ? (
                        <Link
                          href={`/dashboard/${[...dashboardPath, subTable.slug].join("/")}`}
                          className={styles.subTableValue}
                          title="Alt cədvələ bax"
                        >
                          {value || subTable.title}
                        </Link>
                      ) : meta?.externalUrl ? (
                        <a
                          href={toAbsoluteExternalUrl(meta.externalUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.subTableValue}
                          title={toAbsoluteExternalUrl(meta.externalUrl)}
                        >
                          {value || meta.externalUrl}
                        </a>
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
