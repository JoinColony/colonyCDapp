import React, { type PropsWithChildren } from 'react';
import { defineMessages } from 'react-intl';

import { UserNavigationWrapper } from '~frame/Extensions/layouts/index.ts';
import { useMobile } from '~hooks';
import { type WizardOuterProps } from '~shared/Wizard/types.ts';
import PageLayout from '~v5/frame/PageLayout/PageLayout.tsx';
import PageHeader from '~v5/frame/PageLayout/partials/PageHeader/PageHeader.tsx';

import { type WizardType } from './types.ts';
import DesktopWizardSidebar from './Wizard/DesktopWizardSidebar.tsx';
import MobileWizardHeader from './Wizard/MobileWizardHeader.tsx';
import { type WizardStep } from './Wizard/types.ts';

const displayName = 'common.Onboarding.WizardTemplate';

const MSG = defineMessages({
  sidebarTitle: {
    id: `${displayName}.sidebarTitle`,
    defaultMessage:
      'Create your new {wizardType, select, CREATE_USER {profile} other {Colony}}',
  },
});

export interface TemplateProps {
  sidebarValues: WizardStep[];
  wizardType: WizardType;
}

type Props<F extends Record<string, any>> = WizardOuterProps<F, TemplateProps>;

const WizardTemplate = <F extends Record<string, any>>({
  children,
  step,
  templateProps: { sidebarValues, wizardType },
}: PropsWithChildren<Props<F>>) => {
  const isMobile = useMobile();

  return (
    <PageLayout
      enableMobileAndDesktopLayoutBreakpoints
      sidebar={
        !isMobile && (
          <DesktopWizardSidebar
            currentStep={step}
            wizardSteps={sidebarValues}
            sidebarTitle={MSG.sidebarTitle}
            sidebarTitleValues={{ wizardType }}
            enableMobileAndDesktopLayoutBreakpoints
          />
        )
      }
      header={
        <div className="mb-6">
          {isMobile ? (
            <PageHeader userNavigation={<UserNavigationWrapper />} />
          ) : (
            <UserNavigationWrapper />
          )}
          {isMobile && (
            <MobileWizardHeader
              currentStep={step}
              wizardSteps={sidebarValues}
              sidebarTitle={MSG.sidebarTitle}
              sidebarTitleValues={{ wizardType }}
            />
          )}
        </div>
      }
    >
      <article className="mx-auto max-w-lg">{children}</article>
    </PageLayout>
  );
};

WizardTemplate.displayName = displayName;

export default WizardTemplate;
