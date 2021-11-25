export type IUser = {
  id?: string;
  login: string;
  password: string;
  age: number;
  isDeleted?: boolean;
};

export type IUserCreateInput = {
  login: string;
  password: string;
  age: number;
};
