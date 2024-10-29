import PageTitle from "@/components/common/PageTitle";
import { Separator } from "@/components/ui/separator";
import { useParams } from "react-router-dom";

const FormPage = () => {
  const { id } = useParams();
  return (
    <div className="mx-auto container">
      <PageTitle>Forms</PageTitle>
      <div className=""></div>
    </div>
  );
};

export default FormPage;
