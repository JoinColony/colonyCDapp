import { ColonyRole } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';
import { type CardSelectOption } from '~v5/common/Fields/CardSelect/types.ts';

export type ManagePermissionsFormValues = {
  member: string;
  team: number;
  createdIn: number;
  role: string;
  authority: string;
  permissions: Record<string, boolean>;
  description: string;
};

export const AVAILABLE_ROLES = [
  ColonyRole.Root,
  ColonyRole.Administration,
  ColonyRole.Architecture,
  ColonyRole.Funding,
  ColonyRole.Recovery,
  ColonyRole.Arbitration,
];

export enum RemoveRoleOptionValue {
  remove = 'remove',
}

export enum Authority {
  ViaMultiSig = 'via-multi-sig',
  Own = 'own',
}

export const AuthorityOptions: CardSelectOption<string>[] = [
  // @TODO: Uncomment when multi-sig is ready
  // {
  //   label: formatText({ id: 'actionSidebar.authority.viaMultiSig' }),
  //   value: Authority.ViaMultiSig,
  // },
  {
    label: formatText({ id: 'actionSidebar.authority.own' }),
    value: Authority.Own,
  },
];

export const MANAGE_PERMISSIONS_FORM_MSGS = defineMessages({
  samePermissionsApplied: {
    id: 'managePermissionsFormError.samePermissionsApplied',
    defaultMessage: 'This user already has these permissions',
  },
});
