import React, { useMemo } from 'react';

import { useAppContext } from '~hooks';

import { Flow } from './types';
import { displayName } from './consts';
import { createWizard } from './helpers';

interface Props {
  flow: Flow;
  inviteCode?: string;
}

const Onboarding = ({ flow, inviteCode }: Props) => {
  const { user } = useAppContext();

  const Wizard = useMemo(
    () => createWizard(user, flow, inviteCode),
    // If the user is created as part of this flow this should not be re rendered
    // Fix this in future
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flow, inviteCode],
  );

  return (
    // FIX: factor in WizardcontextProvider (into withWizard)
    <Wizard inviteCode={inviteCode} />
  );
};

Onboarding.displayName = displayName;

export default Onboarding;
