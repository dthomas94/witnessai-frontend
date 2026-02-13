import { useState, type ReactNode } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type Updater,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useNavigate } from "react-router";
import { Button, Card, TextField } from "@radix-ui/themes";

type ConversationsListProps<ConversationEntity> = {
  title?: string;

  // Server paging inputs (same shape you already use)
  pagination: PaginationState & { total: number };

  // Rows for the current page
  data: ConversationEntity[];

  // TanStack column defs (still required for filtering/sorting + rendering)
  columns: ColumnDef<ConversationEntity, any>[];

  // When a row is clicked
  onRowClick: (row: ConversationEntity) => void;

  // Optional actions in header (Refresh/Export)
  actions?: ReactNode;
};

/**
 * Chat-style Conversations view driven by TanStack Table state
 * - No Radix Table / HTML table
 * - Still uses TanStack for filtering + pagination + sorting state
 */
export function ConversationsList<ConversationEntity>({
  title = "Conversations",
  pagination,
  data,
  columns,
  onRowClick,
  actions,
}: ConversationsListProps<ConversationEntity>) {
  const navigate = useNavigate();

  // TanStack state
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,

    // Server pagination
    manualPagination: true,
    pageCount: Math.max(1, Math.ceil(pagination.total / pagination.pageSize)),
    rowCount: pagination.total,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    state: {
      pagination,
      globalFilter,
      columnFilters,
      sorting,
    },

    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,

    onPaginationChange: (updater: Updater<PaginationState>) => {
      const next =
        typeof updater === "function" ? updater(pagination) : updater;
      navigate(`?page=${next.pageIndex + 1}&limit=${next.pageSize}`);
    },
  });

  const totalPages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  return (
    <div className="w-full h-full px-6 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold leading-none">{title}</h3>
          <span className="text-sm text-gray-500">
            {pagination.total} results
          </span>
        </div>

        {actions ? <div className="flex gap-2">{actions}</div> : null}
      </div>

      <Card className="shadow-sm ">
        {/* Search */}
        <div className="p-4">
          <TextField.Root
            placeholder="Search..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />

          {/* Clear search */}
          {globalFilter ? (
            <div className="flex justify-end mt-2">
              <Button variant="ghost" onClick={() => setGlobalFilter("")}>
                Clear search
              </Button>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col h-[calc(100vh-275px)] min-h-0 overflow-scroll">
          {/* List */}
          <div className="border-t border-slate-200 min-h-0 min-w-[400px]">
            {table.getRowModel().rows.length === 0 ? (
              <div className="p-10">
                <div className="flex flex-col items-center gap-2">
                  <span className="font-medium">No conversations found</span>
                  <span className="text-sm text-gray-500">
                    Try a different search.
                  </span>
                </div>
              </div>
            ) : (
              <div>
                {table.getRowModel().rows.map((row) => {
                  const cells = row.getVisibleCells();
                  const titleCell = cells[0];
                  const secondaryCell = cells[1];
                  const timeCell = cells[2];

                  const titleNode = titleCell
                    ? flexRender(
                        titleCell.column.columnDef.cell,
                        titleCell.getContext(),
                      )
                    : "Untitled conversation";

                  const secondaryNode = secondaryCell
                    ? flexRender(
                        secondaryCell.column.columnDef.cell,
                        secondaryCell.getContext(),
                      )
                    : null;

                  const timeNode = timeCell
                    ? flexRender(
                        timeCell.column.columnDef.cell,
                        timeCell.getContext(),
                      )
                    : null;

                  return (
                    <div
                      key={row.id}
                      onClick={() => onRowClick(row.original)}
                      className="w-full text-left px-4 py-3 border-b cursor-pointer border-slate-100 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0">
                          <span className="font-bold truncate">
                            {titleNode}
                          </span>

                          {secondaryNode ? (
                            <span className="text-sm text-gray-500 truncate mt-1">
                              {secondaryNode}
                            </span>
                          ) : null}
                        </div>

                        <div className="shrink-0">
                          <span className="text-sm text-gray-500">
                            {timeNode}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer / Pagination */}
        <div className="flex justify-between items-center flex-wrap gap-3 pt-4 pb-2 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <Button
              variant="soft"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </Button>
            <Button
              variant="soft"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Prev
            </Button>
            <Button
              variant="soft"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
            <Button
              variant="soft"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              {">>"}
            </Button>
          </div>

          <span className="text-sm text-gray-500 ml-2">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>

          <div className="flex items-center gap-2">
            {[10, 25, 50].map((size) => (
              <Button
                key={size}
                variant={
                  table.getState().pagination.pageSize === size
                    ? "solid"
                    : "soft"
                }
                onClick={() => table.setPageSize(size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
