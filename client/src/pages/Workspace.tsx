import PageTitle from "@/components/common/PageTitle";
import { useSearchParams } from "react-router-dom";

const WorkspacePage = () => {
  const [searchParams] = useSearchParams();
  return (
    <div className="mx-auto container">
      <PageTitle>{searchParams.get("name")}</PageTitle>
      <div className=""></div>
    </div>
  );
};

export default WorkspacePage;
