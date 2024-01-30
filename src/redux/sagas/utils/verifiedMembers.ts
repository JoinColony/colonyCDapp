enum ActionType {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
}

type AddVerifiedMembersOperation = {
  type: ActionType.ADD;
  entity: 'verifiedMembers';
  colonyAddress: string;
  members: string[];
};

export type VerifiedMembersOperation = AddVerifiedMembersOperation;

export const getAddVerifiedMembersOperation = (
  colonyAddress: string,
  members: string[],
): AddVerifiedMembersOperation => {
  return {
    type: ActionType.ADD,
    entity: 'verifiedMembers',
    colonyAddress,
    members,
  };
};
