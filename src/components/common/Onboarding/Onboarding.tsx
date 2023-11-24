import React from 'react';
import { defineMessages } from 'react-intl';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '~hooks';
import { LANDING_PAGE_ROUTE } from '~routes';
import withWizard, { StepType } from '~shared/Wizard/withWizard';

import { WizardType } from './types';
import WizardTemplate, { TemplateProps } from './WizardTemplate';

import StepCreateUser, {
  CreateUserFormValues,
} from './wizardSteps/StepCreateUser';
import StepRedirect from './wizardSteps/StepRedirect';

const stepsCreateUser: StepType[] = [StepCreateUser, StepRedirect];

const initialValuesCreateUser: CreateUserFormValues = {
  username: '',
  emailAddress: '',
};

const displayName = 'common.Onboarding';


// FIXME: move this somewhere else?
export const wizardSidebarMSGs = defineMessages({
  sidebarTitle: {
    id: `${displayName}.sidebarTitle`,
    defaultMessage:
      'Create your new {isCreatingColony, select, true {Colony} other {profile}}',
  },
  account: {
    id: `${displayName}.account`,
    defaultMessage: 'Account',
  },
  profile: {
    id: `${displayName}.profile`,
    defaultMessage: 'Profile',
  },
  create: {
    id: `${displayName}.create`,
    defaultMessage: 'Create',
  },
  details: {
    id: `${displayName}.details`,
    defaultMessage: 'Details',
  },
  nativeToken: {
    id: `${displayName}.nativeToken`,
    defaultMessage: 'Native Token',
  },
  confirmation: {
    id: `${displayName}.confirmation`,
    defaultMessage: 'Confirmation',
  },
  complete: {
    id: `${displayName}.complete`,
    defaultMessage: 'Complete',
  },
});

export const sidebarValues = [
  {
    id: 0,
    text: wizardSidebarMSGs.account,
    subItems: [
      {
        id: 0,
        text: wizardSidebarMSGs.profile,
      },
    ],
  },
];

const createWizard = (
  initialValues: Record<string, any>,
  steps: StepType[],
  templateProps?: TemplateProps,
) =>
  withWizard({
    initialValues: initialValuesCreateUser,
    steps: stepsCreateUser,
    templateProps: { sidebarValues, wizardType: WizardType.CreateUser },
  })(WizardTemplate);

const Onboarding = () => {
  const { user, userLoading, wallet, walletConnecting } = useAppContext();

  if (walletConnecting || userLoading) {
    // FIXME: add loading spinner
    return null;
  }

  if (!wallet) {
    // FIXME: navigate to splash
    return null;
  }

  const CreateUserWizard = createWizard(
    initialValuesCreateUser,
    stepsCreateUser,
    { sidebarValues, wizardType: WizardType.CreateUser },
  );

  return (
    // FIXME: factor in WizardcontextProvider (into withWizard)
    <CreateUserWizard />
  );
};

Onboarding.displayName = displayName;

export default Onboarding;
