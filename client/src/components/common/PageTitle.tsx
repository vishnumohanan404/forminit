import { ReactNode } from "react";
import { Separator } from "../ui/separator";

const PageTitle = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="pt-14 pb-12">
        <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight  pb-6 text-slate-600">
          {children}
        </h1>
        <Separator />
      </div>
    </>
  );
};

export default PageTitle;
