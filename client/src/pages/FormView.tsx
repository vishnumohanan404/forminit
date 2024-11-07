import PageTitle from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { submitForm, SubmitFormData, viewForm } from "@/services/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFoundPage from "./NotFound";
interface Block {
  type: string;
  data: any;
  _id: string;
}

interface Form {
  _id: string;
  title: string;
  blocks: Block[];
  disabled: boolean;
}

interface MCQOptions {
  optionValue: string;
  optionMarker: string;
}
const FormViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery<Form>({
    queryKey: ["form", id],
    queryFn: () => viewForm(id),
    staleTime: 10000,
    enabled: !!id,
  });
  useEffect(() => {
    if (!isLoading && data) setFormState(data.blocks);
  }, [data]);

  // State to store form input values
  const [formState, setFormState] = useState<Array<Block>>([]);
  const handleChange = (blockId: string, value: any, type: string) => {
    const newFormState = formState.map((block) => {
      if (block._id === blockId) {
        if (type === "shortAnswerTool" || type === "longAnswerTool") {
          return {
            ...block,
            data: {
              ...block.data,
              value: value, // Assuming you're updating the placeholder field
            },
          };
        } else if (type === "multipleChoiceTool") {
          return {
            ...block,
            data: {
              ...block.data,
              selectedOption: value, // Store the selected option marker
              // Assuming you're updating the options array
            },
          };
        }
      }
      return block; // If _id doesn't match, return block unchanged
    });
    setFormState(newFormState);
  };
  const queryClient = useQueryClient();

  const { mutate: submitFormMutation, isPending } = useMutation({
    mutationFn: (submitFormData: SubmitFormData) => submitForm(submitFormData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFormMutation({
      blocks: formState,
      title: data?.title || "",
      _id: data?._id || "",
    });
  };
  if (data?.disabled) {
    return <NotFoundPage />;
  }
  return (
    <div>
      {isLoading ? (
        <div className="overflow-y-scroll px-5">
          <PageTitle>
            <Skeleton className="w-[20rem] h-16" />
          </PageTitle>
          <main className="mx-auto max-w-[650px] min-h-[66vh] overflow-auto flex flex-col gap-6 container mb-28">
            <Skeleton className="w-[40%] h-6" />
            <Skeleton className="w-[80%] h-6" />
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-[80%] h-6" />
            <Skeleton className="w-[50%] h-6" />
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-[50%] h-6" />
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-[60%] h-6" />
          </main>
        </div>
      ) : (
        <>
          <div className="overflow-y-scroll px-5">
            <PageTitle>{data?.title}</PageTitle>
            <main className="mx-auto max-w-[1100px] min-h-[66vh] overflow-auto flex-grow container mb-28">
              <div className="mx-auto max-w-[650px]">
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-2">
                    {formState?.map((block) => {
                      switch (block.type) {
                        case "shortAnswerTool":
                          return (
                            <div key={block._id}>
                              <label className="font-semibold py-2 px-0">
                                {block.data?.title}
                              </label>
                              <Input
                                type="text"
                                placeholder={block.data?.placeholder}
                                className="focus-visible:ring-0 my-2 w-[60%]"
                                value={block.data.value || ""}
                                onChange={(e) =>
                                  handleChange(
                                    block._id,
                                    e.target.value,
                                    block.type
                                  )
                                }
                              />
                            </div>
                          );
                        case "longAnswerTool":
                          return (
                            <div key={block._id}>
                              <label className="font-semibold py-2 px-0">
                                {block.data?.title}
                              </label>
                              <Textarea
                                placeholder={block.data?.placeholder}
                                className="focus-visible:ring-0 my-2 resize-none"
                                rows={4}
                                value={block.data.value || ""}
                                onChange={(e) =>
                                  handleChange(
                                    block._id,
                                    e.target.value,
                                    block.type
                                  )
                                }
                              />
                            </div>
                          );
                        case "multipleChoiceTool":
                          return (
                            <div key={block._id}>
                              <label className="font-semibold py-2 px-0">
                                {block.data?.title}
                              </label>
                              <div className="py-2">
                                {block.data.options?.map(
                                  (option: MCQOptions) => (
                                    <div
                                      key={option.optionMarker}
                                      className={`relative cursor-pointer inline-flex w-full max-w-sm align-middle mb-2 items-center gap-2`}
                                      onClick={() => {
                                        handleChange(
                                          block._id,
                                          option.optionMarker,
                                          block.type
                                        );
                                      }}
                                    >
                                      <div className="absolute inset-y-0 left-[4px] flex items-center justify-center w-8 pointer-events-none">
                                        <span className="text-sm font-medium text-muted bg-slate-600 px-[5px] py-0 rounded-sm">
                                          {option.optionMarker.toUpperCase()}
                                        </span>
                                      </div>
                                      <div
                                        className={`min-w-[60%] flex h-10  rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 pl-9  ${
                                          block.data.selectedOption ===
                                          option.optionMarker
                                            ? "border-sky-500"
                                            : ""
                                        }`}
                                      >
                                        {option.optionValue}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          );
                        default:
                          break;
                      }
                    })}
                    {isPending ? (
                      <></>
                    ) : (
                      <Button className="w-24 mt-6" type="submit">
                        Submit
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default FormViewPage;
