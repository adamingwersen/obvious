"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon, ChevronDown } from "lucide-react";

// Data structure
interface HierarchicalData {
  [key: string]: {
    [key: string]: string[];
  };
}

const data: HierarchicalData = {
  X1: {
    Y1: ["Z1", "Z2"],
    Y2: ["Z3", "Z4"],
  },
  X2: {
    Y3: ["Z5", "Z6"],
    Y4: ["Z7", "Z8"],
  },
};

// Utility functions
const getOptionsForX = (): string[] => Object.keys(data);

const getAllOptionsForY = (): string[] => {
  return Object.values(data).flatMap(Object.keys);
};

const getAllOptionsForZ = (): string[] => {
  return Object.values(data).flatMap((yObj) => Object.values(yObj).flat());
};

const getOptionsForY = (selectedX: string): string[] =>
  selectedX ? Object.keys(data[selectedX]) : getAllOptionsForY();
const getOptionsForZ = (selectedX: string, selectedY: string): string[] =>
  selectedX && selectedY ? data[selectedX][selectedY] : getAllOptionsForZ();

export function HierarchicalSelect() {
  // State for selections
  const [selectedX, setSelectedX] = React.useState<string>("");
  const [selectedY, setSelectedY] = React.useState<string>("");
  const [selectedZ, setSelectedZ] = React.useState<string>("");
  const [openX, setOpenX] = React.useState<boolean>(false);
  const [openY, setOpenY] = React.useState<boolean>(false);
  const [openZ, setOpenZ] = React.useState<boolean>(false);

  // Handlers for selection changes
  const handleXChange = (value: string) => {
    setSelectedX(value);
    setSelectedY("");
    setSelectedZ("");
  };

  const handleYChange = (value: string) => {
    setSelectedY(value);
    setSelectedZ("");

    // Automatically set X based on Y selection
    for (const [xKey, yObj] of Object.entries(data)) {
      if (value in yObj) {
        setSelectedX(xKey);
        break;
      }
    }
  };

  const handleZChange = (value: string) => {
    setSelectedZ(value);

    // Automatically set X and Y based on Z selection
    for (const [xKey, yObj] of Object.entries(data)) {
      for (const [yKey, zArray] of Object.entries(yObj)) {
        if (zArray.includes(value)) {
          setSelectedX(xKey);
          setSelectedY(yKey);
          break;
        }
      }
    }
  };

  return (
    <div className="space-y-4 p-4">
      {/* Combobox for X */}
      <Popover open={openX} onOpenChange={setOpenX}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openX}
            className="w-full justify-between"
          >
            {selectedX || "Select X"}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search X..." className="h-9" />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {getOptionsForX().map((x) => (
                  <CommandItem
                    key={x}
                    value={x}
                    onSelect={(currentValue) => {
                      handleXChange(currentValue);
                      setOpenX(false);
                    }}
                  >
                    {x}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedX === x ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Combobox for Y */}
      <Popover open={openY} onOpenChange={setOpenY}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openY}
            className="w-full justify-between"
          >
            {selectedY || "Select Y"}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search Y..." className="h-9" />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {getOptionsForY(selectedX).map((y) => (
                  <CommandItem
                    key={y}
                    value={y}
                    onSelect={(currentValue) => {
                      handleYChange(currentValue);
                      setOpenY(false);
                    }}
                  >
                    {y}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedY === y ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Combobox for Z */}
      <Popover open={openZ} onOpenChange={setOpenZ}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openZ}
            className="w-full justify-between"
          >
            {selectedZ || "Select Z"}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search Z..." className="h-9" />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {getOptionsForZ(selectedX, selectedY).map((z) => (
                  <CommandItem
                    key={z}
                    value={z}
                    onSelect={(currentValue) => {
                      handleZChange(currentValue);
                      setOpenZ(false);
                    }}
                  >
                    {z}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedZ === z ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

import {
  drData,
  esrsData,
  type DisclosureRequirementType,
  type EsrsDataPoint,
} from "@/types/esrs/esrs-data";
import { useState } from "react";

export const ESRSSelector = () => {
  const categories = ["Environment", "Social", "Governance"];

  const topics = esrsData.reduce((acc, dp) => {
    if (!acc.includes(dp.topic)) {
      acc.push(dp.topic);
    }
    return acc;
  }, [] as string[]);

  const reportingAreas = esrsData.reduce((acc, dp) => {
    if (!acc.includes(dp.reportingArea)) {
      acc.push(dp.reportingArea);
    }
    return acc;
  }, [] as string[]);

  console.log(topics);
  console.log(reportingAreas);
  console.log(drData);
  console.log(esrsData);

  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedRA, setSelectedRA] = useState<string>("");

  const [isTopicOpen, setIsTopicOpen] = useState<boolean>(false);
  const [isRAOpen, setIsRAOpen] = useState<boolean>(false);

  return (
    <div className="w-96">
      {/* <Popover open={isTopicOpen} onOpenChange={setIsTopicOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isTopicOpen}
            className="w-full justify-between"
          >
            {selectedTopic || "Select Topic"}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search topic..." className="h-9" />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {getOptionsForX().map((x) => (
                  <CommandItem
                    key={x}
                    value={x}
                    onSelect={(currentValue) => {
                      handleXChange(currentValue);
                      setOpenX(false);
                    }}
                  >
                    {x}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedX === x ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover> */}
    </div>
  );
};
