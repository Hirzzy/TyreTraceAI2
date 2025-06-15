"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Tire } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const mockData: Tire[] = [
  { id: "T-001", name: "Michelin XZY3", vehicle: "Truck A2", site: "Site Alpha", currentMileage: 45000, pressure: 100, treadDepth: 8, status: "active", lastInspection: "2023-10-15T00:00:00.000Z" },
  { id: "T-002", name: "Goodyear Endurance", vehicle: "Van C3", site: "Site Beta", currentMileage: 22000, pressure: 65, treadDepth: 5, status: "warning", lastInspection: "2023-11-01T00:00:00.000Z" },
  { id: "T-003", name: "Bridgestone R287", vehicle: "Truck B1", site: "Site Alpha", currentMileage: 78000, pressure: 110, treadDepth: 3, status: "critical", lastInspection: "2023-09-20T00:00:00.000Z" },
  { id: "T-004", name: "Continental Conti Hybrid", vehicle: "Forklift D5", site: "Site Gamma", currentMileage: 12000, pressure: 90, treadDepth: 10, status: "active", lastInspection: "2023-11-10T00:00:00.000Z" },
  { id: "T-005", name: "Pirelli P-Zero", vehicle: "Truck A2", site: "Site Beta", currentMileage: 60000, pressure: 105, treadDepth: 6, status: "active", lastInspection: "2023-10-25T00:00:00.000Z" },
];

const getStatusBadgeVariant = (status: Tire['status']) => {
  switch (status) {
    case 'active': return 'default'; // Primary (blue)
    case 'warning': return 'secondary'; // Using secondary for warning (yellowish/greyish based on theme)
    case 'critical': return 'destructive'; // Red
    case 'maintenance': return 'outline'; // Neutral outline
    default: return 'outline';
  }
};

export const columns: ColumnDef<Tire>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Tire Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "vehicle",
    header: "Vehicle",
  },
  {
    accessorKey: "site",
    header: "Site",
  },
  {
    accessorKey: "currentMileage",
    header: "Mileage (km)",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("currentMileage"))
      return <div className="text-right font-medium">{amount.toLocaleString()}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge variant={getStatusBadgeVariant(row.getValue("status"))} className="capitalize">{row.getValue("status")}</Badge>,
  },
  {
    accessorKey: "lastInspection",
    header: "Last Inspection",
    cell: ({ row }) => new Date(row.getValue("lastInspection")).toLocaleDateString(),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const tire = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(tire.id)}>
              Copy Tire ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Log maintenance</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function TireDataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState<Tire[]>(mockData); // In a real app, this would come from props or API
  // Basic client-side filtering example
  const [filter, setFilter] = React.useState('');

  const filteredData = React.useMemo(() => {
    if (!filter) return data;
    return data.filter(tire => 
      Object.values(tire).some(value => 
        String(value).toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [data, filter]);


  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 w-full">
      <CardHeader>
        <CardTitle>Tire Inventory</CardTitle>
        <CardDescription>
          Detailed list of all tires. Advanced filtering and grouping controls can be added here.
          Currently supports basic text filtering and sorting by Tire Name.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter tires..."
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          {/* Pagination can be added here */}
        </div>
      </CardContent>
    </Card>
  );
}
