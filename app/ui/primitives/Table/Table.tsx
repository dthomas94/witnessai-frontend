import {
  type Column,
  type ColumnDef,
  type PaginationState,
  type Table,
  type Updater,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useNavigate } from "react-router";
import {
  Button,
  Select,
  Table as TablePrimitive,
  TextField,
} from "@radix-ui/themes";

type TableProps<T> = {
  pagination: PaginationState & { total: number };
  data: T[];
  columns: ColumnDef<T>[];
  onRowClick?: (row: T) => void;
};

export function Table<T>({
  pagination,
  data,
  columns,
  onRowClick,
}: TableProps<T>) {
  const navigate = useNavigate();
  const table = useReactTable({
    columns,
    data,
    debugTable: true,
    manualPagination: true, // turn off client-side pagination
    pageCount: Math.ceil(pagination.total / pagination.pageSize),
    rowCount: pagination.total,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (updater: Updater<PaginationState>) => {
      const newPagination =
        typeof updater === "function" ? updater(pagination) : updater;
      navigate(
        `?page=${newPagination.pageIndex + 1}&limit=${newPagination.pageSize}`,
      );
    },
    state: {
      pagination,
    },
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
  });

  return (
    <div className="px-2 flex flex-col gap-2">
      <TablePrimitive.Root className="w-full h-full mb-2">
        <TablePrimitive.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <TablePrimitive.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TablePrimitive.ColumnHeaderCell
                    key={header.id}
                    colSpan={header.colSpan}
                    className="sticky top-0"
                  >
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                      {header.column.getCanFilter() ? (
                        <div>
                          <Filter column={header.column} table={table} />
                        </div>
                      ) : null}
                    </div>
                  </TablePrimitive.ColumnHeaderCell>
                );
              })}
            </TablePrimitive.Row>
          ))}
        </TablePrimitive.Header>
        <TablePrimitive.Body className="overflow-scroll h-full">
          {table.getRowModel().rows.map((row) => {
            return (
              <TablePrimitive.Row
                key={row.id}
                onClick={() => onRowClick?.(row.original)}
                className="border hover:bg-gray-500 cursor-pointer"
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TablePrimitive.Cell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TablePrimitive.Cell>
                  );
                })}
              </TablePrimitive.Row>
            );
          })}
        </TablePrimitive.Body>
      </TablePrimitive.Root>
      <div className="flex items-center gap-4 w-full sticky bottom-0">
        <Button
          className="border rounded p-1"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </Button>
        <Button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </Button>
        <Button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </Button>
        <Button
          className="border rounded p-1"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </Button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>

        <Select.Root
          defaultValue={table.getState().pagination.pageSize.toString()}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
          value={table.getState().pagination.pageSize.toString()}
        >
          <Select.Trigger />
          <Select.Content>
            {[10, 25, 50, 100].map((pageSize) => (
              <Select.Item key={pageSize} value={pageSize.toString()}>
                Show {pageSize}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>
      <div>
        Showing {table.getRowModel().rows.length.toLocaleString()} of{" "}
        {table.getRowCount().toLocaleString()} Rows
      </div>
    </div>
  );
}

function Filter({
  column,
  table,
}: {
  column: Column<any, any>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === "number" ? (
    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
      <TextField.Root
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <TextField.Root
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder={`Max`}
        className="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <TextField.Root
      onChange={(e) => column.setFilterValue(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      placeholder="Search..."
      type="text"
      value={(columnFilterValue ?? "") as string}
    />
  );
}
