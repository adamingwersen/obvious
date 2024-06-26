"use client";
import { Button } from "@/components/ui/button";
import {
  drData,
  esrsData,
  TopicStoreData,
  EsrsDataPoint,
  type DisclosureRequirementType,
  type DatapointDisclosureRequirementType,
  type TopicType,
  type DisclosureRequirementReportAreaType,
} from "@/types/esrs/esrs-data";

import { useEffect, useState } from "react";

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
import { GippityESRSHelp } from "@/types/question";
import { ESRSTags } from "./create-question-view";

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
}, [] as DisclosureRequirementReportAreaType[]);

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
}, [] as DatapointDisclosureRequirementType[]);

type ESRSSelectorParams = {
  gippity: (datapoint: EsrsDataPoint) => Promise<string>;
  tags: ESRSTags;
  setTags: React.Dispatch<React.SetStateAction<ESRSTags>>;
};

const ESRSSelector = ({ gippity, tags, setTags }: ESRSSelectorParams) => {
  const getDataPointFromTags = (t: ESRSTags) => {
    if (!t) return null;
    if (!t.datapoint) return null;
    const dpObject = esrsData.find((x) => x.datapointId == tags.datapoint);
    if (!dpObject) return null;
    return dpObject;
  };
  const [topicStore, setTopicStore] = useState<TopicType[]>(TopicStoreData);

  const [loadingHelp, setLoadingHelp] = useState<boolean>(false);
  const [help, setHelp] = useState<GippityESRSHelp | null>(null);
  const [drStore, setDrStore] =
    useState<DisclosureRequirementReportAreaType[]>(newDRStoreData);
  const [esrsStore, setEsrsStore] =
    useState<DatapointDisclosureRequirementType[]>(newDPStoreData);

  const [topicOpen, setTopicOpen] = useState<boolean>(false);
  const [drOpen, setDrOpen] = useState<boolean>(false);
  const [dpOpen, setDpOpen] = useState<boolean>(false);

  const [selectedDPObject, setSelectedDPObject] =
    useState<EsrsDataPoint | null>(getDataPointFromTags(tags));

  useEffect(() => {
    setSelectedDPObject(getDataPointFromTags(tags));
  }, [tags]);

  const onTopicSelected = (topic: string) => {
    const newTopic = topic !== tags.topic ? topic : undefined;

    // If we set top we need to reset lower
    setTags({
      topic: newTopic,
    });

    // Reset case
    if (newTopic === undefined) {
      setDrStore(newDRStoreData);
      setEsrsStore(newDPStoreData);
    } else {
      // Find subset of DPs that match topic
      const _newDRStoreData: DisclosureRequirementReportAreaType[] = [];
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
      const _newDpStoreData: DatapointDisclosureRequirementType[] = [];
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

      setDrStore(newDRStoreData);
      setEsrsStore(newDPStoreData);
    } else {
      setTags({
        topic: selectedDr.topic,
        disclosureRequirement: selectedDr.disclosureRequirement,
      });

      // Update possible datapoints
      // Find subset of DPs that match topic
      const _newDpStoreData: DatapointDisclosureRequirementType[] = [];
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
      });
    }
    setDpOpen(false);
  };

  const onClear = () => {
    setTags({});

    setHelp(null);
    setDrStore(newDRStoreData);
    setEsrsStore(newDPStoreData);
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
      <div className="flex h-full flex-col items-center justify-start space-y-2">
        <div className="w-full">
          <div className="flex items-center justify-between py-2">
            <h1 className="text-xl font-light">Align with standard</h1>
            <Button variant="outline" onClick={onClear}>
              Reset selection
            </Button>
          </div>
          <Popover open={topicOpen} onOpenChange={setTopicOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-full justify-between",
                  tags.topic ? "border-2 border-sand-300" : "",
                )}
              >
                {tags.topic ?? "Sustainability Topic"}
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
                className={cn(
                  "w-full justify-between",
                  tags.disclosureRequirement
                    ? "border-2 border-aquamarine-500"
                    : "",
                )}
              >
                {tags.disclosureRequirement ?? "Disclosure requirements"}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
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
              <Button
                variant="outline"
                role="combobox"
                // aria-expanded={topicOpen}
                className={cn(
                  "w-full justify-between",
                  tags.datapoint ? "border-2 border-nightsky-500" : "",
                )}
              >
                {tags.datapoint ?? "Data points"}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
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
