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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { ReactNode, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkspace } from "@/services/workspace";

const CreateWorkspaceDialog = ({ children }: { children: ReactNode }) => {
  const [fields, setFields] = useState({
    workspace_description: "",
    workspace_name: "",
  });
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFields((prev) => ({ ...prev, workspace_name: value }));
  };
  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setFields((prev) => ({ ...prev, workspace_description: value }));
  };
  const handleDialogClose = () => {
    // Reset the fields state when the dialog closes
    setFields({
      workspace_description: "",
      workspace_name: "",
    });
  };
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (workspaceDetails: { name: string; description: string }) =>
      createWorkspace(workspaceDetails),
    onSuccess: () => {
      // Boom baby!
      handleDialogClose();
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const handleSubmit = () => {
    mutate({
      name: fields.workspace_name,
      description: fields.workspace_description,
    });
  };
  return (
    <Dialog
      onOpenChange={(isOpen) => {
        !isOpen && handleDialogClose();
        setIsOpen(isOpen);
      }}
      open={isOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create workspace</DialogTitle>
          <DialogDescription>Click save once you're done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={fields.workspace_name}
              placeholder="e.g: My Workspace"
              className="col-span-3"
              onChange={handleNameChange}
              maxLength={20}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={fields.workspace_description}
              placeholder="e.g: Forms for my students"
              className="col-span-3 max-h-24"
              onChange={handleTextAreaChange}
              maxLength={100}
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!fields.workspace_name.length || isPending}
            className="min-w-32"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Save changes"
            )}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspaceDialog;
