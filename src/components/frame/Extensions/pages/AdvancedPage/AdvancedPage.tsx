import { CheckCircle, WarningCircle } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext.tsx';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/hooks.ts';
// @BETA: Disabled for now
// import Button from '~v5/shared/Button';
// import Link from '~v5/shared/Link';
import useColonyContractVersion from '~hooks/useColonyContractVersion.ts';
// import { useMobile } from '~hooks';
import { canColonyBeUpgraded } from '~utils/checks/index.ts';
import { formatText } from '~utils/intl.ts';
import ColonyVersionWidget from '~v5/shared/ColonyVersionWidget/index.tsx';
import NotificationBanner from '~v5/shared/NotificationBanner/index.ts';

const displayName = 'frame.Extensions.pages.AdvancedPage';

const AdvancedPage: FC = () => {
  const {
    colony: { version },
    colony,
  } = useColonyContext();
  const { colonyContractVersion } = useColonyContractVersion();
  // @BETA: Disabled for now
  // const isMobile = useMobile();

  useSetPageHeadingTitle(formatText({ id: 'advancedPage.title' }));

  const canUpgrade = canColonyBeUpgraded(colony, colonyContractVersion);

  return (
    <div>
      <h3 className="heading-4 mb-6">
        <FormattedMessage id="advancedPage.colony.title" />
      </h3>
      <div className="mb-4">
        {canUpgrade ? (
          <NotificationBanner icon={WarningCircle} status="warning">
            <FormattedMessage id="advancedPage.version.warning" />
          </NotificationBanner>
        ) : (
          <NotificationBanner icon={CheckCircle} status="success">
            <FormattedMessage id="advancedPage.version.success" />
          </NotificationBanner>
        )}
      </div>
      <ColonyVersionWidget
        currentVersion={version}
        latestVersion={colonyContractVersion}
        status={canUpgrade ? 'error' : 'success'}
      />
      {/* @BETA: Recovery logic not implemented yet */}
      {/* <div className="divider my-6" /> */}
      {/* <h3 className="heading-4 mb-6"> */}
      {/*   <FormattedMessage id="advancedPage.recovery.title" /> */}
      {/* </h3> */}
      {/* <p className="text-md text-gray-600 mb-6"> */}
      {/*   <FormattedMessage id="advancedPage.recovery.description" /> */}
      {/* </p> */}
      {/* <div className="mb-6"> */}
      {/*   <NotificationBanner */}
      {/*     status="info" */}
      {/*     callToAction={ */}
      {/*       <Link */}
      {/*         to="https://colony.io/colonyjs/docs/colonyjs-core/#recovery-mode" */}
      {/*         className="underline md:hover:no-underline" */}
      {/*       > */}
      {/*         <FormattedMessage id="text.learnMore" /> */}
      {/*       </Link> */}
      {/*     } */}
      {/*   > */}
      {/*     <FormattedMessage id="advancedPage.recovery.notification" /> */}
      {/*   </NotificationBanner> */}
      {/* </div> */}
      {/* <div className="flex justify-end"> */}
      {/*   <Button */}
      {/*     mode="primarySolid" */}
      {/*     text={{ id: 'button.enterRecoveryMode' }} */}
      {/*     isFullSize={isMobile} */}
      {/*   /> */}
      {/* </div> */}
    </div>
  );
};

AdvancedPage.displayName = displayName;

export default AdvancedPage;
