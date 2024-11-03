import PageTitle from "@/components/common/PageTitle";
import { useParams } from "react-router-dom";
import Editor from "@/components/form/Editor";
import { Button } from "@/components/ui/button";

const FormPage = () => {
  const { id, name } = useParams();
  const handleSubmit = () => {};
  return (
    <div className=" overflow-y-auto px-5">
      <PageTitle>
        <div className="flex justify-between items-center">
          {!id ? "Create New Form" : name}
          <Button
            size="sm"
            className="font-bold tracking-normal bg-blue-500 hover:bg-blue-600"
            onClick={handleSubmit}
          >
            PUBLISH
          </Button>
        </div>
      </PageTitle>
      <Editor />
    </div>
  );
};

export default FormPage;
