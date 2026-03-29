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
import { CalendarIcon, Loader2Icon } from "lucide-react";
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

const INPUT_TYPES = new Set([
  "shortAnswerTool",
  "longAnswerTool",
  "multipleChoiceTool",
  "dropdownTool",
  "emailTool",
  "dateTool",
  "ratingTool",
]);

/**
 * For each input block, find the nearest preceding paragraph/heading block as its title.
 * Stops searching if it hits another input block first (Tally-style positional pairing).
 */
function getTitleForBlock(blocks: BlockData[], index: number): string {
  for (let j = index - 1; j >= 0; j--) {
    const t = blocks[j].type;
    if (t === "paragraph" || t === "heading" || t === "questionTitle") {
      return (blocks[j].data as Record<string, string>).text || "";
    }
    if (INPUT_TYPES.has(t)) break;
  }
  return "";
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

  const [formState, setFormState] = useState<Array<BlockData>>([]);
  const [emailErrors, setEmailErrors] = useState<Record<string, string>>({});

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  useEffect(() => {
    if (!isLoading && data) setFormState(data.blocks);
  }, [data, isLoading]);

  const handleChange = (blockId: string, value: string, type: string) => {
    setFormState(prev =>
      prev.map(block => {
        if (block._id !== blockId) return block;
        if (
          type === "shortAnswerTool" ||
          type === "longAnswerTool" ||
          type === "emailTool" ||
          type === "dateTool" ||
          type === "ratingTool"
        ) {
          return { ...block, data: { ...block.data, value } };
        }
        if (type === "multipleChoiceTool" || type === "dropdownTool") {
          return { ...block, data: { ...block.data, selectedOption: value } };
        }
        return block;
      }),
    );
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

    // Validate all email fields before submitting
    const newEmailErrors: Record<string, string> = {};
    formState.forEach(block => {
      if (block.type === "emailTool") {
        const val = block.data?.value || "";
        if (val && !isValidEmail(val)) {
          newEmailErrors[block._id] = "Please enter a valid email address.";
        }
      }
    });
    if (Object.keys(newEmailErrors).length > 0) {
      setEmailErrors(newEmailErrors);
      return;
    }

    // Build submission: only input blocks, with title from nearest preceding content block
    const submissionBlocks = formState
      .map((block, i) => {
        if (!INPUT_TYPES.has(block.type)) return null;
        const title = getTitleForBlock(formState, i);
        return { ...block, data: { ...block.data, title } };
      })
      .filter(Boolean) as BlockData[];

    submitFormMutation({
      blocks: submissionBlocks,
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

  if (data?.disabled) return <NotFoundPage />;

  if (isLoading) {
    return (
      <div className="overflow-y-scroll px-5">
        <main className="mx-auto max-w-[1100px] min-h-[66vh] overflow-auto flex-grow container mb-28">
          <div className="mx-auto max-w-[650px]">
            <div className="pt-14 pb-10">
              <Skeleton className="w-[20rem] h-9" />
            </div>
            <div className="flex flex-col gap-6">
              {[...Array(6)].map((_, index) => (
                <Skeleton
                  key={index}
                  className="w-full h-6"
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-y-scroll px-5 pt-16">
        <main className="mx-auto max-w-[1100px] min-h-[66vh] overflow-auto flex-grow container mb-28">
          <div className="mx-auto max-w-[650px]">
            <h1 className="text-4xl font-bold pt-14 pb-10">{data?.title}</h1>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-3">
                {formState?.map(block => {
                  switch (block.type) {
                    // Content blocks render as-is
                    case "paragraph":
                      return (
                        <p
                          key={block._id}
                          className="font-semibold py-1"
                        >
                          {(block.data as Record<string, string>).text}
                        </p>
                      );
                    case "heading":
                      return (
                        <h2
                          key={block._id}
                          className="text-2xl font-bold py-1"
                        >
                          {(block.data as Record<string, string>).text}
                        </h2>
                      );

                    case "questionTitle":
                      return (
                        <p
                          key={block._id}
                          className="text-base font-semibold py-1"
                        >
                          {(block.data as Record<string, string>).text}
                        </p>
                      );

                    // Input blocks — no label (the preceding paragraph IS the label)
                    case "shortAnswerTool":
                      return (
                        <div key={block._id}>
                          <Input
                            type="text"
                            placeholder={block.data?.placeholder}
                            className="focus-visible:ring-0 max-w-sm"
                            value={block.data?.value || ""}
                            onChange={e => handleChange(block._id, e.target.value, block.type)}
                          />
                        </div>
                      );
                    case "longAnswerTool":
                      return (
                        <div key={block._id}>
                          <Textarea
                            placeholder={block.data?.placeholder}
                            className="focus-visible:ring-0 resize-none w-[80%]"
                            rows={4}
                            value={block.data?.value || ""}
                            onChange={e => handleChange(block._id, e.target.value, block.type)}
                          />
                        </div>
                      );
                    case "multipleChoiceTool":
                      return (
                        <div key={block._id}>
                          <div className="py-1">
                            {block.data.options?.map((option: MCQOptions) => (
                              <button
                                type="button"
                                key={option.optionMarker}
                                className="relative cursor-pointer inline-flex w-full max-w-sm align-middle mb-2 items-center gap-2"
                                onClick={() =>
                                  handleChange(block._id, option.optionMarker, block.type)
                                }
                              >
                                <div className="absolute inset-y-0 left-[4px] flex items-center justify-center w-8 pointer-events-none">
                                  <span className="text-sm font-medium text-muted bg-slate-600 px-[5px] py-0 rounded-sm">
                                    {option.optionMarker.toUpperCase()}
                                  </span>
                                </div>
                                <div
                                  className={`min-w-[60%] flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm pl-9 ${
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
                          <Input
                            type="email"
                            placeholder="name@example.com"
                            className={`focus-visible:ring-0 max-w-sm ${emailErrors[block._id] ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            value={block.data?.value || ""}
                            onChange={e => {
                              handleChange(block._id, e.target.value, block.type);
                              if (emailErrors[block._id] && isValidEmail(e.target.value)) {
                                setEmailErrors(prev => {
                                  const n = { ...prev };
                                  delete n[block._id];
                                  return n;
                                });
                              }
                            }}
                            onBlur={e => {
                              const val = e.target.value;
                              if (val && !isValidEmail(val)) {
                                setEmailErrors(prev => ({
                                  ...prev,
                                  [block._id]: "Please enter a valid email address.",
                                }));
                              }
                            }}
                          />
                          {emailErrors[block._id] && (
                            <p className="mt-1 text-xs text-destructive">
                              {emailErrors[block._id]}
                            </p>
                          )}
                        </div>
                      );
                    case "dateTool":
                      return (
                        <div
                          key={block._id}
                          className="flex items-center w-[60%] h-10 rounded-md border border-border bg-background px-3 gap-2 focus-within:ring-1 focus-within:ring-ring"
                        >
                          <input
                            type="date"
                            className="flex-1 bg-transparent text-sm focus:outline-none cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden"
                            value={block.data?.value || ""}
                            onChange={e => handleChange(block._id, e.target.value, block.type)}
                          />
                          <CalendarIcon
                            size={14}
                            className="shrink-0 text-muted-foreground pointer-events-none"
                          />
                        </div>
                      );
                    case "ratingTool":
                      return (
                        <div key={block._id}>
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
                          <div className="max-w-sm">
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
                      return null;
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
