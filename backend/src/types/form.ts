import { BlockData } from "@shared/types";

export interface SubmitFormDataInterface {
  _id: string;
  title: string;
  blocks: BlockData[];
}
