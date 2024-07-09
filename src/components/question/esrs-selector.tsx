"use client";
import { Button } from "@/components/ui/button";
import {
  DRStoreData,
  DPStoreData,
  esrsData,
  TopicStoreData,
  esrsDataTypes,
  type EsrsDataPoint,
  type esrsDataType,
  type DisclosureRequirementType,
  type DatapointDisclosureRequirementType,
  type DisclosureRequirementReportAreaType,
} from "@/types/esrs/esrs-data";

import { useCallback, useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import Spinner from "../ui/spinner";
import { type GippityESRSHelp } from "@/types/question";
import { type ESRSTags } from "./create-question-view";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

type ESRSSelectorParams = {
  gippity: (datapoint: EsrsDataPoint) => Promise<string>;
  tags: ESRSTags;
  setTags: React.Dispatch<React.SetStateAction<ESRSTags>>;
};
const ESRSSelector = ({ gippity, tags, setTags }: ESRSSelectorParams) => {
  const groupedDataTypes = esrsDataTypes.reduce(
    (acc, x) => {
      (acc[x.formDataType] = acc[x.formDataType] ?? []).push(x);
      return acc;
    },
    {} as Record<string, esrsDataType[]>,
  );
  const getDataPointFromTags = useCallback(
    (t: ESRSTags) => {
      if (!t) return null;
      if (!t.datapoint) return null;
      const dpObject = esrsData.find((x) => x.datapointId == tags.datapoint);
      if (!dpObject) return null;
      return dpObject;
    },
    [tags],
  );

  const getDataType = (xbrlName: string) => {
    const datatype = esrsDataTypes.find((x) => x.xbrlDataType === xbrlName);
    if (!datatype)
      return {
        xbrlDataType: "",
        displayName: "",
        formDataType: "text",
      } as esrsDataType;
    return datatype;
  };
  const selectedDataPoint = getDataPointFromTags(tags);

  const [loadingHelp, setLoadingHelp] = useState<boolean>(false);
  const [help, setHelp] = useState<GippityESRSHelp | null>(null);

  const [drStore, setDrStore] =
    useState<DisclosureRequirementReportAreaType[]>(DRStoreData);
  const [esrsStore, setEsrsStore] =
    useState<DatapointDisclosureRequirementType[]>(DPStoreData);

  const [topicOpen, setTopicOpen] = useState<boolean>(false);
  const [drOpen, setDrOpen] = useState<boolean>(false);
  const [dpOpen, setDpOpen] = useState<boolean>(false);

  const [selectedDPObject, setSelectedDPObject] =
    useState<EsrsDataPoint | null>(selectedDataPoint);

  useEffect(() => {
    setSelectedDPObject(getDataPointFromTags(tags));

    if (tags.datapoint === undefined) {
      setHelp(null);
    }
  }, [tags, getDataPointFromTags]);

  const onDataTypeSelected = (value: string) => {
    setTags((prev) => {
      return { ...prev, dataType: getDataType(value) };
    });
  };

  const onTopicSelected = (topic: string) => {
    const newTopic = topic !== tags.topic ? topic : undefined;

    // If we set top we need to reset lower
    setTags({
      topic: newTopic,
    });

    // Reset case
    if (newTopic === undefined) {
      setDrStore(DRStoreData);
      setEsrsStore(DPStoreData);
    } else {
      // Find subset of DPs that match topic
      const _newDRStoreData: DisclosureRequirementReportAreaType[] = [];
      DRStoreData.forEach((dr) => {
        const drs = dr.disclosureRequirements.filter((x) => x.topic === topic);
        if (drs.length > 0) {
          _newDRStoreData.push({
            reportingArea: dr.reportingArea,
            disclosureRequirements: drs,
          });
        }
      });

      // Find subset of DPs that match topic
      const _newDpStoreData: DatapointDisclosureRequirementType[] = [];
      DPStoreData.forEach((dp) => {
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
    const newDR =
      selectedDr.disclosureRequirement == tags.disclosureRequirement
        ? undefined
        : selectedDr.disclosureRequirement;

    if (newDR === undefined) {
      // Keep topic reset rest
      setTags((prev) => {
        return {
          topic: prev.topic,
        };
      });

      setDrStore(DRStoreData);
      setEsrsStore(DPStoreData);
    } else {
      setTags({
        topic: selectedDr.topic,
        disclosureRequirement: selectedDr.disclosureRequirement,
      });

      // Update possible datapoints
      // Find subset of DPs that match topic
      const _newDpStoreData: DatapointDisclosureRequirementType[] = [];
      DPStoreData.forEach((dp) => {
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
    const newDPId =
      selectedDp.datapointId === tags.datapoint
        ? undefined
        : selectedDp.datapointId;

    if (newDPId === undefined) {
      // Reset datapoint keep rest
      setTags((prev) => {
        return {
          topic: prev.topic,
          disclosureRequirement: prev.disclosureRequirement,
        };
      });
    } else {
      setTags({
        topic: selectedDp.topic,
        disclosureRequirement: selectedDp.disclosureRequirement,
        datapoint: selectedDp.datapointId,
        dataType: getDataType(selectedDp.xbrlDataType),
      });
    }
    setDpOpen(false);
  };

  const onUnitChange = (value: string) => {
    setTags((prev) => {
      return {
        ...prev,
        dataType: {
          xbrlDataType: prev.dataType?.xbrlDataType ?? "None",
          displayName: prev.dataType?.displayName ?? "None",
          formDataType: prev.dataType?.formDataType ?? "text",
          unit: value,
        },
      };
    });
  };

  const onClear = () => {
    setTags({});
    setHelp(null);
    setDrStore(DRStoreData);
    setEsrsStore(DPStoreData);
  };
  function parse(body: string): GippityESRSHelp {
    return JSON.parse(body) as GippityESRSHelp;
  }

  const onHelp = async () => {
    if (!selectedDPObject) return;
    setLoadingHelp(true);
    const help = await gippity(selectedDPObject);
    const helpObj = parse(help);
    setHelp(helpObj);
    setLoadingHelp(false);
  };

  return (
    <div className=" mx-auto flex w-full flex-col space-y-10">
      <div className="flex h-full flex-col items-center justify-start">
        <div className="w-full">
          <div className="flex items-center justify-between py-2">
            <h1 className="text-xl font-light">Align with standard</h1>
            <Button variant="outline" onClick={onClear}>
              Reset selection
            </Button>
          </div>
          <Popover open={topicOpen} onOpenChange={setTopicOpen}>
            <PopoverTrigger asChild>
              <div>
                <Label htmlFor="topic" className="text-gray-500">
                  Topic
                </Label>
                <Button
                  id="topic"
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    tags.topic ? "border-2 border-nightsky-700" : "",
                  )}
                >
                  {tags.topic ?? "Sustainability Topic"}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search topic..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No option found.</CommandEmpty>

                  {TopicStoreData.map((t) => {
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
                                    tags.topic === es.name
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
            {TopicStoreData.reduce((acc, x) => acc + x.topics.length, 0)}
          </p>
        </div>
        <div className="w-full">
          <Popover open={drOpen} onOpenChange={setDrOpen}>
            <PopoverTrigger asChild>
              <div>
                <Label
                  htmlFor="disclosure-requirement"
                  className="text-gray-500"
                >
                  Disclosure requirement
                </Label>
                <Button
                  id="disclosure-requirement"
                  variant="outline"
                  role="combobox"
                  // aria-expanded={topicOpen}
                  className={cn(
                    "w-full justify-between",
                    tags.disclosureRequirement
                      ? "border-2 border-nightsky-500"
                      : "",
                  )}
                >
                  {tags.disclosureRequirement ?? "Disclosure requirements"}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0">
              <Command>
                <CommandInput
                  placeholder="Search disclosure requirement..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No disclosure requirement found.</CommandEmpty>

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
                              <div className="flex items-center justify-between gap-2 text-left">
                                <CheckIcon
                                  className={cn(
                                    "h-4 w-4 flex-shrink-0",
                                    tags.disclosureRequirement ===
                                      dr.disclosureRequirement
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                <div>
                                  <p className="text-xs font-semibold">
                                    {dr.disclosureRequirement}
                                  </p>
                                  <p className="text-xs"> {dr.drName}</p>
                                </div>
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
            {drStore.reduce(
              (acc, x) => acc + x.disclosureRequirements.length,
              0,
            )}
          </p>
        </div>
        <div className="w-full">
          <Popover open={dpOpen} onOpenChange={setDpOpen}>
            <PopoverTrigger asChild>
              <div>
                <Label className="text-gray-500" htmlFor="datapoint">
                  Datapoint
                </Label>
                <Button
                  id="datapoint"
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    tags.datapoint ? "border-2 border-aquamarine-400" : "",
                  )}
                >
                  {tags.datapoint ?? "Data points"}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0">
              <Command>
                <CommandInput
                  placeholder="Search data points..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No datapoint found.</CommandEmpty>

                  {esrsStore.map((dpType) => {
                    return (
                      <CommandGroup
                        heading={dpType.disclosureReqirement}
                        key={dpType.disclosureReqirement}
                      >
                        {dpType.esrsDataPoints.map((dp) => {
                          return (
                            <CommandItem
                              value={`${dp.datapointId} ${dp.datapointName}`}
                              key={`${dp.uuid}-${dp.datapointId}`}
                              onSelect={() => onDPSelected(dp)}
                            >
                              <div className="flex items-center gap-2 text-left">
                                <CheckIcon
                                  className={cn(
                                    "h-4 w-4 flex-shrink-0",
                                    tags.datapoint === dp.datapointId
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                <div>
                                  <p className="text-xs font-semibold">
                                    {dp.datapointId}
                                  </p>
                                  <p className="text-xs"> {dp.datapointName}</p>
                                </div>
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
        <div className="w-full py-2">
          <Separator />
        </div>
        <div id="data-type" className="w-full items-center py-1">
          <Label htmlFor="data-type" className="text-gray-500">
            Data type
          </Label>
          <Select
            defaultValue={"None"}
            onValueChange={onDataTypeSelected}
            value={tags.dataType?.xbrlDataType ?? "None"}
          >
            <SelectTrigger
              className={cn(
                "w-full focus:ring-0 focus:ring-offset-0",
                (tags.dataType?.xbrlDataType ?? "None") !== "None" &&
                  "border-2 border-sand-200",
              )}
            >
              <SelectValue placeholder="Select data type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key={"None"} value={"None"}>
                {"None"}
              </SelectItem>
              {Object.keys(groupedDataTypes).map((groupKey) => {
                return (
                  <SelectGroup key={groupKey}>
                    <SelectLabel className="-ml-4 text-left text-xs capitalize text-gray-300">
                      {groupKey}
                    </SelectLabel>
                    {(groupedDataTypes[groupKey] ?? []).map((x) => {
                      if (x.xbrlDataType === "None") return null;
                      return (
                        <SelectItem key={x.xbrlDataType} value={x.xbrlDataType}>
                          {x.displayName}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full py-1" id="unit">
          <Label htmlFor="unit" className="text-gray-500">
            Unit
          </Label>
          <Input
            type="text"
            className="focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="e.g. CO2e"
            value={tags.dataType?.unit ?? ""}
            onChange={(e) => onUnitChange(e.target.value)}
          ></Input>
        </div>
      </div>
      {selectedDPObject !== null && (
        <div className="mx-auto px-5 text-sm">
          <h1 className="text-center font-extralight">
            Data point information
          </h1>
          <ul className="list-disc">
            <li>
              <span className="font-light">Topic: </span>
              <span className="font-extralight">{selectedDPObject.topic}</span>
            </li>
            <li>
              <span className="font-light">Disclosure requirement: </span>
              <span className="font-extralight">
                {selectedDPObject.disclosureRequirement}
              </span>
              <br />
              <span className="font-extralight">{selectedDPObject.drName}</span>
            </li>
            <li>
              <span className="font-light">Paragraph: </span>
              <a
                href={selectedDPObject.drLink}
                target="_blank"
                className="font-extralight underline"
              >
                {selectedDPObject.disclosureRequirement} -{" "}
                {selectedDPObject.paragraph}
              </a>
            </li>
            <li>
              <span className="font-light">Data point: </span>
              <span className="font-extralight">
                {selectedDPObject.datapointId}
              </span>
              <br />
              <span className="font-extralight">
                {selectedDPObject.datapointName}
              </span>
            </li>
            <li>
              <span className="font-light">Data type: </span>
              <span className="font-extralight">
                {selectedDPObject.xbrlDataType}
              </span>
            </li>
          </ul>
        </div>
      )}
      {selectedDPObject !== null && (
        <div className="flex w-full items-center justify-center">
          <Button onClick={onHelp} variant="outline">
            Help
          </Button>
        </div>
      )}

      {loadingHelp && (
        <div className="mx-auto">
          <Spinner className="text-center" />
        </div>
      )}
      {help !== null && (
        <div className="px-4 text-sm">
          <div>
            <p>Explanation</p>
            <p className="font-extralight">{help.explanation}</p>
          </div>
          <div>
            <p>Possible questions</p>
            <ul className="list-disc">
              {help.questions.map((q, i) => {
                return (
                  <li className="font-extralight" key={i}>
                    {q}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
export default ESRSSelector;
