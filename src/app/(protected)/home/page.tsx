import { Card, CardHeader } from "@/components/ui/card";
import { api } from "@/trpc/server";
import * as _ from "lodash";
import moment from "moment";
import {
  ResponsesChart,
  SurveyCreatedChart,
  AnswerOverTimeChart,
  SurveyAnswersChart,
} from "./charts";
import {
  type SurveyRespondentModel,
  type SurveyModel,
  type AnswerModel,
} from "@/server/db/schema";

const HomePage = async () => {
  // Surveys
  const surveyData = await api.survey.findAllForUserOrg();
  const createdMonthName = (item: SurveyModel) =>
    moment(item.createdAt, "YYYY-MM-DD").format("MMMM");
  const countData = Object.entries(_.countBy(surveyData, createdMonthName)).map(
    ([key, value]) => ({
      month: key,
      count: value,
    }),
  );

  // Respondents for surveys
  const surveyIds = surveyData.map((x) => x.id);
  const respondentData =
    await api.surveyRespondent.findManyForSurveys(surveyIds);

  const invitedCountData = Object.entries(
    _.countBy(respondentData, createdMonthName),
  ).map(([key, value]) => ({
    month: key,
    invitedCount: value,
  }));

  const seenMonthName = (item: SurveyRespondentModel) =>
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

  const createdWeekName = (item: AnswerModel) =>
    `Week ${moment(item.createdAt, "YYYY-MM-DD").format("WW")}`;

  // Answers
  const answerData = await api.answer.findManyForSurveys(surveyIds);

  const answerCountData = Object.entries(
    _.countBy(answerData, createdWeekName),
  ).map(([key, value]) => ({
    week: key,
    count: value,
  }));

  // document uploads
  const answerPrSurveyData = Object.entries(
    _.countBy(
      answerData,
      (x) => surveyData.find((s) => s.id === x.surveyId)?.title,
    ),
  )
    .map(([key, value]) => ({
      surveyName: key,
      count: value,
    }))
    .sort((x, y) => y.count - x.count);

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
          <CardHeader>Survey answers</CardHeader>
          <SurveyAnswersChart data={answerPrSurveyData}></SurveyAnswersChart>
        </Card>
        <Card>
          <CardHeader>Answers over time</CardHeader>
          <AnswerOverTimeChart data={answerCountData} />
        </Card>
      </div>
    </div>
  );
};
export default HomePage;
