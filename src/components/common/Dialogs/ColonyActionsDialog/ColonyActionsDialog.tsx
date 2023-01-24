import React from 'react';
import { defineMessages } from 'react-intl';

import { DialogProps } from '~shared/Dialog';
import IndexModal from '~shared/IndexModal';

import { WizardDialogType } from '~hooks';

const displayName = 'common.ColonyHome.ColonyActionsDialog';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'What would you like to do?',
  },
  manageExpenditure: {
    id: `${displayName}.manageExpenditure`,
    defaultMessage: 'Manage Expenditure',
  },
  manageExpenditureDesc: {
    id: `${displayName}.manageExpenditureDesc`,
    defaultMessage: 'Send funds from this colony to external addresses.',
  },
  manageFunds: {
    id: `${displayName}.manageFunds`,
    defaultMessage: 'Manage Funds',
  },
  manageFundsDesc: {
    id: `${displayName}.manageFundsDesc`,
    defaultMessage: 'The tools you need to manage your colony’s money.',
  },
  manageDomains: {
    id: `${displayName}.manageDomains`,
    defaultMessage: 'Manage Teams',
  },
  manageDomainsDesc: {
    id: `${displayName}.manageDomainsDesc`,
    defaultMessage: 'Need more structure? Need to change a team name?',
  },
  manageReputation: {
    id: `${displayName}.manageReputation`,
    defaultMessage: 'Manage Reputation',
  },
  manageReputationDesc: {
    id: `${displayName}.manageReputationDesc`,
    defaultMessage: 'Award the worthy; Smite the unworthy.',
  },
  advanced: {
    id: `${displayName}.advanced`,
    defaultMessage: 'Advanced',
  },
  advancedDesc: {
    id: `${displayName}.advancedDesc`,
    defaultMessage:
      'Need to tinker under the hood? This is the place to do it.',
  },
});

interface CustomWizardDialogProps {
  nextStepManageExpenditure: string;
  nextStepManageFunds: string;
  nextStepManageDomains: string;
  nextStepAdvanced: string;
  nextStepManageReputation: string;
}

type Props = DialogProps & WizardDialogType<object> & CustomWizardDialogProps;

const ColonyActionsDialog = ({
  cancel,
  close,
  callStep,
  nextStepManageExpenditure,
  nextStepManageFunds,
  nextStepManageDomains,
  nextStepAdvanced,
  nextStepManageReputation,
}: Props) => {
  const items = [
    {
      title: MSG.manageExpenditure,
      description: MSG.manageExpenditureDesc,
      icon: 'emoji-bag-money-sign',
      onClick: () => callStep(nextStepManageExpenditure),
      dataTest: 'expenditureDialogIndexItem',
    },
    {
      title: MSG.manageFunds,
      description: MSG.manageFundsDesc,
      icon: 'emoji-money-wings',
      onClick: () => callStep(nextStepManageFunds),
      dataTest: 'fundsDialogIndexItem',
    },
    {
      title: MSG.manageDomains,
      description: MSG.manageDomainsDesc,
      icon: 'emoji-crane',
      onClick: () => callStep(nextStepManageDomains),
      dataTest: 'domainsDialogIndexItem',
    },
    {
      title: MSG.manageReputation,
      description: MSG.manageReputationDesc,
      icon: 'emoji-firebolt',
      onClick: () => callStep(nextStepManageReputation),
      dataTest: 'reputationDialogIndexItem',
    },
    {
      title: MSG.advanced,
      description: MSG.advancedDesc,
      icon: 'emoji-smiley-nerd',
      onClick: () => callStep(nextStepAdvanced),
      dataTest: 'advancedDialogIndexItem',
    },
  ];
  return (
    <IndexModal cancel={cancel} close={close} title={MSG.title} items={items} />
  );
};

ColonyActionsDialog.displayName = displayName;

export default ColonyActionsDialog;
