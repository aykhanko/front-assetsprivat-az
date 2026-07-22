"use client";

import { KeyboardEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { useAdminTableMutations } from "../../hooks/useAdminTableMutations";
import type { ChildTablesByCell } from "../../hooks/useAdminTableMutations";
import { AddColumnDialog } from "../AddColumnDialog";
import {
  AllSubTablesDialog,
  type SubTablesDialogMode,
} from "../AllSubTablesDialog";
import { ColumnMenu } from "../ColumnMenu";
import { ConfirmDialog } from "../ConfirmDialog";
import { EditableCell, type CellNavigationDirection } from "../EditableCell";
import { RowActionsCell } from "../RowActionsCell";
import type {
  AdminTable,
  AdminTableBreadcrumb,
  DescendantSubTableSummary,
} from "../../types";
import styles from "./AdminTableView.module.css";

export interface AdminTableViewProps {
  initialTable: AdminTable;
  breadcrumbs: AdminTableBreadcrumb[];
  path: string[];
  initialChildTablesByCell: ChildTablesByCell;
  initialDescendantSubTables: DescendantSubTableSummary[];
}

interface ActiveCell {
  rowId: string;
  columnId: string;
}

interface PendingSubTableDeletion {
  rowId: string;
  columnId: string;
  childTableId: string;
  title: string;
}

export function AdminTableView({
  initialTable,
  breadcrumbs,
  path,
  initialChildTablesByCell,
  initialDescendantSubTables,
}: AdminTableViewProps) {
  const router = useRouter();
  const {
    table,
    childTablesByCell,
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
    deleteSubTable,
  } = useAdminTableMutations({ initialTable, initialChildTablesByCell });

  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [subTablesDialogMode, setSubTablesDialogMode] =
    useState<SubTablesDialogMode | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(table.title);
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null);
  const [pendingSubTableDeletion, setPendingSubTableDeletion] =
    useState<PendingSubTableDeletion | null>(null);

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

  const getAdjacentCell = (
    current: ActiveCell,
    direction: CellNavigationDirection
  ): ActiveCell | null => {
    const rowIndex = table.rows.findIndex((row) => row.id === current.rowId);
    const colIndex = table.columns.findIndex(
      (column) => column.id === current.columnId
    );
    if (rowIndex === -1 || colIndex === -1) return null;

    if (direction === "next") {
      if (colIndex + 1 < table.columns.length) {
        return { rowId: current.rowId, columnId: table.columns[colIndex + 1].id };
      }
      if (rowIndex + 1 < table.rows.length) {
        return { rowId: table.rows[rowIndex + 1].id, columnId: table.columns[0].id };
      }
      return null;
    }

    if (direction === "prev") {
      if (colIndex - 1 >= 0) {
        return { rowId: current.rowId, columnId: table.columns[colIndex - 1].id };
      }
      if (rowIndex - 1 >= 0) {
        return {
          rowId: table.rows[rowIndex - 1].id,
          columnId: table.columns[table.columns.length - 1].id,
        };
      }
      return null;
    }

    if (direction === "down") {
      if (rowIndex + 1 < table.rows.length) {
        return { rowId: table.rows[rowIndex + 1].id, columnId: current.columnId };
      }
      return null;
    }

    if (rowIndex - 1 >= 0) {
      return { rowId: table.rows[rowIndex - 1].id, columnId: current.columnId };
    }
    return null;
  };

  const handleNavigate = (
    current: ActiveCell,
    direction: CellNavigationDirection
  ) => {
    setActiveCell(getAdjacentCell(current, direction));
  };

  const directSubTableCount = Object.values(childTablesByCell).reduce(
    (total, byColumn) =>
      total +
      Object.values(byColumn).reduce((sum, children) => sum + children.length, 0),
    0
  );
  const allSubTableCount = initialDescendantSubTables.length;

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
            onClick={() => setSubTablesDialogMode("all")}
          >
            Bütün alt cədvəllər
            {allSubTableCount > 0 ? (
              <span className={styles.subTableCountBadge}>{allSubTableCount}</span>
            ) : null}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setSubTablesDialogMode("direct")}
          >
            Alt cədvəllər
            {directSubTableCount > 0 ? (
              <span className={styles.subTableCountBadge}>
                {directSubTableCount}
              </span>
            ) : null}
          </Button>
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
                    {table.columns.map((column) => {
                      const cellSubTables =
                        childTablesByCell[row.id]?.[column.id] ?? [];
                      const firstSubTable = cellSubTables[0];
                      const cellKey: ActiveCell = {
                        rowId: row.id,
                        columnId: column.id,
                      };
                      const isEditing =
                        activeCell?.rowId === row.id &&
                        activeCell?.columnId === column.id;

                      return (
                        <td key={column.id}>
                          <EditableCell
                            value={row.values[column.key] ?? ""}
                            isEditing={isEditing}
                            onStartEdit={() => setActiveCell(cellKey)}
                            onCancelEdit={() =>
                              setActiveCell((current) =>
                                current?.rowId === row.id &&
                                current?.columnId === column.id
                                  ? null
                                  : current
                              )
                            }
                            onCommit={(value) =>
                              updateCell(row.id, column.id, value)
                            }
                            onNavigate={(direction) =>
                              handleNavigate(cellKey, direction)
                            }
                            subTableHref={
                              firstSubTable
                                ? `/admin/${[...path, firstSubTable.slug].join("/")}`
                                : undefined
                            }
                            onDeleteSubTable={
                              firstSubTable
                                ? () =>
                                    setPendingSubTableDeletion({
                                      rowId: row.id,
                                      columnId: column.id,
                                      childTableId: firstSubTable.id,
                                      title: firstSubTable.title,
                                    })
                                : undefined
                            }
                          />
                        </td>
                      );
                    })}
                    <td>
                      <RowActionsCell
                        row={row}
                        columns={table.columns}
                        existingByColumn={childTablesByCell[row.id] ?? {}}
                        path={path}
                        isPending={isPending}
                        onCreateSubTable={(columnId, title) =>
                          createSubTable(row.id, columnId, title, (childTable) => {
                            router.push(
                              `/admin/${[...path, childTable.slug].join("/")}`
                            );
                          })
                        }
                        onDeleteSubTable={(columnId, childTableId) => {
                          deleteSubTable(row.id, columnId, childTableId);
                          router.refresh();
                        }}
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
        onSubmit={(label) => {
          addColumn(label);
          setIsAddColumnOpen(false);
        }}
        onCancel={() => setIsAddColumnOpen(false)}
      />

      <AllSubTablesDialog
        isOpen={subTablesDialogMode !== null}
        mode={subTablesDialogMode ?? "direct"}
        table={table}
        path={path}
        childTablesByCell={childTablesByCell}
        descendantSubTables={initialDescendantSubTables}
        onClose={() => setSubTablesDialogMode(null)}
      />

      <ConfirmDialog
        isOpen={Boolean(pendingSubTableDeletion)}
        title="Alt cədvəli sil"
        message={
          pendingSubTableDeletion
            ? `"${pendingSubTableDeletion.title}" alt cədvəlini (və varsa nəvə cədvəlləri) silmək istədiyinizə əminsiniz?`
            : ""
        }
        isPending={isPending}
        onConfirm={() => {
          if (pendingSubTableDeletion) {
            deleteSubTable(
              pendingSubTableDeletion.rowId,
              pendingSubTableDeletion.columnId,
              pendingSubTableDeletion.childTableId
            );
            router.refresh();
          }
          setPendingSubTableDeletion(null);
        }}
        onCancel={() => setPendingSubTableDeletion(null)}
      />
    </div>
  );
}
