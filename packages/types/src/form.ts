export type OptionsBlockData = {
  optionValue: string;
  optionMarker: string;
};

export interface BlockData {
  _id: string;
  type: string;
  data: {
    title?: string;
    required?: boolean;
    placeholder?: string;
    options?: OptionsBlockData[];
    selectedOption?: string;
    value: string;
  };
}

export interface FormField {
  label: string;
  type: string;
  required: boolean;
}

export interface FormData {
  id?: string;
  title: string;
  fields: FormField[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FormDataInterface {
  title: string;
  time: number;
  version: string;
  blocks: BlockData[];
  createdAt?: Date;
  updatedAt?: Date;
  workspaceId: string;
  disabled?: boolean;
}
