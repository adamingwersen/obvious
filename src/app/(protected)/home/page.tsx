import { Card, CardHeader } from "@/components/ui/card";
import { api } from "@/trpc/server";
import * as _ from "lodash";
import moment from "moment";
import {
  ResponsesChart,
  SurveyCreatedChart,
  TranslationsGeneratedChart,
  DocumentsUploadedChart,
} from "./charts";

const HomePage = async () => {
  // Surveys
  const surveyData = await api.survey.findAllByCurrentUserWithRelations();
  const createdMonthName = (item) =>
    moment(item.createdAt, "YYYY-MM-DD").format("MMMM");
  const countData = Object.entries(_.countBy(surveyData, createdMonthName)).map(
    ([key, value]) => ({
      month: key,
      count: value,
    }),
  );

  // Respondents
  const respondentData = await api.surveyRespondent.findMany();

  const invitedCountData = Object.entries(
    _.countBy(respondentData, createdMonthName),
  ).map(([key, value]) => ({
    month: key,
    invitedCount: value,
  }));
  const seenMonthName = (item) =>
    moment(item.respondentFirstSeenAt, "YYYY-MM-DD").format("MMMM");
  const seenCountData = Object.entries(
    _.countBy(
      respondentData.filter((x) => x.respondentFirstSeenAt),
      seenMonthName,
    ),
  ).map(([key, value]) => ({
    month: key,
    seenCount: value,
  }));

  const responsesData = _.valuesIn(
    _.merge(
      _.keyBy(invitedCountData, "month"),
      _.keyBy(seenCountData, "month"),
    ),
  );

  // Translations
  const translationData = await api.translation.findMany();
  const createdWeekName = (item) =>
    `Week ${moment(item.createdAt, "YYYY-MM-DD").format("WW")}`;
  const translationCountData = Object.entries(
    _.countBy(translationData, createdWeekName),
  ).map(([key, value]) => ({
    week: key,
    count: value,
  }));

  // Documents uploaded
  const answerData = await api.answer.findMany();
  const answerCountData = Object.entries(
    _.countBy(answerData, createdWeekName),
  ).map(([key, value]) => ({
    week: key,
    count: value,
  }));

  return (
    <div className="flex h-full w-full flex-col items-center justify-start space-y-6">
      <h1>Dashboard</h1>
      <div className="flex flex-row gap-10">
        <Card>
          <CardHeader>Respondent Behaviour</CardHeader>
          <ResponsesChart data={responsesData} />
        </Card>
        <Card>
          <CardHeader>Surveys Created</CardHeader>
          <SurveyCreatedChart data={countData} />
        </Card>
      </div>
      <div className="flex flex-row gap-10">
        <Card>
          <CardHeader>Translations Generated</CardHeader>
          <TranslationsGeneratedChart data={translationCountData} />
        </Card>
        <Card>
          <CardHeader>Documents Uploaded</CardHeader>
          <DocumentsUploadedChart data={answerCountData} />
        </Card>
      </div>
    </div>
  );
};
export default HomePage;
