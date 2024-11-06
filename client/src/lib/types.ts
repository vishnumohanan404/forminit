export type User = {
  _id: string;
  fullName: string;
  email: string;
  bio?: string;
  googleId: string;
};
export interface UserProfile {
  fullName: string;
  email: string;
  avatar?: string;
  bio?: string;
  googleId?: string;
}
export interface UserPwdData {
  currentPwd?: string;
  newPwd: string;
}
export type FormType = {
  name: string;
  submissions: number;
  created: string;
  modified: string;
  url: string;
  form_id: string;
  _id: string;
  published?: boolean;
  workspaceId?: string;
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
