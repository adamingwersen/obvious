"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  drData,
  esrsData,
  DisclosureRequirementType,
  EsrsDataPoint,
} from "@/types/esrs/esrs-data";
import {
  ESRS_TOPIC_TYPES,
  ESRS_DR_TYPES,
  XBRL_DATA_TYPES,
} from "@/types/esrs/esrs-types";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { error } from "console";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon, ChevronDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type esrsUtilityType = {
  esrs: string;
  name: string;
};

type TopicType = {
  name: string;
  topics: esrsUtilityType[];
};

type DRType = {
  reportingArea: string;
  disclosureRequirements: DisclosureRequirementType[];
};

type DPType = {
  disclosureReqirement: string;
  esrsDataPoints: EsrsDataPoint[];
};

const newDRStoreData = drData.reduce((acc, dr) => {
  const repAreaObj = acc.filter((x) => x.reportingArea === dr.reportingArea);
  if (repAreaObj.length === 0) {
    acc.push({
      reportingArea: dr.reportingArea,
      disclosureRequirements: [dr],
    });
  } else if (repAreaObj.length === 1) {
    const firstObj = repAreaObj[0];
    if (!firstObj) throw new Error("This shouldn't happen");
    firstObj.disclosureRequirements.push(dr);
  } else {
    throw new Error("This shouldn't happen2");
  }

  return acc;
}, [] as DRType[]);

const newDPStoreData = esrsData.reduce((acc, dp) => {
  const drObjs = acc.filter(
    (x) => x.disclosureReqirement === dp.disclosureRequirement,
  );
  if (drObjs.length === 0) {
    acc.push({
      disclosureReqirement: dp.disclosureRequirement,
      esrsDataPoints: [dp],
    });
  } else if (drObjs.length === 1) {
    const firstObj = drObjs[0];
    if (!firstObj) throw new Error("This shouldn't happen");
    firstObj.esrsDataPoints.push(dp);
  } else {
    throw new Error("This shouldn't happen2");
  }

  return acc;
}, [] as DPType[]);

