import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { DialogProps, ActionDialogProps } from '~shared/Dialog';
import IndexModal from '~shared/IndexModal';

import {
  WizardDialogType,
  useAppContext,
  useUserAccountRegistered,
} from '~hooks';
import { getAllUserRoles } from '~transformers';
import { canAdminister, canFund } from '~utils/checks';

const displayName = 'common.ManageExpenditureDialog';

const MSG = defineMessages({
  dialogHeader: {
    id: `${displayName}.dialogHeader`,
    defaultMessage: 'Create Expenditure',
  },
  paymentTitle: {
    id: `${displayName}.paymentTitle`,
    defaultMessage: 'Payment',
  },
  paymentDescription: {
    id: `${displayName}.paymentDescription`,
    defaultMessage: 'A quick and simple payment for something already done.',
  },
  paymentPermissionsText: {
    id: `${displayName}.paymentPermissionsText`,
    defaultMessage: `You must have the {permissionsList} permissions in the
      relevant teams, in order to take this action`,
  },
  noOneTxExtension: {
    id: `${displayName}.noOneTxExtension`,
    defaultMessage: `The OneTxPayment extension is not installed in this colony.
    Please use the Extensions Manager to install it if you want to make a new
    payment.`,
  },
  paymentPermissionsList: {
    id: `${displayName}.paymentPermissionsList`,
    defaultMessage: 'administration and funding',
  },
  taskTitle: {
    id: `${displayName}.taskTitle`,
    defaultMessage: 'Streaming',
  },
  taskDescription: {
    id: `${displayName}.taskDescription`,
    defaultMessage: 'Commission some work and who will manage its delivery.',
  },
  recurringTitle: {
    id: `${displayName}.recurringTitle`,
    defaultMessage: 'Streaming',
  },
  recurringDescription: {
    id: `${displayName}.recurringDescription`,
    defaultMessage: 'For regular payments like salaries.',
  },
});

interface CustomWizardDialogProps extends ActionDialogProps {
  nextStep: string;
  prevStep: string;
}

type Props = DialogProps & WizardDialogType<object> & CustomWizardDialogProps;

const ManageExpenditureDialog = ({
  cancel,
  close,
  callStep,
  prevStep,
  colony,
  nextStep,
  enabledExtensionData,
}: Props) => {
  const { wallet } = useAppContext();
  const { isVotingReputationEnabled, isOneTxPaymentEnabled } =
    enabledExtensionData;

  const userHasAccountRegistered = useUserAccountRegistered();

  const allUserRoles = getAllUserRoles(colony, wallet?.address || '');

  const canCreatePayment =
    userHasAccountRegistered &&
    ((canAdminister(allUserRoles) && canFund(allUserRoles)) ||
      isVotingReputationEnabled);

  const items = [
    {
      title: MSG.paymentTitle,
      description: MSG.paymentDescription,
      icon: 'emoji-dollar-stack',
      permissionRequired: !canCreatePayment || !isOneTxPaymentEnabled,
      permissionInfoText: !canCreatePayment
        ? MSG.paymentPermissionsText
        : MSG.noOneTxExtension,
      permissionInfoTextValues: {
        permissionsList: <FormattedMessage {...MSG.paymentPermissionsList} />,
      },
      onClick: () => callStep(nextStep),
      dataTest: 'paymentDialogIndexItem',
    },
    {
      title: MSG.taskTitle,
      description: MSG.taskDescription,
      icon: 'emoji-superman',
      comingSoon: true,
    },
    {
      title: MSG.recurringTitle,
      description: MSG.recurringDescription,
      icon: 'emoji-calendar',
      comingSoon: true,
    },
  ];
  return (
    <IndexModal
      cancel={cancel}
      close={close}
      title={MSG.dialogHeader}
      items={items}
      back={() => callStep(prevStep)}
    />
  );
};

ManageExpenditureDialog.displayName = displayName;

export default ManageExpenditureDialog;
