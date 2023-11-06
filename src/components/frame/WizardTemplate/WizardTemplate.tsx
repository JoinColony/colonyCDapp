import React from 'react';
import { Navigate } from 'react-router-dom';

import { WizardOuterProps } from '~shared/Wizard/types';

import { FormValues } from '~v5/common/CreateColonyWizard/CreateColonyWizard';
import { LANDING_PAGE_ROUTE } from '~routes/index';
import { useAppContext } from '~hooks';

const displayName = 'frame.WizardTemplate';

type Props = Pick<WizardOuterProps<FormValues>, 'children'>;

const WizardTemplate = ({ children }: Props) => {
  const { wallet, walletConnecting } = useAppContext();

  if (!wallet && !walletConnecting) {
    return <Navigate to={LANDING_PAGE_ROUTE} replace />;
  }

  return <article className="mx-auto max-w-[33.125rem]">{children}</article>;
};

WizardTemplate.displayName = displayName;

export default WizardTemplate;
