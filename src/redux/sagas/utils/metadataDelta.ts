enum MetadataDeltaActionType {
  ADD_VERIFIED_MEMBERS = 'ADD_VERIFIED_MEMBERS',
  REMOVE_VERIFIED_MEMBERS = 'REMOVE_VERIFIED_MEMBERS',
}

type AddVerifiedMembersOperation = {
  type: MetadataDeltaActionType.ADD_VERIFIED_MEMBERS;
  payload: string[];
};

type RemoveVerifiedMembersOperation = {
  type: MetadataDeltaActionType.REMOVE_VERIFIED_MEMBERS;
  payload: string[];
};

export type MetadataDeltaOperation =
  | AddVerifiedMembersOperation
  | RemoveVerifiedMembersOperation;

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
