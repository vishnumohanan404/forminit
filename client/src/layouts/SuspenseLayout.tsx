import { Loader2 } from "lucide-react";

const SuspenseLayout = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Loader2 className="animate-spin w-6 h-6" />
    </div>
  );
};

export default SuspenseLayout;
