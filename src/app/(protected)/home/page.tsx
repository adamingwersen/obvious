import { Card, CardHeader } from "@/components/ui/card";
import { api } from "@/trpc/server";
import * as _ from "lodash";
import moment from "moment";
import { ResponsesBarChart, SurveyCreatedBarChart } from "./charts";

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

  return (
    <div className="flex h-full w-full flex-col items-center justify-start space-y-6">
      <h1>Dashboard</h1>
      <div className="flex flex-row gap-10">
        <Card>
          <CardHeader>Surveys Created</CardHeader>
          <SurveyCreatedBarChart data={countData} />
        </Card>
        <Card>
          <CardHeader>Respondent Behaviour</CardHeader>
          <ResponsesBarChart data={responsesData} />
        </Card>
      </div>
    </div>
  );
};
export default HomePage;
