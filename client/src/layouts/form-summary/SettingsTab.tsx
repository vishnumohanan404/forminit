import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteForm, disableForm } from "@/services/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SettingsTab = ({ disabled }: { disabled: boolean }) => {
  const { formId } = useParams();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: handleDelete } = useMutation({
    mutationFn: () => deleteForm(formId),
    onSuccess: () => {
      // Boom baby!
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      navigate("/dashboard");
    },
  });

  const { mutate: handleDisable } = useMutation({
    mutationFn: () => disableForm(formId),
    onSuccess: () => {
      // Boom baby!
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({
        queryKey: ["formView", formId],
      });
    },
  });
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Disable Form</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Your forms will no longer be accessible through the public link
          </p>
          <Button
            variant="outline"
            className="text-sm"
            onClick={() => handleDisable()}
          >
            {disabled ? "Enable" : "Disable"}
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Delete Form</h2>
          <p className="text-sm text-muted-foreground mb-4">
            By deleting form you will lose all data related to this form
            including submissions
          </p>
          <Dialog
            onOpenChange={(isOpen) => {
              setIsOpen(isOpen);
            }}
            open={isOpen}
          >
            <DialogTrigger asChild>
              <Button variant="destructive" className="text-sm">
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-w-[90%] rounded-md">
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  Confirm to delete the form
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-3">
                <Button type="submit" onClick={() => handleDelete()}>
                  Confirm
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
