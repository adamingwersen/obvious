"use client";

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
import { type SurveyWithRelationsModel } from "@/server/db/schema";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export const DataTableColumns: ColumnDef<SurveyWithRelationsModel>[] = [
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
    accessorKey: "title",
    header: "Survey title",
    cell: ({ row }) => {
      const surveyTitle = row.original.title;
      return <div className="flex -space-x-2 font-bold">{surveyTitle}</div>;
    },
  },
  // TODO:
  // New survey fields
  {
    accessorKey: "createdBy",
    header: "Created by",
    cell: ({ row }) => {
      const createdBy = row.original.user.firstName;
      return <div className="flex -space-x-2">{createdBy}</div>;
    },
  },

  {
    accessorKey: "questions",
    header: "Number of questions",
    cell: ({ row }) => {
      const nQuestions = row.original.questions.length;
      return <div className="flex -space-x-2">{nQuestions}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const createdDate = row.original.createdAt;
      return (
        <div className="flex -space-x-2">{createdDate.toDateString()}</div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
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
            <Link href={`/survey/${row.original.uuid}/configure`}>
              <DropdownMenuItem>Go to survey</DropdownMenuItem>
            </Link>
            <Link href={`/survey/${row.original.uuid}/configure`}>
              <DropdownMenuItem>Go to answers</DropdownMenuItem>
            </Link>

            <DropdownMenuSeparator />
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuItem>Disable</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
