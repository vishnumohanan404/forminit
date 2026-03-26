import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchForm } from "@/services/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { BlockData } from "@shared/types";
import RatingInput from "@/components/form/ui/RatingInput";

interface MCQOptions {
  optionValue: string;
  optionMarker: string;
}

const FormPreviewPage = () => {
  const { id } = useParams();
  const [selections, setSelections] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["form", id],
    queryFn: () => fetchForm(id),
    staleTime: 0,
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="overflow-y-scroll px-5 pt-16">
        <main className="mx-auto max-w-[1100px] min-h-[66vh] flex-grow container mb-28">
          <div className="mx-auto max-w-[650px]">
            <div className="pt-14 pb-10">
              <Skeleton className="w-[20rem] h-9" />
            </div>
            <div className="flex flex-col gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-full h-6"
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground">
        Form not found.
      </div>
    );
  }

  return (
    <div className="overflow-y-scroll px-5 pt-16">
      {/* Preview banner */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-amber-50 border-b border-amber-200 text-amber-800 text-xs font-medium py-1.5">
        <EyeIcon size={13} />
        Preview — draft{data.published ? " · live form may differ" : " · not yet published"}
      </div>

      <main className="mx-auto max-w-[1100px] min-h-[66vh] flex-grow container mb-28">
        <div className="mx-auto max-w-[650px]">
          <h1 className="text-4xl font-bold pt-14 pb-10">{data.title || "Untitled"}</h1>

          <div className="flex flex-col gap-3">
            {data.blocks?.map((block: BlockData) => {
              switch (block.type) {
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
                case "shortAnswerTool":
                  return (
                    <div key={block._id}>
                      <Input
                        type="text"
                        placeholder={block.data?.placeholder}
                        className="focus-visible:ring-0 max-w-sm"
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
                      />
                    </div>
                  );
                case "emailTool":
                  return (
                    <div key={block._id}>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        className="focus-visible:ring-0 max-w-sm"
                      />
                    </div>
                  );
                case "dateTool":
                  return (
                    <div key={block._id}>
                      <Input
                        type="date"
                        className="focus-visible:ring-0 max-w-sm"
                      />
                    </div>
                  );
                case "ratingTool":
                  return (
                    <div key={block._id}>
                      <RatingInput
                        value={0}
                        maxRating={block.data?.maxRating || 5}
                        onChange={() => {}}
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
                              setSelections(s => ({ ...s, [block._id]: option.optionMarker }))
                            }
                          >
                            <div className="absolute inset-y-0 left-[4px] flex items-center justify-center w-8 pointer-events-none">
                              <span className="text-sm font-medium text-muted bg-slate-600 px-[5px] py-0 rounded-sm">
                                {option.optionMarker.toUpperCase()}
                              </span>
                            </div>
                            <div
                              className={`min-w-[60%] flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm pl-9 ${
                                selections[block._id] === option.optionMarker
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
                case "dropdownTool":
                  return (
                    <div key={block._id}>
                      <div className="max-w-sm">
                        <Select
                          value={selections[block._id] || ""}
                          onValueChange={val => setSelections(s => ({ ...s, [block._id]: val }))}
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
              disabled
            >
              Submit
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FormPreviewPage;
