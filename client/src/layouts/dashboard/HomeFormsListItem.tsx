import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { FormType } from "@/lib/types";
import { FileText, LinkIcon, Settings } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const HomeFormsListItem = ({ form }: { form: FormType }) => {
  const [hover, setHover] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <Card
      key={form._id}
      className="cursor-pointer shadow-none"
      onClick={() => {
        navigate(
          `/form-summary/${form.form_id}?name=${form.name}&submission=${form.submissions}&url=${form.url}&modified=${form.modified}&created=${form.created}`
        );
      }}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    >
      <CardHeader className="">
        <CardTitle className={hover ? "underline underline-offset-4" : ""}>
          {form.name}
        </CardTitle>
        <div className="flex justify-between w-full pt-2 items-center">
          <div>
            <p className="text-sm text-muted-foreground">
              Submissions: {form.submissions}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to={`/view-form/${form.form_id}`}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                View
              </Button>
            </Link>
            <div className="flex align-middle gap-5">
              {form.published && (
                <Button variant={"ghost"}>
                  <LinkIcon />
                </Button>
              )}
              <Link
                to={`/form/${form.form_id}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" /> Edit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default HomeFormsListItem;
