enum MetadataDeltaActionType {
  ADD_VERIFIED_MEMBERS = 'ADD_VERIFIED_MEMBERS',
  REMOVE_VERIFIED_MEMBERS = 'REMOVE_VERIFIED_MEMBERS',
  MANAGE_TOKENS = 'MANAGE_TOKENS',
  DISABLE_PROXY_COLONY = 'DISABLE_PROXY_COLONY',
  ENABLE_PROXY_COLONY = 'ENABLE_PROXY_COLONY',
}

type AddVerifiedMembersOperation = {
  type: MetadataDeltaActionType.ADD_VERIFIED_MEMBERS;
  payload: string[];
};

type RemoveVerifiedMembersOperation = {
  type: MetadataDeltaActionType.REMOVE_VERIFIED_MEMBERS;
  payload: string[];
};

type ManageTokensOperation = {
  type: MetadataDeltaActionType.MANAGE_TOKENS;
  payload: string[] | unknown[];
};

type DisableProxyColonyOperation = {
  type: MetadataDeltaActionType.DISABLE_PROXY_COLONY;
  payload: string[] | unknown[];
};

type EnableProxyColonyOperation = {
  type: MetadataDeltaActionType.ENABLE_PROXY_COLONY;
  payload: string[] | unknown[];
};

export type MetadataDeltaOperation =
  | AddVerifiedMembersOperation
  | RemoveVerifiedMembersOperation
  | ManageTokensOperation;

export const getAddVerifiedMembersOperation = (
  members: string[],
): AddVerifiedMembersOperation => {
  return {
    type: MetadataDeltaActionType.ADD_VERIFIED_MEMBERS,
    payload: members,
  };
};

export const getRemoveVerifiedMembersOperation = (
  members: string[],
): RemoveVerifiedMembersOperation => {
  return {
    type: MetadataDeltaActionType.REMOVE_VERIFIED_MEMBERS,
    payload: members,
  };
};

export const getManageTokensOperation = (
  tokenAddresses: string[] | unknown[],
): ManageTokensOperation => {
  return {
    type: MetadataDeltaActionType.MANAGE_TOKENS,
    payload: tokenAddresses,
  };
};

export const getDisableProxyColonyOperation = (
  payload: string[],
): DisableProxyColonyOperation => {
  return {
    type: MetadataDeltaActionType.DISABLE_PROXY_COLONY,
    payload,
  };
};

export const getEnableProxyColonyOperation = (
  payload: string[],
): EnableProxyColonyOperation => {
  return {
    type: MetadataDeltaActionType.ENABLE_PROXY_COLONY,
    payload,
  };
};
