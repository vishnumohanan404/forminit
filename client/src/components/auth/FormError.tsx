import { PropsWithChildren } from "react";

const FormError = ({ children }: PropsWithChildren) => {
  return <p className="text-red-600 text-xs">{children}</p>;
};

export default FormError;
