// @BETA: DISABLED
// import React from 'react';
import { defineMessages } from 'react-intl';

import { CoreAction } from '~actions/index.ts';
// @BETA: DISABLED
// import { formatText } from '~utils/intl';
// import ExtensionStatusBadge from '~v5/common/Pills/ExtensionStatusBadge';

export const MSG = defineMessages({
  singlePayments: {
    id: `common.Extensions.SubNavigation.partials.DropdownContent.singlePayments`,
    defaultMessage: 'Single payments',
  },
  singlePaymentsDescription: {
    id: `common.Extensions.SubNavigation.partials.DropdownContent.singlePaymentsDescription`,
    defaultMessage: 'Create a new simple payment.',
  },
  advancedPayments: {
    id: `common.Extensions.SubNavigation.partials.DropdownContent.advancedPayments`,
    defaultMessage: 'Advanced payments',
  },
  advancedPaymentsDescription: {
    id: `common.Extensions.SubNavigation.partials.DropdownContent.advancedPaymentsDescription`,
    defaultMessage: 'A payment with more features and options.',
  },
  streamingPayments: {
    id: `common.Extensions.SubNavigation.partials.DropdownContent.streamingPayments`,
    defaultMessage: 'Streaming payments',
  },
  streamingPaymentsDescription: {
    id: `common.Extensions.SubNavigation.partials.DropdownContent.streamingPaymentsDescription`,
    defaultMessage: 'Create ongoing payments.',
  },
  moveFunds: {
    id: `common.Extensions.SubNavigation.partials.DropdownContent.moveFunds`,
    defaultMessage: 'Move funds',
  },
  moveFundsDescription: {
    id: `common.Extensions.SubNavigation.partials.DropdownContent.moveFundsDescription`,
    defaultMessage: 'Transfer funds between teams.',
  },
  buttonTextPay: {
    id: `common.Extensions.SubNavigation.partials.DropdownContent.buttonText`,
    defaultMessage: 'View active payments',
  },
  comingSoon: {
    id: `common.Extensions.SubNavigation.partials.DropdownContent.comingSoon`,
    defaultMessage: 'Coming soon',
  },
  manageTeams: {
    id: `common.Extensions.SubNavigation.partials.DropdownContent.manageTeams`,
    defaultMessage: 'Manage Teams',
  },
  manageTeamsDescription: {
    id: `common.Extensions.SubNavigation.partials.DropdownContent.manageTeamsDescription`,
    defaultMessage: 'View, Add, and Edit teams.',
  },
  manageReputation: {
    id: `common.Extensions.SubNavigation.partials.DropdownContent.manageReputation`,
    defaultMessage: 'Manage Reputation',
  },
  manageReputationDescription: {
    id: `common.Extensions.SubNavigation.partials.DropdownContent.manageReputationDescription`,
    defaultMessage: 'Award or remove reputation.',
  },
  managePermissions: {
    id: `common.Extensions.SubNavigation.partials.DropdownContent.managePermissions`,
    defaultMessage: 'Manage Permissions',
  },
  managePermissionsDescription: {
    id: `common.Extensions.SubNavigation.partials.DropdownContent.managePermissionsDescription`,
    defaultMessage: 'Add, change or remove permissions.',
  },
  organizationDetails: {
    id: `common.Extensions.SubNavigation.partials.DropdownContent.organizationDetails`,
    defaultMessage: 'Organization Details',
  },
  organizationDetailsDescription: {
    id: `common.Extensions.SubNavigation.partials.DropdownContent.organizationDetailsDescription`,
    defaultMessage: 'Add or update the details of the DAO.',
  },
  buttonTextManage: {
    id: `common.Extensions.SubNavigation.partials.DropdownContent.buttonText`,
    defaultMessage: 'View admin area',
  },
  createDecision: {
    id: `common.Extensions.SubNavigation.partials.DropdownContent.createDecision`,
    defaultMessage: 'Create Decision',
  },
  createDecisionDescription: {
    id: `common.Extensions.SubNavigation.partials.DropdownContent.createDecisionDescription`,
    defaultMessage: 'Create a new decision.',
  },
  simpleDiscussion: {
    id: `common.Extensions.SubNavigation.partials.DropdownContent.simpleDiscussion`,
    defaultMessage: 'Simple Discussion',
  },
  simpleDiscussionDescription: {
    id: `common.Extensions.SubNavigation.partials.DropdownContent.simpleDiscussionDescription`,
    defaultMessage: 'Discuss plans get advice from others.',
  },
  buttonTextDecide: {
    id: `common.Extensions.SubNavigation.partials.DropdownContent.buttonText`,
    defaultMessage: 'View decisions',
  },
});

export const DECIDE_DROPDOWN_ITEMS = [
  {
    action: CoreAction.CreateDecisionMotion,
    title: MSG.createDecision,
    description: MSG.createDecisionDescription,
  },
];

export const PAY_DROPDOWN_ITEMS = [
  {
    title: MSG.singlePayments,
    description: MSG.singlePaymentsDescription,
    action: CoreAction.Payment,
  },
  // @BETA: DISABLED
  // {
  //   title: MSG.advancedPayments,
  //   description: MSG.advancedPaymentsDescription,
  //   action: Action.PaymentBuilder,
  //   statusBadge: <ExtensionStatusBadge text={formatText(MSG.comingSoon)} />,
  // },
  // {
  //   title: MSG.streamingPayments,
  //   description: MSG.streamingPaymentsDescription,
  //   action: Action.StreamingPayment,
  // },
  // {
  //   title: MSG.moveFunds,
  //   description: MSG.moveFundsDescription,
  //   action: Action.TransferFunds,
  // },
];

export const MANAGE_DROPDOWN_ITEMS = [
  {
    action: CoreAction.EditDomain,
    title: MSG.manageTeams,
    description: MSG.manageTeamsDescription,
  },
  // @BETA: DISABLED
  // {
  //   action: Action.ManageReputation,
  //   title: MSG.manageReputation,
  //   description: MSG.manageReputationDescription,
  // },
  {
    action: CoreAction.SetUserRoles,
    title: MSG.managePermissions,
    description: MSG.managePermissionsDescription,
  },
  {
    action: CoreAction.ColonyEdit,
    title: MSG.organizationDetails,
    description: MSG.organizationDetailsDescription,
  },
];
