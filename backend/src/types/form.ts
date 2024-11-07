export interface BlockData {
  type: string;
  data: any; // Adjust based on your expected block data structure
}

export interface FormDataInterface {
  title: string;
  blocks: BlockData[];
  createdAt?: Date;
  updatedAt?: Date;
  workspaceId: string;
  time: number;
  version: string;
}
export interface SubmitFormDataInterface {
  title: string;
  blocks: BlockData[];
  _id: string;
}
