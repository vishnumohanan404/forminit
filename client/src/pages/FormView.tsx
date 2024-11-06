import PageTitle from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { fetchForm, viewForm } from "@/services/form";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
interface Block {
  type: string;
  data: any;
  _id: string;
}

interface Form {
  _id: string;
  title: string;
  blocks: Block[];
}
const FormViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery<Form>({
    queryKey: ["form", id],
    queryFn: () => viewForm(id),
    staleTime: 10000,
    enabled: !!id,
  });
  // State to store form input values
  const [formState, setFormState] = useState<Record<string, any>>({});
  const handleChange = (blockId: string, value: any) => {
    setFormState((prevState) => ({
      ...prevState,
      [blockId]: value,
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission, send formState to the API
    console.log("Form submitted:", formState);
    // Here, you'd call your API to submit the data
  };

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
                    {data?.blocks?.map((block) => {
                      switch (block.type) {
                        case "questionTitleBlock":
                          return (
                            <div key={block._id}>
                              <label className="font-semibold py-2 px-0">
                                {block.data?.title}
                              </label>
                            </div>
                          );
                        case "shortAnswerInputBlock":
                          return (
                            <div key={block._id}>
                              <Input
                                type="text"
                                placeholder={block.data?.inputValue}
                                className="focus-visible:ring-0 my-2 w-[60%]"
                                value={formState[block._id] || ""}
                                onChange={(e) =>
                                  handleChange(block._id, e.target.value)
                                }
                              />
                            </div>
                          );
                        case "longAnswerInputBlock":
                          return (
                            <div key={block._id}>
                              <Textarea
                                placeholder={block.data?.inputValue}
                                className="focus-visible:ring-0 my-2 resize-none"
                                rows={4}
                                value={formState[block._id] || ""}
                                onChange={(e) =>
                                  handleChange(block._id, e.target.value)
                                }
                              />
                            </div>
                          );
                        case "multipleChoiceOptionBlock":
                          return (
                            <div key={block._id}>
                              <div className="relative inline-flex w-full max-w-sm align-middle mb-2 items-center gap-2">
                                <div className="absolute inset-y-0 left-[4px] flex items-center justify-center w-8 pointer-events-none">
                                  <span className="text-sm font-medium text-muted bg-slate-600 px-[5px] py-0 rounded-sm">
                                    {block.data?.optionMarker.toUpperCase()}
                                  </span>
                                </div>
                                <div
                                  className={
                                    "w-[60%] flex h-10  rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 pl-9 cursor-pointer"
                                  }
                                >
                                  {block.data?.optionValue}
                                </div>
                              </div>
                            </div>
                          );
                        default:
                          break;
                      }
                    })}
                    <Button className="w-24 mt-6">Submit</Button>
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
