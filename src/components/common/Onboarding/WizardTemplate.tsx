import React, { PropsWithChildren } from 'react';
import { defineMessages } from 'react-intl';

import { MainLayout } from '~frame/Extensions/layouts';
import { WizardOuterProps } from '~shared/Wizard/types';

import { WizardType } from './types';
import WizardSidebar, { WizardSidebarStep } from './WizardSidebar';

const displayName = 'frame.WizardTemplate';

const MSG = defineMessages({
  sidebarTitle: {
    id: `${displayName}.sidebarTitle`,
    defaultMessage:
      'Create your new {wizardType, select, CREATE_USER {profile} other {Colony}}',
  },
});

export interface TemplateProps {
  sidebarValues: WizardSidebarStep[];
  wizardType: WizardType;
}

type Props<F extends Record<string, any>> = WizardOuterProps<F, TemplateProps>;

const WizardTemplate = <F extends Record<string, any>>({
  children,
  step,
  templateProps: { sidebarValues, wizardType },
}: PropsWithChildren<Props<F>>) => {
  return (
    <MainLayout
      sidebar={
        <WizardSidebar
          currentStep={step}
          wizardSteps={sidebarValues}
          sidebarTitle={MSG.sidebarTitle}
          sidebarTitleValues={{ wizardType }}
        />
      }
      hasWideSidebar
    >
      <article className="mx-auto max-w-lg">{children}</article>
    </MainLayout>
  );
};

WizardTemplate.displayName = displayName;

export default WizardTemplate;
