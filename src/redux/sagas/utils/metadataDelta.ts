enum MetadataDeltaActionType {
  ADD_VERIFIED_MEMBERS = 'ADD_VERIFIED_MEMBERS',
  REMOVE_VERIFIED_MEMBERS = 'REMOVE_VERIFIED_MEMBERS',
  MANAGE_TOKENS = 'MANAGE_TOKENS',
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
  payload: string[];
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
  tokenAddresses: string[],
): ManageTokensOperation => {
  return {
    type: MetadataDeltaActionType.MANAGE_TOKENS,
    payload: tokenAddresses,
  };
};