const RootPage = () => {
  const [topicStore, setTopicStore] = useState<TopicType[]>([
    {
      name: "Environment",
      topics: [
        { esrs: "E1", name: "Climate Change" },
        { esrs: "E2", name: "Pollution" },
        { esrs: "E3", name: "Water and Marine Resources" },
        { esrs: "E4", name: "Biodiversity and Ecosystems" },
        { esrs: "E5", name: "Resource Use and Circular Economy" },
      ],
    },
    {
      name: "Social",
      topics: [
        { esrs: "S1", name: "Own Workforce" },
        { esrs: "S2", name: "Workers in the Value Chain" },
        { esrs: "S3", name: "Affected Communities" },
        { esrs: "S4", name: "Consumers and End-users" },
      ],
    },
    {
      name: "Governance",
      topics: [{ esrs: "G1", name: "Business Conduct" }],
    },
  ]);

  console.log(newDRStoreData);
  // console.log(newDPStoreData);

  const [drStore, setDrStore] = useState<DRType[]>(newDRStoreData);
  const [esrsStore, setEsrsStore] = useState<DPType[]>(newDPStoreData);

  const [topicOpen, setTopicOpen] = useState<boolean>(false);
  const [drOpen, setDrOpen] = useState<boolean>(false);
  const [dpOpen, setDpOpen] = useState<boolean>(false);

  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDR, setSelectedDR] = useState("");
  const [selectedDP, setSelectedDP] = useState("");
  const [selectedDPObject, setSelectedDPObject] =
    useState<EsrsDataPoint | null>(null);

  const onTopicSelected = (topic: string) => {
    const newTopic = topic !== selectedTopic ? topic : "";
    console.log("newTopic", newTopic);
    // If we set top we need to reset lower
    setSelectedTopic(newTopic);
    setSelectedDR("");
    setSelectedDP("");
    setSelectedDPObject(null);

    // Reset case
    if (newTopic === "") {
      setDrStore(newDRStoreData);
      setEsrsStore(newDPStoreData);
    } else {
      // Find subset of DPs that match topic
      const _newDRStoreData: DRType[] = [];
      newDRStoreData.forEach((dr) => {
        const drs = dr.disclosureRequirements.filter((x) => x.topic === topic);
        if (drs.length > 0) {
          _newDRStoreData.push({
            reportingArea: dr.reportingArea,
            disclosureRequirements: drs,
          });
        }
      });

      // Find subset of DPs that match topic
      const _newDpStoreData: DPType[] = [];
      newDPStoreData.forEach((dp) => {
        const dps = dp.esrsDataPoints.filter((x) => x.topic === topic);
        if (dps.length > 0) {
          _newDpStoreData.push({
            disclosureReqirement: dp.disclosureReqirement,
            esrsDataPoints: dps,
          });
        }
      });

      setDrStore(_newDRStoreData);
      setEsrsStore(_newDpStoreData);
    }
    setTopicOpen(false);
  };

  const onDRSelected = (selectedDr: DisclosureRequirementType) => {
    // We can infer topic and reset datapoint

    const newDR =
      selectedDr.disclosureRequirement == selectedDR
        ? ""
        : selectedDr.disclosureRequirement;

    if (newDR === "") {
      setSelectedDR("");
      setSelectedDP("");
      setSelectedDPObject(null);
      setDrStore(newDRStoreData);
      setEsrsStore(newDPStoreData);
    } else {
      setSelectedTopic(selectedDr.topic);
      setSelectedDR(selectedDr.disclosureRequirement);
      setSelectedDP("");
      setSelectedDPObject(null);

      // Update possible datapoints
      // Find subset of DPs that match topic
      const _newDpStoreData: DPType[] = [];
      newDPStoreData.forEach((dp) => {
        const dps = dp.esrsDataPoints.filter(
          (x) => x.disclosureRequirement === selectedDr.disclosureRequirement,
        );
        if (dps.length > 0) {
          _newDpStoreData.push({
            disclosureReqirement: dp.disclosureReqirement,
            esrsDataPoints: dps,
          });
        }
      });
      setEsrsStore(_newDpStoreData);
    }
    setDrOpen(false);
  };

  const onDPSelected = (selectedDp: EsrsDataPoint) => {
    const newDP =
      selectedDp.datapointId == selectedDP ? "" : selectedDp.datapointId;

    if (newDP === "") {
      setSelectedDP("");
      setSelectedDPObject(null);
    } else {
      setSelectedDR(selectedDp.disclosureRequirement);
      setSelectedTopic(selectedDp.topic);
      setSelectedDP(selectedDp.datapointName);
      setSelectedDPObject(selectedDp);
    }
    setDpOpen(false);
  };

  const onClear = () => {
    setSelectedTopic("");
    setSelectedDR("");
    setSelectedDP("");
    setSelectedDPObject(null);

    setDrStore(newDRStoreData);
    setEsrsStore(newDPStoreData);
  };

  return (
    <div className=" mx-auto flex w-1/3 flex-col space-y-10">
      {/* <p>Home Page</p>
    <Link href="/survey/create">
      <Button>Create survey</Button>
    </Link> */}
      <div className="flex h-full flex-col items-center justify-start space-y-2 pt-10">
        <div className="w-full">
          <div className="flex items-center justify-between py-2">
            <h1>Align with standard</h1>
            <Button variant="outline" onClick={onClear}>
              Reset selection
            </Button>
          </div>
          <Popover open={topicOpen} onOpenChange={setTopicOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {selectedTopic || "Sustainability Topic"}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search topic..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No option found.</CommandEmpty>

                  {topicStore.map((t) => {
                    return (
                      <CommandGroup heading={t.name} key={t.name}>
                        {t.topics.map((es) => {
                          return (
                            <CommandItem
                              value={es.name}
                              key={es.esrs}
                              onSelect={onTopicSelected}
                            >
                              <div className="flex gap-2 text-left">
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    selectedTopic === es.name
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {es.name}
                              </div>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    );
                  })}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <p className="flex w-full justify-end text-xs text-gray-300">
            {topicStore.reduce((acc, x) => acc + x.topics.length, 0)}
          </p>
        </div>
        <div className="w-full">
          <Popover open={drOpen} onOpenChange={setDrOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                // aria-expanded={topicOpen}
                className="w-full justify-between"
              >
                {selectedDR || "Disclosure requirements"}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Search disclosure requirement..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No option found.</CommandEmpty>

                  {drStore.map((drType) => {
                    return (
                      <CommandGroup
                        heading={drType.reportingArea}
                        key={drType.reportingArea}
                      >
                        {drType.disclosureRequirements.map((dr) => {
                          return (
                            <CommandItem
                              value={`${dr.disclosureRequirement} ${dr.drName}`}
                              key={`${dr.uuid}-${dr.esrs}`}
                              onSelect={() => onDRSelected(dr)}
                            >
                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <div className="flex w-full items-center justify-start gap-2 text-left">
                                    <CheckIcon
                                      className={cn(
                                        " h-4 w-4",
                                        selectedDR === dr.disclosureRequirement
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    <p>{dr.disclosureRequirement}</p>
                                  </div>
                                </HoverCardTrigger>

                                {/* <Button variant="link">
                                      
                                    </Button> */}

                                <HoverCardContent className="w-80">
                                  <div className="flex justify-between space-x-4">
                                    <div className="space-y-1">
                                      <h4 className="text-sm font-semibold">
                                        {dr.disclosureRequirement}
                                      </h4>
                                      <p className="text-sm">{dr.drName}</p>
                                    </div>
                                  </div>
                                </HoverCardContent>
                                {/* {dr.disclosureRequirement} - {dr.drName} */}
                              </HoverCard>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    );
                  })}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <p className="flex w-full justify-end text-xs text-gray-300">
            {drStore.reduce(
              (acc, x) => acc + x.disclosureRequirements.length,
              0,
            )}
          </p>
        </div>
        <div className="w-full">
          <Popover open={dpOpen} onOpenChange={setDpOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                // aria-expanded={topicOpen}
                className="w-full justify-between"
              >
                {selectedDP || "Data points"}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Search data points..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No option found.</CommandEmpty>

                  {esrsStore.map((dpType) => {
                    return (
                      <CommandGroup
                        heading={dpType.disclosureReqirement}
                        key={dpType.disclosureReqirement}
                      >
                        {dpType.esrsDataPoints.map((dp) => {
                          return (
                            <CommandItem
                              value={dp.datapointName}
                              key={`${dp.uuid}-${dp.datapointId}`}
                              onSelect={() => onDPSelected(dp)}
                            >
                              <div className="flex gap-2 text-left">
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    selectedDP === dp.datapointName
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {dp.datapointId} - {dp.datapointName}
                              </div>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    );
                  })}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <p className="flex w-full justify-end text-xs text-gray-300">
            {esrsStore.reduce((acc, x) => acc + x.esrsDataPoints.length, 0)}
          </p>
        </div>
      </div>
      {selectedDPObject !== null && (
        <div className="mx-auto w-2/3">
          <h1 className="text-center font-extralight">
            Data point information
          </h1>
          <div>
            <span className="font-light">Topic: </span>
            <span className="font-extralight">{selectedDPObject.topic}</span>
          </div>
          <div>
            <span className="font-light">Disclosure requirement: </span>
            <span className="font-extralight">
              {selectedDPObject.disclosureRequirement}
            </span>
            <br />
            <span className="font-extralight">{selectedDPObject.drName}</span>
          </div>
          <div>
            <span className="font-light">Paragraph: </span>
            <a
              href={selectedDPObject.drLink}
              target="_blank"
              className="font-extralight underline"
            >
              {selectedDPObject.disclosureRequirement} -{" "}
              {selectedDPObject.paragraph}
            </a>
          </div>
          <div>
            <span className="font-light">Data point: </span>
            <span className="font-extralight">
              {selectedDPObject.datapointId}
            </span>
            <br />
            <span className="font-extralight">
              {selectedDPObject.datapointName}
            </span>
          </div>
          <div>
            <span className="font-light">Data type: </span>
            <span className="font-extralight">
              {selectedDPObject.xbrlDataType}
            </span>
          </div>
        </div>
      )}
      <div className="flex w-full justify-center">
        <Button variant="outline">Tag question with data point</Button>
      </div>
    </div>
  );
};
export default RootPage;
