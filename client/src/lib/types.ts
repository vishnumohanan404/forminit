export type User = {
  _id: string;
  fullName: string;
  email: string;
  googleId: string;
};

export type FormType = {
  name: string;
  submissions: number;
  created: string;
  modified: string;
  url: string;
  form_id: string;
  _id: string;
  published?: boolean;
};

export type WorkspaceType = {
  name: string;
  forms: FormType[];
  _id: string;
};

export type DashboardDataTypes = {
  _id: string;
  user_id: string;
  workspaces: WorkspaceType[];
  __v: number;
};
