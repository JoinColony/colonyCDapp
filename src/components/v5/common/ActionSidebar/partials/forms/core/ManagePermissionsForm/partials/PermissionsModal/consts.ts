import { UserRole } from '~constants/permissions.ts';
import { formatText } from '~utils/intl.ts';

export const PERMISSIONS_MODAL_CONTENT = [
  {
    key: UserRole.Mod,
    title: formatText({ id: 'role.mod' }),
    heading: formatText({
      id: 'actionSidebar.managePermissions.permissionsModal.mod.heading',
    }),
    actions: [formatText({ id: 'permissions.moderation' })],
  },
  {
    key: UserRole.Payer,
    title: formatText({ id: 'role.payer' }),
    heading: formatText({
      id: 'actionSidebar.managePermissions.permissionsModal.payer.heading',
    }),
    actions: [
      formatText({ id: 'permissions.simplePayments' }),
      formatText({ id: 'permissions.advancedPayments' }),
      formatText({ id: 'permissions.batchPayments' }),
      formatText({ id: 'permissions.splitPayments' }),
      formatText({ id: 'permissions.stagedPayments' }),
      formatText({ id: 'permissions.streamingPayments' }),
      formatText({ id: 'permissions.penaliseReputation' }),
    ],
  },
  {
    key: UserRole.Admin,
    title: formatText({ id: 'role.admin' }),
    heading: formatText({
      id: 'actionSidebar.managePermissions.permissionsModal.admin.heading',
    }),
    actions: [
      formatText({ id: 'permissions.createATeam' }),
      formatText({ id: 'permissions.editTeam' }),
      formatText({ id: 'permissions.managePermissions' }),
      formatText({ id: 'permissions.banMember' }),
      formatText({ id: 'permissions.manageVerifiedMembers' }),
    ],
  },
  {
    key: UserRole.Owner,
    title: formatText({ id: 'role.owner' }),
    heading: formatText({
      id: 'actionSidebar.managePermissions.permissionsModal.owner.heading',
    }),
    actions: [
      formatText({ id: 'permissions.mintTokens' }),
      formatText({ id: 'permissions.unlockToken' }),
      formatText({ id: 'permissions.manageTokens' }),
      formatText({ id: 'permissions.upgradeColonyVersion' }),
      formatText({ id: 'permissions.managePermissions' }),
      formatText({ id: 'permissions.manageReputation' }),
    ],
  },
  {
    key: UserRole.Custom,
    title: formatText({
      id: 'actionSidebar.managePermissions.permissionsModal.custom.title',
    }),
    heading: formatText({
      id: 'actionSidebar.managePermissions.permissionsModal.custom.heading',
    }),
    actions: [
      formatText({ id: 'role.6' }),
      formatText({ id: 'role.5' }),
      formatText({ id: 'role.2' }),
      formatText({ id: 'role.3' }),
      formatText({ id: 'role.1' }),
      formatText({ id: 'role.0' }),
    ],
  },
];
