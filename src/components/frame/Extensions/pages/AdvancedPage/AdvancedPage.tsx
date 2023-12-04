import React, { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { useSetPageHeadingTitle } from '~context/PageHeadingContext/hooks';
import {
  useColonyContext,
  useColonyContractVersion,
  // @BETA: Disabled for now
  // useMobile
} from '~hooks';
// @BETA: Disabled for now
// import Button from '~v5/shared/Button';
// import Link from '~v5/shared/Link';
import { canColonyBeUpgraded } from '~utils/checks';
import { formatText } from '~utils/intl';
import ColonyVersionWidget from '~v5/shared/ColonyVersionWidget';
import NotificationBanner from '~v5/shared/NotificationBanner';

const displayName = 'frame.Extensions.pages.AdvancedPage';

const AdvancedPage: FC = () => {
  const { colony } = useColonyContext();
  const { version } = colony || {};
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
          <NotificationBanner icon="warning-circle" status="warning">
            <FormattedMessage id="advancedPage.version.warning" />
          </NotificationBanner>
        ) : (
          <NotificationBanner icon="check-circle" status="success">
            <FormattedMessage id="advancedPage.version.success" />
          </NotificationBanner>
        )}
      </div>
      <ColonyVersionWidget
        currentVersion={colonyContractVersion}
        lastVersion={version || 0}
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
