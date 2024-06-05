"use client";

import { handleArchiveSurvey } from "@/app/(protected)/survey/actions";
import { Badge } from "@/components/ui/badge";
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
      return <div className="flex font-medium">{surveyTitle}</div>;
    },
  },
  {
    accessorKey: "createdBy",
    header: "Created by",
    cell: ({ row }) => {
      const createdBy = row.original.user.firstName;
      return <div className="flex ">{createdBy}</div>;
    },
  },
  {
    accessorKey: "surveyStatus",
    header: "Status",
    // TODO: Fix filtering and actions based on STATUS
    cell: ({ row }) => {
      if (row.original.surveyStatus === "DRAFT")
        return <Badge variant="yellow">Draft</Badge>;
      if (row.original.surveyStatus === "PAUSED") {
        return <Badge variant="outline">Paused</Badge>;
      }
      if (row.original.surveyStatus === "ACTIVE") {
        return <Badge variant="green">Active</Badge>;
      }
      if (row.original.surveyStatus === "ARCHIVED") {
        return <Badge variant="secondary">Archived</Badge>;
      }
    },
  },

  {
    accessorKey: "questions",
    header: "# Questions",
    cell: ({ row }) => {
      const nQuestions = row.original.questions.length;
      return <div className="flex">{nQuestions}</div>;
    },
  },
  {
    accessorKey: "dueAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dueAtDate = row.original.dueAt;
      const dueAtDateString = dueAtDate ? dueAtDate.toDateString() : "Not set";
      if (dueAtDateString === "Not set") {
        return <Badge variant="red">{dueAtDateString}</Badge>;
      }
      return <div className="flex">{dueAtDateString}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created date",
    cell: ({ row }) => {
      const createdDate = row.original.createdAt;
      return <div className="flex">{createdDate.toDateString()}</div>;
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
            <Link href={`/survey/${row.original.uuid}/answer`}>
              <DropdownMenuItem>Go to answers</DropdownMenuItem>
            </Link>
            <Link href={`/survey/${row.original.uuid}/create`}>
              <DropdownMenuItem>Edit questions</DropdownMenuItem>
            </Link>

            <Link href={`/survey/${row.original.uuid}/metadata`}>
              <DropdownMenuItem>Edit metadata</DropdownMenuItem>
            </Link>

            <DropdownMenuSeparator />
            {/* TODO: Fix URL with env or somehting */}
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(
                  `https://obvious.earth/respond/${row.original.uuid}`,
                )
              }
            >
              Copy link to survey
            </DropdownMenuItem>
            {/* <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(
                  `SurveyID: ${row.original.id} // CreatedByID: ${row.original.createdById}`,
                )
              }
            >
              Copy data fields for sharing
            </DropdownMenuItem> */}
            <Link href={`/survey/${row.original.uuid}/sharing`}>
              <DropdownMenuItem>Share</DropdownMenuItem>
            </Link>

            <DropdownMenuItem>Pause</DropdownMenuItem>

            <DropdownMenuItem
              className="text-red-500"
              // TODO: Figure out a way to handleArchiveSurvey for selectedRows in table model
              onClick={() => handleArchiveSurvey(row.original.id)}
            >
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
