"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { QuestionModel } from "@/server/db/schema";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

type AnswerStepperProps = {
  questions: QuestionModel[];
};

const AnswerStepper = ({ questions }: AnswerStepperProps) => {
  const questionsLength = questions.length;
  console.log(questionsLength);
  const [answerIndex, setAnswerIndex] = useState(0);

  const onClickNext = async () => {
    if (answerIndex <= questionsLength) {
      setAnswerIndex(answerIndex + 1);
    }
    console.log("NEXT", answerIndex);
  };

  const onClickBack = async () => {
    if (answerIndex > 0) {
      setAnswerIndex(answerIndex - 1);
    }

    console.log("BACK", answerIndex);
  };

  return (
    <Card className=" w-1/3 self-center p-4">
      <CardHeader>
        <CardTitle>{questions[answerIndex].title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="py-3">{questions[answerIndex].content}</div>
        <Textarea placeholder="Your answer here..." />
        <Button variant="outline">
          <Dialog>
            <DialogTrigger>Upload documents</DialogTrigger>
            <DialogContent className=" justify-center px-32 py-14">
              <DialogHeader>
                <DialogTitle className="text-center">
                  Upload documents
                </DialogTitle>
                <DialogDescription className="flex h-[200px] w-[300px] items-center justify-center rounded-md border border-dashed">
                  Drop files here
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </Button>
      </CardContent>
      <CardFooter className="flex flex-row justify-between pt-20">
        {answerIndex > 0 && (
          <Button variant="outline" onClick={onClickBack}>
            Back
          </Button>
        )}

        <Button onClick={onClickNext} className="space-x-2">
          Next Question
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
      {/* Bottom */}
    </Card>
  );
};

export default AnswerStepper;
