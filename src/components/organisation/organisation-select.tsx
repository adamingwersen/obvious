"use client";

import { OrganisationModel } from "@/server/db/schema";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Button } from "../ui/button";

interface CreateUserProps {
  organisations: OrganisationModel[];
  handleCreateUser: (orgId: number) => Promise<void>;
}

export default function CreateUser({
  organisations,
  handleCreateUser,
}: CreateUserProps) {
  const [selectedOrg, setSelectedOrg] = useState<number>();
  const onDoneClicked = async () => {
    console.log(selectedOrg);
    if (!selectedOrg) return;
    await handleCreateUser(selectedOrg);
  };
  return (
    <div className="flex w-1/3 flex-col items-center justify-center gap-3">
      <Select onValueChange={(value) => setSelectedOrg(Number(value))}>
        <SelectTrigger className="">
          <SelectValue placeholder="Select an organisation" />
        </SelectTrigger>
        <SelectContent>
          {organisations.map((o) => {
            return <SelectItem value={o.id?.toString()}>{o.name}</SelectItem>;
          })}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        onClick={onDoneClicked}
        disabled={selectedOrg === undefined}
      >
        Done
      </Button>
    </div>
  );
}
