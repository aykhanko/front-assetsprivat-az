"use client";

import { KeyboardEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { useAdminTableMutations } from "../../hooks/useAdminTableMutations";
import { AddColumnDialog } from "../AddColumnDialog";
import { ColumnMenu } from "../ColumnMenu";
import { EditableCell } from "../EditableCell";
import { RowActionsCell } from "../RowActionsCell";
import type {
  AdminTable,
  AdminTableBreadcrumb,
  ChildTableSummary,
} from "../../types";
import styles from "./AdminTableView.module.css";

export interface AdminTableViewProps {
  initialTable: AdminTable;
  breadcrumbs: AdminTableBreadcrumb[];
  path: string[];
  initialChildTablesByRowId: Record<string, ChildTableSummary[]>;
}

export function AdminTableView({
  initialTable,
  breadcrumbs,
  path,
  initialChildTablesByRowId,
}: AdminTableViewProps) {
  const router = useRouter();
  const {
    table,
    childTablesByRowId,
    errorMessage,
    isPending,
    clearError,
    addColumn,
    renameColumn,
    deleteColumn,
    addRow,
    updateCell,
    deleteRow,
    renameTable,
    createSubTable,
  } = useAdminTableMutations({ initialTable, initialChildTablesByRowId });

  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(table.title);

  const submitTitle = () => {
    const trimmed = titleDraft.trim();
    if (trimmed && trimmed !== table.title) {
      renameTable(trimmed);
    } else {
      setTitleDraft(table.title);
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    } else if (event.key === "Escape") {
      setTitleDraft(table.title);
      setIsEditingTitle(false);
    }
  };

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/admin" className={styles.breadcrumbLink}>
          Admin Panel
        </Link>
        {breadcrumbs.map((crumb, index) => {
          const href = `/admin/${path.slice(0, index + 1).join("/")}`;
          const isLast = index === breadcrumbs.length - 1;
          return (
            <span key={crumb.id} className={styles.breadcrumbItem}>
              <span className={styles.breadcrumbSeparator}>/</span>
              {isLast ? (
                <span className={styles.breadcrumbCurrent}>{crumb.title}</span>
              ) : (
                <Link href={href} className={styles.breadcrumbLink}>
                  {crumb.title}
                </Link>
              )}
            </span>
          );
        })}
      </nav>

      <div className={styles.header}>
        {isEditingTitle ? (
          <input
            className={styles.titleInput}
            value={titleDraft}
            autoFocus
            onChange={(event) => setTitleDraft(event.target.value)}
            onBlur={submitTitle}
            onKeyDown={handleTitleKeyDown}
          />
        ) : (
          <h1
            className={styles.title}
            onClick={() => setIsEditingTitle(true)}
            role="button"
            tabIndex={0}
            title="Adı dəyişdirmək üçün klikləyin"
          >
            {table.title}
          </h1>
        )}

        <div className={styles.toolbar}>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsAddColumnOpen(true)}
          >
            + Sütun əlavə et
          </Button>
          <Button type="button" onClick={addRow} isLoading={isPending}>
            + Sətir əlavə et
          </Button>
        </div>
      </div>

      {errorMessage ? (
        <p className={styles.errorBanner} role="alert" onClick={clearError}>
          {errorMessage}
        </p>
      ) : null}

      {table.columns.length === 0 ? (
        <div className={styles.emptyState}>
          <p>
            Bu cədvəldə hələ sütun yoxdur. Başlamaq üçün &ldquo;+ Sütun əlavə
            et&rdquo; düyməsindən istifadə edin.
          </p>
        </div>
      ) : (
        <div className={styles.wrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col" className={styles.indexHeader}>
                  #
                </th>
                {table.columns.map((column) => (
                  <th scope="col" key={column.id}>
                    <span className={styles.columnHeaderContent}>
                      {column.label}
                      <ColumnMenu
                        column={column}
                        isPending={isPending}
                        onRename={renameColumn}
                        onDelete={deleteColumn}
                      />
                    </span>
                  </th>
                ))}
                <th scope="col" className={styles.actionsHeader}>
                  Əməliyyatlar
                </th>
              </tr>
            </thead>
            <tbody>
              {table.rows.length === 0 ? (
                <tr>
                  <td
                    className={styles.emptyRow}
                    colSpan={table.columns.length + 2}
                  >
                    Bu cədvəldə hələ sətir yoxdur.
                  </td>
                </tr>
              ) : (
                table.rows.map((row, index) => (
                  <tr key={row.id}>
                    <td className={styles.serialCell}>{index + 1}</td>
                    {table.columns.map((column) => (
                      <td key={column.id}>
                        <EditableCell
                          value={row.values[column.key] ?? ""}
                          type={column.type}
                          onSave={(value) =>
                            updateCell(row.id, column.id, value)
                          }
                        />
                      </td>
                    ))}
                    <td>
                      <RowActionsCell
                        path={path}
                        childTables={childTablesByRowId[row.id] ?? []}
                        isPending={isPending}
                        onCreateSubTable={(title) =>
                          createSubTable(row.id, title, (childTable) => {
                            router.push(
                              `/admin/${[...path, childTable.slug].join("/")}`
                            );
                          })
                        }
                        onDeleteRow={() => deleteRow(row.id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <AddColumnDialog
        isOpen={isAddColumnOpen}
        isPending={isPending}
        onSubmit={(label, type) => {
          addColumn(label, type);
          setIsAddColumnOpen(false);
        }}
        onCancel={() => setIsAddColumnOpen(false)}
      />
    </div>
  );
}
