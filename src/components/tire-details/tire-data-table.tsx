
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
  { id: "T-001", name: "Michelin XZY3", vehicle: "Camion A2", site: "Site Alpha", currentMileage: 45000, pressure: 100, treadDepth: 8, status: "active", lastInspection: "2023-10-15T00:00:00.000Z" },
  { id: "T-002", name: "Goodyear Endurance", vehicle: "Fourgon C3", site: "Site Beta", currentMileage: 22000, pressure: 65, treadDepth: 5, status: "warning", lastInspection: "2023-11-01T00:00:00.000Z" },
  { id: "T-003", name: "Bridgestone R287", vehicle: "Camion B1", site: "Site Alpha", currentMileage: 78000, pressure: 110, treadDepth: 3, status: "critical", lastInspection: "2023-09-20T00:00:00.000Z" },
  { id: "T-004", name: "Continental Conti Hybrid", vehicle: "Chariot D5", site: "Site Gamma", currentMileage: 12000, pressure: 90, treadDepth: 10, status: "active", lastInspection: "2023-11-10T00:00:00.000Z" },
  { id: "T-005", name: "Pirelli P-Zero", vehicle: "Camion A2", site: "Site Beta", currentMileage: 60000, pressure: 105, treadDepth: 6, status: "active", lastInspection: "2023-10-25T00:00:00.000Z" },
];

const getStatusBadgeVariant = (status: Tire['status']) => {
  switch (status) {
    case 'active': return 'default';
    case 'warning': return 'secondary';
    case 'critical': return 'destructive';
    case 'maintenance': return 'outline';
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
        aria-label="Tout sélectionner"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Sélectionner la ligne"
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
        Nom du Pneu
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "vehicle",
    header: "Véhicule",
  },
  {
    accessorKey: "site",
    header: "Site",
  },
  {
    accessorKey: "currentMileage",
    header: "Kilométrage (km)",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("currentMileage"))
      return <div className="text-right font-medium">{amount.toLocaleString('fr-FR')}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => <Badge variant={getStatusBadgeVariant(row.getValue("status"))} className="capitalize">{row.getValue("status")}</Badge>,
  },
  {
    accessorKey: "lastInspection",
    header: "Dernière Inspection",
    cell: ({ row }) => new Date(row.getValue("lastInspection")).toLocaleDateString('fr-FR'),
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
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(tire.id)}>
              Copier ID Pneu
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Voir détails</DropdownMenuItem>
            <DropdownMenuItem>Enregistrer maintenance</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function TireDataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [data] = React.useState<Tire[]>(mockData);
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
        <CardTitle>Inventaire Détaillé des Pneus</CardTitle>
        <CardDescription>
          Liste exhaustive de tous les pneus. Des contrôles avancés de filtrage et de groupement peuvent être ajoutés.
          Supporte actuellement le filtrage textuel simple et le tri par Nom du Pneu.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center py-4">
          <Input
            placeholder="Filtrer les pneus..."
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
                    Aucun résultat.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} sur{" "}
            {table.getFilteredRowModel().rows.length} ligne(s) sélectionnée(s).
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
