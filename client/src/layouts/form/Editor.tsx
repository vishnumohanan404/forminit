import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchForm } from "@/services/form.ts";
import { FormDataInterface } from "@shared/types";
import BlockNoteEditor from "@/components/form/BlockNoteEditor";

const Editor = () => {
  const { id } = useParams();
  const { data, isFetched } = useQuery({
    queryKey: ["form", id],
    queryFn: (): Promise<FormDataInterface> => fetchForm(id),
    staleTime: 10000,
    enabled: !!id,
  });

  if (id && !isFetched) return null;

  return (
    <div className="mx-auto max-w-[760px] min-h-[300px] overflow-auto flex-grow container">
      <BlockNoteEditor
        initialData={data}
        formId={id}
      />
    </div>
  );
};

export default Editor;
