import React from 'react';
import { Navigate } from 'react-router-dom';

import { WizardOuterProps } from '~shared/Wizard/types';

import { FormValues } from '~v5/common/CreateColonyWizard/CreateColonyWizard';
import { LANDING_PAGE_ROUTE } from '~routes/index';
import { useAppContext } from '~hooks';

const displayName = 'frame.WizardTemplateColony';

type Props = Pick<WizardOuterProps<FormValues>, 'children'>;

const WizardTemplateColony = ({ children }: Props) => {
  const { wallet, walletConnecting } = useAppContext();

  if (!wallet && !walletConnecting) {
    return <Navigate to={LANDING_PAGE_ROUTE} replace />;
  }

  return (
    <main className="flex flex-col items-center">
      <article className="max-w-md">{children}</article>
    </main>
  );
};

WizardTemplateColony.displayName = displayName;

export default WizardTemplateColony;
