import { formatText } from '~utils/intl.ts';
import { type CardSelectOption } from '~v5/common/Fields/CardSelect/types.ts';

export enum ModificationOption {
  AwardReputation = 'AwardReputation',
  RemoveReputation = 'RemoveReputation',
}

export const modificationOptions: CardSelectOption<ModificationOption>[] = [
  {
    label: formatText({
      id: 'actionSidebar.modification.awardReputation',
    }),
    value: ModificationOption.AwardReputation,
  },

  {
    label: formatText({
      id: 'actionSidebar.modification.removeReputation',
    }),
    value: ModificationOption.RemoveReputation,
  },
];
