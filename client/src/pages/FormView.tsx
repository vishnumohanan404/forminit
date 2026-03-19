import PageTitle from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitForm, SubmitFormData, viewForm } from "@/services/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NotFoundPage from "./NotFound";
import { Loader2Icon } from "lucide-react";
import { BlockData } from "@shared/types";
import { toast } from "sonner";
import { AxiosError } from "axios";
import RatingInput from "@/components/form/ui/RatingInput";

interface Form {
  _id: string;
  title: string;
  blocks: BlockData[];
  disabled: boolean;
}

interface MCQOptions {
  optionValue: string;
  optionMarker: string;
}
const FormViewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    data,
    isLoading,
    isError: isFormError,
  } = useQuery<Form>({
    queryKey: ["form", id],
    queryFn: () => viewForm(id),
    staleTime: 10000,
    enabled: !!id,
  });
  useEffect(() => {
    if (!isLoading && data) setFormState(data.blocks);
  }, [data]);

  // State to store form input values
  const [formState, setFormState] = useState<Array<BlockData>>([]);
  const handleChange = (blockId: string, value: string, type: string) => {
    const newFormState = formState.map(block => {
      if (block._id === blockId) {
        if (
          type === "shortAnswerTool" ||
          type === "longAnswerTool" ||
          type === "emailTool" ||
          type === "dateTool"
        ) {
          return { ...block, data: { ...block.data, value } };
        } else if (type === "multipleChoiceTool" || type === "dropdownTool") {
          return { ...block, data: { ...block.data, selectedOption: value } };
        } else if (type === "ratingTool") {
          return { ...block, data: { ...block.data, value } };
        }
      }
      return block;
    });
    setFormState(newFormState);
  };
  const queryClient = useQueryClient();

  const { mutate: submitFormMutation, isPending } = useMutation({
    mutationFn: (submitFormData: SubmitFormData) => submitForm(submitFormData),
    onSuccess: () => {
      navigate("/success", { replace: true });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Failed to submit form. Please try again.");
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

  if (isFormError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">
          Failed to load form. Please check the link and try again.
        </p>
      </div>
    );
  }

  if (data?.disabled) {
    return <NotFoundPage />;
  }

  if (isLoading) {
    return (
      <div className="overflow-y-scroll px-5">
        <PageTitle>
          <Skeleton className="w-[20rem] h-16" />
        </PageTitle>
        <main className="mx-auto max-w-[650px] min-h-[66vh] overflow-auto flex flex-col gap-6 container mb-28">
          {[...Array(6)].map((_, index) => (
            <Skeleton
              key={index}
              className="w-full h-6"
            />
          ))}
        </main>
      </div>
    );
  }
  return (
    <div>
      <div className="overflow-y-scroll px-5">
        <PageTitle>{data?.title}</PageTitle>
        <main className="mx-auto max-w-[1100px] min-h-[66vh] overflow-auto flex-grow container mb-28">
          <div className="mx-auto max-w-[650px]">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                {formState?.map(block => {
                  switch (block.type) {
                    case "shortAnswerTool":
                      return (
                        <div key={block._id}>
                          <label className="font-semibold py-2 px-0">{block.data?.title}</label>
                          <Input
                            type="text"
                            placeholder={block.data?.placeholder}
                            className="focus-visible:ring-0 my-2 w-[60%]"
                            value={block.data?.value || ""}
                            onChange={e => handleChange(block._id, e.target.value, block.type)}
                          />
                        </div>
                      );
                    case "longAnswerTool":
                      return (
                        <div key={block._id}>
                          <label className="font-semibold py-2 px-0">{block.data?.title}</label>
                          <Textarea
                            placeholder={block.data?.placeholder}
                            className="focus-visible:ring-0 my-2 resize-none"
                            rows={4}
                            value={block.data?.value || ""}
                            onChange={e => handleChange(block._id, e.target.value, block.type)}
                          />
                        </div>
                      );
                    case "multipleChoiceTool":
                      return (
                        <div key={block._id}>
                          <label className="font-semibold py-2 px-0">{block.data?.title}</label>
                          <div className="py-2">
                            {block.data.options?.map((option: MCQOptions) => (
                              <button
                                type="button"
                                key={option.optionMarker}
                                className={`relative cursor-pointer inline-flex w-full max-w-sm align-middle mb-2 items-center gap-2`}
                                onClick={() => {
                                  handleChange(block._id, option.optionMarker, block.type);
                                }}
                              >
                                <div className="absolute inset-y-0 left-[4px] flex items-center justify-center w-8 pointer-events-none">
                                  <span className="text-sm font-medium text-muted bg-slate-600 px-[5px] py-0 rounded-sm">
                                    {option.optionMarker.toUpperCase()}
                                  </span>
                                </div>
                                <div
                                  className={`min-w-[60%] flex h-10  rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 pl-9  ${
                                    block.data.selectedOption === option.optionMarker
                                      ? "border-sky-500"
                                      : ""
                                  }`}
                                >
                                  {option.optionValue}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    case "emailTool":
                      return (
                        <div key={block._id}>
                          <label className="font-semibold py-2 px-0">{block.data?.title}</label>
                          <Input
                            type="email"
                            placeholder="Email address"
                            className="focus-visible:ring-0 my-2 w-[60%]"
                            value={block.data?.value || ""}
                            onChange={e => handleChange(block._id, e.target.value, block.type)}
                          />
                        </div>
                      );
                    case "dateTool":
                      return (
                        <div key={block._id}>
                          <label className="font-semibold py-2 px-0">{block.data?.title}</label>
                          <Input
                            type="date"
                            className="focus-visible:ring-0 my-2 w-[60%]"
                            value={block.data?.value || ""}
                            onChange={e => handleChange(block._id, e.target.value, block.type)}
                          />
                        </div>
                      );
                    case "ratingTool":
                      return (
                        <div key={block._id}>
                          <label className="font-semibold py-2 px-0">{block.data?.title}</label>
                          <RatingInput
                            value={Number(block.data?.value) || 0}
                            maxRating={block.data?.maxRating || 5}
                            onChange={val => handleChange(block._id, String(val), block.type)}
                          />
                        </div>
                      );
                    case "dropdownTool":
                      return (
                        <div key={block._id}>
                          <label className="font-semibold py-2 px-0">{block.data?.title}</label>
                          <div className="my-2 w-[60%]">
                            <Select
                              value={block.data?.selectedOption || ""}
                              onValueChange={val => handleChange(block._id, val, block.type)}
                            >
                              <SelectTrigger className="focus:ring-0">
                                <SelectValue placeholder="Select an option" />
                              </SelectTrigger>
                              <SelectContent>
                                {block.data.options?.map((option: MCQOptions) => (
                                  <SelectItem
                                    key={option.optionMarker}
                                    value={option.optionMarker}
                                  >
                                    {option.optionValue}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      );
                    default:
                      break;
                  }
                })}

                <Button
                  className="w-24 mt-6"
                  type="submit"
                >
                  {isPending ? <Loader2Icon className="animate-spin w-4 h-4" /> : "Submit"}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FormViewPage;
