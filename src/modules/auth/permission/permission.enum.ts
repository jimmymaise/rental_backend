import * as permissions from './permissions.json';

export const Permission = {
  //General Permission
  NEED_LOGIN: 'NEED_LOGIN',
  NO_NEED_LOGIN: 'NOT_LOGIN',

  //Inside Org permission
  ROOT: permissions.ROOT.name,
  ORG_MASTER: permissions.ORG_MASTER.name,
  GET_MY_ORG_DETAIL: permissions.GET_MY_ORG_DETAIL.name,
  UPDATE_OWN_ORG: permissions.UPDATE_OWN_ORG.name,
  CREATE_ROLE: permissions.CREATE_ROLE.name,
  UPDATE_ROLE: permissions.UPDATE_ROLE.name,
  GET_ROLE: permissions.GET_ROLE.name,
  DELETE_ROLE: permissions.DELETE_ROLE.name,
};

export default Permission;
