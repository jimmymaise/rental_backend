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

  GET_ITEM: permissions.GET_ITEM.name,
  UPDATE_ITEM: permissions.UPDATE_ITEM.name,
  DELETE_ITEM: permissions.DELETE_ITEM.name,
  CREATE_ITEM: permissions.CREATE_ITEM.name,

  GET_CUSTOM_ATTRIBUTES: permissions.GET_CUSTOM_ATTRIBUTES.name,
  UPDATE_CUSTOM_ATTRIBUTES: permissions.UPDATE_CUSTOM_ATTRIBUTES.name,
  DELETE_CUSTOM_ATTRIBUTES: permissions.DELETE_CUSTOM_ATTRIBUTES.name,
  CREATE_CUSTOM_ATTRIBUTES: permissions.CREATE_CUSTOM_ATTRIBUTES.name,

  FIND_USER_INFO: permissions.FIND_USER_INFO.name,

  GET_RENTING_ORDER: permissions.GET_RENTING_ORDER.name,
  UPDATE_RENTING_ORDER: permissions.UPDATE_RENTING_ORDER.name,
  DELETE_RENTING_ORDER: permissions.DELETE_RENTING_ORDER.name,
  CREATE_RENTING_ORDER: permissions.CREATE_RENTING_ORDER.name,

  GET_CUSTOMER: permissions.GET_CUSTOMER.name,
  UPDATE_CUSTOMER: permissions.UPDATE_CUSTOMER.name,
  DELETE_CUSTOMER: permissions.DELETE_CUSTOMER.name,
  CREATE_CUSTOMER: permissions.CREATE_CUSTOMER.name,

  GET_ORG_CATEGORY: permissions.GET_ORG_CATEGORY.name,
  UPDATE_ORG_CATEGORY: permissions.UPDATE_ORG_CATEGORY.name,
  DELETE_ORG_CATEGORY: permissions.DELETE_ORG_CATEGORY.name,
  CREATE_ORG_CATEGORY: permissions.CREATE_ORG_CATEGORY.name,

  GET_ORG_PAYMENT_METHOD: permissions.GET_ORG_PAYMENT_METHOD.name,
  UPDATE_ORG_PAYMENT_METHOD: permissions.UPDATE_ORG_PAYMENT_METHOD.name,
  DELETE_ORG_PAYMENT_METHOD: permissions.DELETE_ORG_PAYMENT_METHOD.name,
  CREATE_ORG_PAYMENT_METHOD: permissions.CREATE_ORG_PAYMENT_METHOD.name,
};

export default Permission;
