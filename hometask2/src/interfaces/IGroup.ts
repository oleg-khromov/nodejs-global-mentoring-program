export type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

export type IGroup = {
  id: string;
  name: string;
  permissions: Array<Permission>;
};

export type IGroupCreateInput = {
  name: string;
  permissions: Array<Permission>;
};
