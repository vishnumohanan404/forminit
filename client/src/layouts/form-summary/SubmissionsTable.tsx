import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormView } from "@/lib/types";

interface BlockData {
  type: string; // Type of the block (e.g., 'header', 'paragraph', etc.)
  data: any; // Data specific to the block type
}
interface SubmissionData {
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
      <TableCaption>A list of your recent Submissions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Submitted at</TableHead>
          {formView?.blocks?.map(
            (block: { _id: string; type: string; data: { title: string } }) => {
              return <TableHead key={block._id}>{block.data?.title}</TableHead>;
            }
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions?.map((submission: any) => (
          <TableRow key={submission._id}>
            <TableCell>
              {new Date(submission.createdAt).toLocaleString()}
            </TableCell>
            {submission.blocks.map((block: any) => (
              <TableCell key={block._id}>
                {block.type === "multipleChoiceTool"
                  ? block.data.options.find(
                      (option: any) =>
                        option.optionMarker === block.data.selectedOption
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
