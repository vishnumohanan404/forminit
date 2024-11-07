import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Link2Icon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";

interface FormDetails {
  name: string;
  submissions: number;
  created: Date;
  modified: Date;
  url: string;
  form_id: string;
}
interface ComponentProps {
  _id: string;
  forms: Array<FormDetails>;
}

const WorkspaceFormList = ({ item }: { item: ComponentProps }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleOnClick = (form: FormDetails) => {
    navigate(
      `/form-summary/${form.form_id}?name=${form.name}&submission=${form.submissions}&url=${form.url}&modified=${form.modified}&created=${form.created}`
    );
  };
  return (
    <AnimatePresence>
      <div>
        {item.forms?.map((form) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            key={form.form_id}
            className="flex justify-between items-center px-3 py-2 rounded-md hover:bg-slate-200 hover:cursor-pointer"
            onClick={() => {
              handleOnClick(form);
            }}
          >
            <div className="flex-col col-span-1">
              <h5 className="scroll-m-20 font-semibold tracking-tight text-muted-foreground text-slate-600">
                {form.name}
              </h5>
              <div className="text-muted-foreground flex gap-4 items-center">
                <p className="text-sm font-light">
                  Submissions: {form.submissions}
                </p>

                <p className="text-sm font-light">
                  Edited{" "}
                  {new Date(form.modified)?.toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                  }) ||
                    new Date(form.created)?.toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                </p>
                {/* <p>Modified: {form.modified?.toLocaleString()}</p> */}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-auto h-6 px-3 font-semibold text-muted-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/form/${form.form_id}?workspaceId=${id}`);
                }}
              >
                EDIT
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={form.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-6 h-6 text-muted-foreground"
                      >
                        <Link2Icon />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Published link</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
};

export default WorkspaceFormList;
