"use client";
import { Button } from "@/components/ui/button";
import { METADATA_TYPES } from "@/server/db/schema/enums";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Plus, Trash } from "lucide-react";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { type MetadataQuestionModel } from "@/server/db/schema";
import {
  type CreateMetadataQuestionFormFields,
  formSchema,
} from "@/components/forms/schemas/metadata-question";

type MetadataQuestionFormProps = {
  surveyUuid: string;
  formFieldsFromServer: MetadataQuestionModel[];
  handleCreateManySurveyMetadata: (
    data: CreateMetadataQuestionFormFields,
    surveyUuid: string,
  ) => Promise<void>;
};

const MetadataQuestionForm = ({
  surveyUuid,
  formFieldsFromServer,
  handleCreateManySurveyMetadata,
}: MetadataQuestionFormProps) => {
  const mapped = formFieldsFromServer.map(({ id, title, metadataType }) => ({
    id,
    title,
    metadataType,
  }));

  const data = {
    metadataQuestionFields: mapped,
  };

  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<CreateMetadataQuestionFormFields>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    values: data,
    // This behaves weirdly if just provided directly
    defaultValues:
      mapped.length > 0
        ? undefined
        : {
            metadataQuestionFields: [
              {
                title: "Company Name",
                metadataType: "TEXT",
              },
            ],
          },
  });

  const { fields, append, remove } = useFieldArray({
    name: "metadataQuestionFields",
    control: form.control,
  });

  const onDelete = (index: number) => {
    remove(index);
    toast({
      title: "Deleted field",
      description: new Date().toLocaleString(),
    });
  };

  const onSubmit = async (values: CreateMetadataQuestionFormFields) => {
    setIsLoading(true);
    await handleCreateManySurveyMetadata(values, surveyUuid);
    setIsLoading(false);
    toast({
      title: "Saved metadata for survey",
      description: new Date().toLocaleString(),
    });
  };

  return (
    <Form {...form}>
      <form
        action=""
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col space-y-5 px-5"
      >
        <div className="w-full">
          <FormField
            control={form.control}
            name="metadataQuestionFields"
            render={() => (
              <div>
                {fields.map((field, index) => {
                  return (
                    <div key={index}>
                      <div className="flex gap-x-4 py-1">
                        <FormField
                          control={form.control}
                          key={field.id}
                          name={`metadataQuestionFields.${index}.title`}
                          render={({ field }) => (
                            <FormItem className="w-3/5">
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage className="capitalize text-red-500" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          key={index + 1}
                          name={`metadataQuestionFields.${index}.metadataType`}
                          render={({ field }) => (
                            <FormItem className="w-1/5">
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a Type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {METADATA_TYPES.map((metadataType, index) => (
                                    <SelectItem
                                      key={index}
                                      value={metadataType}
                                    >
                                      {metadataType.charAt(0).toUpperCase() +
                                        metadataType.slice(1).toLowerCase()}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="capitalize text-red-500" />
                            </FormItem>
                          )}
                        />
                        {index > 0 && (
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() => onDelete(index)}
                          >
                            <Trash className="size-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2 w-1/2 gap-2"
          onClick={() => append({ title: "", metadataType: "TEXT" })}
        >
          <Plus className="size-4" />
          Add Field
        </Button>
        <div className="absolute bottom-6 right-6">
          <Button
            className="gap-2"
            variant="default"
            type="submit"
            isLoading={isLoading}
          >
            Next
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MetadataQuestionForm;
