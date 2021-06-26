export enum UpdateAction {
  Add = 'Add',
  Edit = 'Edit',
  Delete = 'Delete',
}

export interface UpdateActionModel {
  action: UpdateAction;
  field: string;
  from?: string;
  to: string;
}
