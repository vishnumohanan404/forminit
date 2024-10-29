import { ReactNode } from "react";

const PageTitle = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="py-20">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-3xl">
          {children}
        </h1>
      </div>
    </>
  );
};

export default PageTitle;
