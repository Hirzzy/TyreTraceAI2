
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
import type { Vehicle } from "@/types/vehicle";
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
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";


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
    accessorKey: "category",
    header: "Catégorie",
    cell: ({ row }) => row.original.category?.split('–')[1]?.trim() || 'N/A',
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
      const router = useRouter();
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
                <DropdownMenuItem onClick={() => router.push(`/dashboard/vehicles/${vehicle.id}`)}>
                 Voir la fiche
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/selection/type-vehicule')}>
                  Nouvelle inspection
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                 Archiver
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      );
    },
  },
];

export function VehicleList() {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [data, setData] = React.useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      const storedVehicles = localStorage.getItem('vehicles');
      if (storedVehicles) {
        setData(JSON.parse(storedVehicles));
      }
    } catch (e) {
      console.error("Failed to load vehicles from localStorage", e);
      // Handle error, maybe show a toast
    } finally {
      setIsLoading(false);
    }
  }, []);

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
  
  const navigateToVehicle = (vehicleId: string) => {
    router.push(`/dashboard/vehicles/${vehicleId}`);
  };


  return (
    <div className="w-full space-y-4">
        <div className="flex justify-end">
            <Button onClick={() => router.push('/selection/type-vehicule')}>
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
            {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell colSpan={columns.length}>
                            <Skeleton className="h-8 w-full" />
                        </TableCell>
                    </TableRow>
                ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => navigateToVehicle(row.original.id)}
                  className="cursor-pointer"
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
                  Aucun véhicule trouvé. Commencez par en ajouter un.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
