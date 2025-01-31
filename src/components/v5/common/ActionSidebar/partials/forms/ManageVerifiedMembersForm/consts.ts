import { ManageVerifiedMembersOperation } from '~types';
import { formatText } from '~utils/intl.ts';
import { type CardSelectOption } from '~v5/common/Fields/CardSelect/types.ts';

export const getManageMembersOptions = (): {
  manageMembersOptions: CardSelectOption<ManageVerifiedMembersOperation>[];
} => {
  return {
    manageMembersOptions: [
      {
        label: formatText({ id: 'actionSidebar.option.addMembers' }),
        value: ManageVerifiedMembersOperation.Add,
      },
      {
        label: formatText({ id: 'actionSidebar.option.removeMembers' }),
        value: ManageVerifiedMembersOperation.Remove,
      },
    ],
  };
};
