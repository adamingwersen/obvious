import CreateSurveyForm from "@/components/forms/create-survey-form";
import { handleCreateSurvey } from "./actions";

const SurveyCreatePage = () => {
  <CreateSurveyForm handleCreateSurvey={handleCreateSurvey} />;
};

export default SurveyCreatePage;
