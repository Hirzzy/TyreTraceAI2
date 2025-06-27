
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
import { ArrowUpDown, MoreHorizontal, PlusCircle } from "lucide-react";
import type { Vehicle } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const mockVehicles: Vehicle[] = [
  { id: "V-001", immatriculation: "AB-123-CD", fleetNumber: "A-12", context: "Dumper", status: 'ok', lastInspectionDate: "15/06/2024", activityStatus: 'Actif' },
  { id: "V-002", immatriculation: "EF-456-GH", fleetNumber: "B-04", context: "Chargeuse", status: 'attention', lastInspectionDate: "01/06/2024", activityStatus: 'Actif' },
  { id: "V-003", immatriculation: "IJ-789-KL", fleetNumber: "C-01", context: "Niveleuse", status: 'urgent', lastInspectionDate: "20/05/2024", activityStatus: 'Inactif' },
  { id: "V-004", immatriculation: "MN-012-OP", fleetNumber: "A-13", context: "Dumper", status: 'ok', lastInspectionDate: "18/06/2024", activityStatus: 'Actif' },
  { id: "V-005", immatriculation: "QR-345-ST", fleetNumber: "D-05", context: "Utilitaire", status: 'ok', lastInspectionDate: "22/06/2024", activityStatus: 'Actif' },
];

const getStatusBadgeVariant = (status: Vehicle['status']) => {
  switch (status) {
    case 'ok': return 'default';
    case 'attention': return 'secondary';
    case 'urgent': return 'destructive';
    default: return 'outline';
  }
};

export const columns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: "fleetNumber",
    header: "N° Flotte",
  },
  {
    accessorKey: "immatriculation",
    header: "Immatriculation",
  },
  {
    accessorKey: "context",
    header: "Type",
  },
  {
    accessorKey: "lastInspectionDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Dernière Inspection
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => <Badge variant={getStatusBadgeVariant(row.getValue("status"))} className="capitalize">{row.getValue("status")}</Badge>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const vehicle = row.original;
      return (
        <div className="text-right">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Ouvrir le menu</span>
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => alert(`Voir détails du véhicule ${vehicle.id}`)}>
                Voir détails
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert(`Lancer inspection pour ${vehicle.id}`)}>
                Lancer une inspection
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                Supprimer le véhicule
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      );
    },
  },
];

export function VehicleList() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [data] = React.useState<Vehicle[]>(mockVehicles);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="w-full space-y-4">
        <div className="flex justify-end">
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter un véhicule
            </Button>
        </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
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
                  Aucun véhicule trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
