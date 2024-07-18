"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";

// Surveys Created
const surveyCreatedBarChartConfig = {
  count: {
    label: "Surveys created:",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export type SurveyCreatedBarChartType = {
  month: string;
  count: number;
};

type SurveyCreatedBarChartProps = {
  data: SurveyCreatedBarChartType[];
};

export const SurveyCreatedBarChart = (
  chartProps: SurveyCreatedBarChartProps,
) => {
  return (
    <ChartContainer
      config={surveyCreatedBarChartConfig}
      className=" min-h-[300px] w-full pb-3"
    >
      <AreaChart accessibilityLayer data={chartProps.data} className="px-10">
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          type={"category"}
          interval="preserveStartEnd"
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area dataKey="count" fill="var(--color-count)" />
      </AreaChart>
    </ChartContainer>
  );
};

// Responses
const responsesBarChartConfig = {
  invitedCount: {
    label: "Respondent invited:",
    color: "#2563eb",
  },
  seenCount: {
    label: "Respondent started survey:",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export type ResponsesBarChartType = {
  month: string;
  invitedCount: number;
  seenCount: number;
};

type ResponsesBarChartProps = {
  data: ResponsesBarChartType[];
};

export const ResponsesBarChart = (chartProps: ResponsesBarChartProps) => {
  return (
    <ChartContainer
      config={responsesBarChartConfig}
      className="min-h-[300px] w-full pb-3"
    >
      <BarChart accessibilityLayer data={chartProps.data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="invitedCount" fill="var(--color-invitedCount)" />
        <Bar dataKey="seenCount" fill="var(--color-seenCount)" />
      </BarChart>
    </ChartContainer>
  );
};
