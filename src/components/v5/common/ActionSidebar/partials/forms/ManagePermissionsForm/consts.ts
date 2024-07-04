/* eslint-disable camelcase */
import { ColonyRole } from '@colony/colony-js';
import { defineMessages } from 'react-intl';
import { boolean, object } from 'yup';

import { type DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';
import { formatMessage } from '~utils/yup/tests/helpers.ts';
import {
  type DESCRIPTION_FIELD_NAME,
  type CREATED_IN_FIELD_NAME,
  type DECISION_METHOD_FIELD_NAME,
  type MEMBER_FIELD_NAME,
  type TEAM_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import { type CardSelectOption } from '~v5/common/Fields/CardSelect/types.ts';

export const ROLE_FIELD_NAME = 'role';
export const AUTHORITY_FIELD_NAME = 'authority';
export const PERMISSIONS_FIELD_NAME = 'permissions';

export const AVAILABLE_ROLES = [
  ColonyRole.Recovery,
  ColonyRole.Root,
  ColonyRole.Arbitration,
  ColonyRole.Architecture,
  ColonyRole.Funding,
  ColonyRole.Administration,
] as const;

type AvailableRolesUnion = (typeof AVAILABLE_ROLES)[number];

export type Permissions = {
  [K in AvailableRolesUnion as `role_${K}`]: boolean;
};

export type ManagePermissionsFormValues = {
  [MEMBER_FIELD_NAME]: string;
  [TEAM_FIELD_NAME]: number;
  [CREATED_IN_FIELD_NAME]: number;
  [ROLE_FIELD_NAME]: string | undefined;
  [AUTHORITY_FIELD_NAME]: Authority;
  [PERMISSIONS_FIELD_NAME]: Permissions | undefined;
  [DECISION_METHOD_FIELD_NAME]: DecisionMethod;
  [DESCRIPTION_FIELD_NAME]: string | undefined;
};

export type SchemaTestContext = { parent: ManagePermissionsFormValues };

export const permissionsSchema = object({
  role_0: boolean().default(false),
  role_1: boolean().default(false),
  role_2: boolean().default(false),
  role_3: boolean().default(false),
  role_5: boolean().default(false),
  role_6: boolean().default(false),
});

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
  permissionRequired: {
    id: 'managePermissionsFormError.permissionsRequired',
    defaultMessage: 'You have to select at least one permission',
  },
});

export const schemaTests: {
  [K in keyof Pick<ManagePermissionsFormValues, 'role' | 'permissions'>]: {
    scope: string;
    testTitles: Record<string, string>;
  };
} = {
  role: {
    scope: ROLE_FIELD_NAME,
    testTitles: {
      samePermissionsApplied: formatMessage(
        MANAGE_PERMISSIONS_FORM_MSGS.samePermissionsApplied,
      ),
    },
  },
  permissions: {
    scope: PERMISSIONS_FIELD_NAME,
    testTitles: {
      permissionRequired: formatMessage(
        MANAGE_PERMISSIONS_FORM_MSGS.permissionRequired,
      ),
      samePermissionsApplied: formatMessage(
        MANAGE_PERMISSIONS_FORM_MSGS.samePermissionsApplied,
      ),
    },
  },
};
