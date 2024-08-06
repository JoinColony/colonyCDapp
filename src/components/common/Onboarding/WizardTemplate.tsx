import React, { type PropsWithChildren } from 'react';
import { defineMessages } from 'react-intl';

import { MainLayout } from '~frame/Extensions/layouts/index.ts';
import { type WizardOuterProps } from '~shared/Wizard/types.ts';

import { type WizardType } from './types.ts';
import WizardSidebar, {
  type WizardSidebarStep,
} from './WizardSidebar/index.ts';

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
    >
      <article className="mx-auto max-w-lg">{children}</article>
    </MainLayout>
  );
};

WizardTemplate.displayName = displayName;

export default WizardTemplate;
