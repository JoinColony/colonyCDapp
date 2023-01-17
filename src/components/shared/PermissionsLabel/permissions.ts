import { defineMessages, MessageDescriptor } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';

import { Icons } from '~constants';

const MSG = defineMessages({
  rootLabel: {
    id: 'core.Permission.rootLabel',
    defaultMessage: 'Root',
  },
  rootInfoMessage: {
    id: 'core.Permission.rootInfoMessage',
    defaultMessage: 'Root permission',
  },
  administrationLabel: {
    id: 'core.Permission.administrationLabel',
    defaultMessage: 'Administration',
  },
  administrationInfoMessage: {
    id: 'core.Permission.administrationInfoMessage',
    defaultMessage: 'Administration permission',
  },
  architectureLabel: {
    id: 'core.Permission.architectureLabel',
    defaultMessage: 'Architecture',
  },
  architectureInfoMessage: {
    id: 'core.Permission.architectureInfoMessage',
    defaultMessage: 'Architecture permission',
  },
  fundingLabel: {
    id: 'core.Permission.fundingLabel',
    defaultMessage: 'Funding',
  },
  fundingInfoMessage: {
    id: 'core.Permission.fundingInfoMessage',
    defaultMessage: 'Funding permission',
  },
  arbitrationLabel: {
    id: 'core.Permission.arbitrationLabel',
    defaultMessage: 'Arbitration',
  },
  arbitrationInfoMessage: {
    id: 'core.Permission.arbitrationInfoMessage',
    defaultMessage: 'Arbitration permission',
  },
  recoveryLabel: {
    id: 'core.Permission.recoveryLabel',
    defaultMessage: 'Recovery',
  },
  recoveryInfoMessage: {
    id: 'core.Permission.recoveryInfoMessage',
    defaultMessage: 'Recovery permission',
  },
});

export type PermissionDefaults = {
  label: MessageDescriptor;
  infoMessage: MessageDescriptor;
  icon: Icons;
};

export type PermissionsObject = {
  [colonyRole: number]: PermissionDefaults;
};

export const permissionsObject: PermissionsObject = {
  [ColonyRole.Root]: {
    label: MSG.rootLabel,
    infoMessage: MSG.rootInfoMessage,
    icon: Icons.EmojiYellowSuperman,
  },
  [ColonyRole.Administration]: {
    label: MSG.administrationLabel,
    infoMessage: MSG.administrationInfoMessage,
    icon: Icons.EmojiClipboard,
  },
  [ColonyRole.Architecture]: {
    label: MSG.architectureLabel,
    infoMessage: MSG.architectureInfoMessage,
    icon: Icons.EmojiCrane,
  },
  [ColonyRole.Funding]: {
    label: MSG.fundingLabel,
    infoMessage: MSG.fundingInfoMessage,
    icon: Icons.EmojiBagMoneySign,
  },
  [ColonyRole.Arbitration]: {
    label: MSG.arbitrationLabel,
    infoMessage: MSG.arbitrationInfoMessage,
    icon: Icons.EmojiBalance,
  },
  [ColonyRole.Recovery]: {
    label: MSG.recoveryLabel,
    infoMessage: MSG.recoveryInfoMessage,
    icon: Icons.EmojiAlarmLamp,
  },
};
