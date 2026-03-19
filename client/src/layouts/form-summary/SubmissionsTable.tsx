import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormView } from "@/lib/types";
import { BlockData, OptionsBlockData } from "@shared/types";

export interface SubmissionData {
  _id: string;
  title: string;
  formId: string;
  blocks: BlockData[];
  createdAt: Date;
  updatedAt: Date;
}
const SubmissionsTable = ({
  formView,
  submissions,
}: {
  formView: FormView;
  submissions: Array<SubmissionData> | undefined;
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Submitted at</TableHead>
          {formView?.blocks?.map((block: BlockData) => {
            return <TableHead key={block._id}>{block.data?.title}</TableHead>;
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions?.map((submission: SubmissionData) => (
          <TableRow key={submission._id}>
            <TableCell>{new Date(submission.createdAt).toLocaleString()}</TableCell>
            {submission.blocks.map((block: BlockData) => (
              <TableCell key={block._id}>
                {block.type === "multipleChoiceTool"
                  ? block?.data?.options?.find(
                      (option: OptionsBlockData) =>
                        option.optionMarker === block.data.selectedOption,
                    )?.optionValue || "N/A"
                  : block.data.value || "N/A"}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
    <TableRow>
      <TableCell colSpan={3}>Total</TableCell>
      <TableCell className="text-right">$2,500.00</TableCell>
    </TableRow>
  </TableFooter> */}
    </Table>
  );
};

export default SubmissionsTable;
