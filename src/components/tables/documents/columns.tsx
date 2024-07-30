"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { type DocumentType } from "./data-table";

import { Button } from "@/components/ui/button";
import { ChevronsUpDown, CloudDownloadIcon } from "lucide-react";

export const columns: ColumnDef<DocumentType>[] = [
  {
    accessorKey: "name",
    header: "Document name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "survey",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Survey
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("survey")}</div>
    ),
  },
  {
    accessorKey: "question",
    header: () => <div className="text-right">Question</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("question")}</div>
      );
    },
  },
  {
    accessorKey: "tags",
    header: () => <div className="text-right">Tags</div>,
    cell: ({ row }) => {
      const tags = row.original.tags;
      //   <div className="mx-auto flex space-x-2">
      //           {tags.topic && (
      //             <Badge className="whitespace-nowrap bg-nightsky-700">
      //               {tags.topic}
      //             </Badge>
      //           )}
      //           {tags.disclosureRequirement && (
      //             <Badge className="whitespace-nowrap bg-nightsky-500">
      //               {tags.disclosureRequirement}
      //             </Badge>
      //           )}
      //           {tags.datapoint && (
      //             <Badge className="whitespace-nowrap bg-aquamarine-400">
      //               {tags.datapoint}
      //             </Badge>
      //           )}
      //           {tags.dataType && tags.dataType.xbrlDataType !== "None" && (
      //             <Badge className="whitespace-nowrap bg-sand-200">
      //               {tags.dataType.displayName}
      //               {tags.dataType.unit ? ` : ${tags.dataType.unit}` : ""}
      //             </Badge>
      //           )}
      //         </div>
      return (
        <div className="flex flex-col flex-wrap">
          {tags.map((t) => {
            return (
              <div key={t} className="text-right font-medium">
                {t}
              </div>
            );
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "link",
    header: () => <div className="text-right">Download</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => console.log("Im downloading", row.original)}
          >
            <CloudDownloadIcon size={14}></CloudDownloadIcon>
          </Button>
        </div>
      );
    },
  },
];
