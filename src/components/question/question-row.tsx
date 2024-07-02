"use client";

import { Separator } from "@/components/ui/separator";
import useUrlHelpers from "@/hooks/useUrlHelpers";
import type { FC } from "react";
import { cn } from "@/lib/utils";
import { type QuestionModel } from "@/server/db/schema";
import { Plus, Trash } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { useQuestionActions } from "@/hooks/server-actions/questions";
import Spinner from "../ui/spinner";
import { useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import type { Identifier, XYCoord } from "dnd-core";
import { useDrag, useDrop } from "react-dnd";
import { type upsertQuestionType } from "../forms/schemas/create-question";

export type DraggableQuestionRowProps = {
  question: upsertQuestionType;
  index: number;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
  selectedQuestionIndex: number | null;
  setSelectedQuestionIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

type QuestionRowProps = {
  question?: upsertQuestionType;
  index?: number;
  selectedQuestionIndex: number | null;
  setSelectedQuestionIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

export const QuestionRow = ({
  question,
  index,
  selectedQuestionIndex,
  setSelectedQuestionIndex,
}: QuestionRowProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { removeQueryParam } = useUrlHelpers();
  const { deleteQuestion } = useQuestionActions();

  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [dialogQuestionId, setDialogQuestionID] = useState<number>();
  const questionId = Number(searchParams.get("questionId"));

  const onDeleteQuestion = async (questionId: number) => {
    setIsDeleting(true);
    try {
      await deleteQuestion(questionId, false);
      if (question?.id === questionId) {
        router.replace(removeQueryParam("questionId"));
      }
    } catch (error) {
      setDialogQuestionID(questionId);
      setConfirmDialogOpen(true);
    }
    setIsDeleting(false);
  };

  const onOpenDialogChange = async (confirmed: boolean) => {
    if (confirmed) {
      if (!dialogQuestionId)
        throw new Error(
          "Silly programmer, you need to set questionId before doing this",
        );
      setIsDeleting(true);
      await deleteQuestion(dialogQuestionId, true);
      // Clear search params to clear form
      if (question?.id === questionId) {
        router.replace(removeQueryParam("questionId"));
      }
      setIsDeleting(false);
    }
    setDialogQuestionID(undefined);
  };

  if (!question) {
    return (
      <>
        <div className="flex w-full items-center justify-center gap-2 bg-aquamarine-400 py-4">
          <button
            className="flex h-full w-full items-center justify-center gap-2 text-sm font-light"
            onClick={() => {
              setSelectedQuestionIndex(null);
            }}
          >
            <Plus size={16} />
            Add new question
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className={cn(
          "flex items-center justify-between gap-2 px-1 py-2",
          selectedQuestionIndex === index && " bg-gray-200",
        )}
      >
        <button
          onClick={() => {
            console.log(
              "Something is happening or what?",
              selectedQuestionIndex,
              index,
            );
            setSelectedQuestionIndex(index ?? null);
          }}
          className="flex-grow p-1 text-left text-sm"
        >
          {question.title}
        </button>
        <div className="flex-shrink-0">
          <Button variant="ghost" size="icon">
            {isDeleting ? (
              <Spinner />
            ) : (
              <Trash
                size={16}
                onClick={async () => {
                  if (!question.id) return;
                  await onDeleteQuestion(question.id);
                }}
              />
            )}
          </Button>
        </div>
      </div>
      <Separator className="" />
      <AlertDialog
        open={confirmDialogOpen}
        onOpenChange={(open) => setConfirmDialogOpen(open)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This questions seems to have one or more answers attached to it.
              You will lose these answers if you choose to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => onOpenDialogChange(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => onOpenDialogChange(true)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const ItemTypes = {
  QuestionRow: "question-row",
};

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const DraggableQuestionRow: FC<DraggableQuestionRowProps> = ({
  question,
  index,
  moveRow,
  selectedQuestionIndex,
  setSelectedQuestionIndex,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.QuestionRow,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveRow(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  interface DropResult {
    id: number;
    index: number;
  }
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.QuestionRow,
    item: () => {
      return { id: question.id, index };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    collect: (monitor: any) => ({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
        console.log(`You dropped ${item.id} into!`, item.index);
      }
    },
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div
      ref={ref}
      className="cursor-move"
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      <QuestionRow
        index={index}
        setSelectedQuestionIndex={setSelectedQuestionIndex}
        selectedQuestionIndex={selectedQuestionIndex}
        question={question}
      />
    </div>
  );
};
