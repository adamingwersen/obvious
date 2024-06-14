import { type UserModel, type SurveyRespondentModel } from "@/server/db/schema";

export type RespondentWithUserJwt = {
  respondentUser: SurveyRespondentModel;
  iat: number;
};

export type RespondentWithUser = SurveyRespondentModel & {
  respondent: UserModel;
};
