"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

// Surveys Created
const surveyCreatedChartConfig = {
  count: {
    label: "Surveys created:",
    color: "#6EA7A0",
  },
} satisfies ChartConfig;

export type SurveyCreatedChartType = {
  month: string;
  count: number;
};

type SurveyCreatedChartProps = {
  data: SurveyCreatedChartType[];
};

export const SurveyCreatedChart = (chartProps: SurveyCreatedChartProps) => {
  return (
    <ChartContainer
      config={surveyCreatedChartConfig}
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
const responsesChartConfig = {
  invitedCount: {
    label: "Respondent invited:",
    color: "#404389",
  },
  seenCount: {
    label: "Respondent started survey:",
    color: "#8F94FE",
  },
} satisfies ChartConfig;

export type ResponsesChartType = {
  month: string;
  invitedCount: number;
  seenCount: number;
};

type ResponsesChartProps = {
  data: ResponsesChartType[];
};

export const ResponsesChart = (chartProps: ResponsesChartProps) => {
  return (
    <ChartContainer
      config={responsesChartConfig}
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
        <YAxis />
      </BarChart>
    </ChartContainer>
  );
};

// Translations Generated
const translationsGeneratedConfig = {
  count: {
    label: "Translations generated:",
    color: "#B4EAFA",
  },
} satisfies ChartConfig;

export type TranslationsGeneratedChartType = {
  week: string;
  count: number;
};

type TranslationsGeneratedChartProps = {
  data: TranslationsGeneratedChartType[];
};

export const TranslationsGeneratedChart = (
  chartProps: TranslationsGeneratedChartProps,
) => {
  return (
    <ChartContainer
      config={translationsGeneratedConfig}
      className=" min-h-[300px] w-full pb-3"
    >
      <AreaChart accessibilityLayer data={chartProps.data} className="px-10">
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="week"
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

// Documents Uploaded
const AnswersOverTimeConfig = {
  count: {
    label: "Answers:",
    color: "#176992",
  },
} satisfies ChartConfig;

export type AnswerOverTimeChartType = {
  week: string;
  count: number;
};

type AnswerOverTimeChartProps = {
  data: AnswerOverTimeChartType[];
};

export const AnswerOverTimeChart = (chartProps: AnswerOverTimeChartProps) => {
  return (
    <ChartContainer
      config={AnswersOverTimeConfig}
      className="min-h-[300px] w-full pb-3"
    >
      <BarChart accessibilityLayer data={chartProps.data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="week"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" />
        <YAxis />
      </BarChart>
    </ChartContainer>
  );
};

const surveyAnswersConfig = {
  count: {
    label: "Survey answers:",
    color: "#256172",
  },
} satisfies ChartConfig;

export type SurveyAnswersChartType = {
  surveyName: string;
  count: number;
};

type SurveyAnswersChartProps = {
  data: SurveyAnswersChartType[];
};

export const SurveyAnswersChart = (chartProps: SurveyAnswersChartProps) => {
  return (
    <ChartContainer
      config={surveyAnswersConfig}
      className="min-h-[300px] w-full pb-3"
    >
      <BarChart accessibilityLayer data={chartProps.data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="surveyName"
          tick={false}
          label={"Surveys"}
          tickLine={false}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" />
        <YAxis />
      </BarChart>
    </ChartContainer>
  );
};
