import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Link2Icon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ComponentProps {
  _id: string;
  forms: Array<{
    _id: string;
    name: string;
    submissions: number;
    created: Date;
    modified: Date;
    url: string;
  }>;
}

const WorkspaceFormList = ({ item }: { item: ComponentProps }) => {
  return (
    <div>
      {item.forms?.map((form) => (
        <div
          key={form._id}
          className="flex justify-between items-center px-3 py-2 rounded-md hover:bg-slate-100 hover:cursor-pointer"
        >
          <div className="flex-col col-span-1">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-muted-foreground">
              {form.name}
            </h4>
            <div className="text-muted-foreground flex gap-4 items-center">
              <p className="text-sm ">Submissions: {form.submissions}</p>

              <p className="text-sm">
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
              variant="secondary"
              size="sm"
              className="hover:bg-slate-400 bg-slate-300 w-auto h-6 px-3 font-semibold text-muted-foreground"
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
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-slate-300 w-6 h-6"
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
        </div>
      ))}
    </div>
  );
};

export default WorkspaceFormList;
