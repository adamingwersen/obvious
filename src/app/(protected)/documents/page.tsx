"use server";

import { api } from "@/trpc/server";

import ViewAnswers from "@/components/answer/view-answers";
import { FileActionsProvider } from "@/hooks/use-files";
import { handleDownloadFile } from "@/server/actions/answer/actions";
import {
  DocumentsDataTable,
  type DocumentType,
} from "@/components/tables/documents/data-table";
import { columns } from "@/components/tables/documents/columns";
import { QuestionModel } from "@/server/db/schema";

// const data: DocumentType[] = [
//   {
//     id: "m5gr84i9",
//     name: "ost",
//     question: "316",
//     survey: "success",
//     tags: ["ken99@yahoo.com", "ken99@yahoo.com", "ken99@yahoo.com"],
//   },
//   {
//     id: "3u1reuv4",
//     name: "another ost",
//     question: "242",
//     survey: "success",
//     tags: ["Abe45@gmail.com", "Abe45@gmail.com"],
//   },
//   {
//     id: "derv1ws0",
//     name: "third ost",
//     question: "837",
//     survey: "processing",
//     tags: [
//       "Monserrat44@gmail.com",
//       "Monserrat44@gmail.com",
//       "Monserrat44@gmail.com",
//       "Monserrat44@gmail.com",
//     ],
//   },
//   {
//     id: "5kma53ae",
//     name: "bla bla bla",
//     question: "874",
//     survey: "success",
//     tags: ["Silas22@gmail.com"],
//   },
//   {
//     id: "bhqecj4p",
//     name: "hest gris ko",
//     question: "721",
//     survey: "failed",
//     tags: [],
//   },
// ];

const DocumentsPage = async () => {
  const surveys = await api.survey.findAllForUserOrg();
  const surveyTitleLookup = surveys.reduce(
    (acc, s) => {
      acc[s.id] = s.title;
      return acc;
    },
    {} as Record<number, string>,
  );
  const answers = await api.answer.findManyForSurveys(surveys.map((s) => s.id));

  const questions = surveys.map((s) => s.questions).flat();
  const questionLookup = questions.reduce(
    (acc, q) => {
      acc[q.id] = q;
      return acc;
    },
    {} as Record<number, QuestionModel>,
  );

  const documents = answers.flatMap((a) => {
    const docs = a.documentUrls ?? [];

    return docs
      .map((d) => {
        let sName = "";
        if (a.surveyId) {
          sName = surveyTitleLookup[a.surveyId] ?? "No survey name";
        }

        return {
          id: d + "_" + a.id.toString(),
          name: d,
          question: questionLookup[a.questionId],
          survey: sName,
        };
      })
      .filter((b) => b.question !== undefined);
  });
  // if (!respondentIds) throw new Error("No respondents");
  // const respondents = await api.user.findManyById(respondentIds);
  return (
    <div className="mx-auto h-full w-4/5 pt-10 lg:w-2/3 ">
      <DocumentsDataTable
        data={documents}
        columns={columns}
      ></DocumentsDataTable>

      {/* <FileActionsProvider
        downloadFile={handleDownloadFile}
        deleteFile={null}
        addFileToAnswer={handleAddFilePath}
      >
        <ViewAnswers
          asOriginator={true}
          questions={survey.questions}
          respondents={respondents}
        ></ViewAnswers>
      </FileActionsProvider> */}
    </div>
  );
};

export default DocumentsPage;
