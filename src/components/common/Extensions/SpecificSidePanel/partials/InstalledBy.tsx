import React, { FC } from 'react';

import { useColonyContext, useContributorBreakdown } from '~hooks';
import styles from '../SpecificSidePanel.module.css';
import { PanelTypeProps } from '../types';
import { InstalledExtensionData } from '~types';
import { splitWalletAddress } from '~utils/splitWalletAddress';
import UserAvatarPopover from '~v5/shared/UserAvatarPopover';
import { useGetColonyContributorQuery } from '~gql';
import { getColonyContributorId } from '~utils/members';

const displayName = 'common.Extensions.partials.InstalledBy';

const InstalledBy: FC<PanelTypeProps> = ({ title, extensionData }) => {
  const { colony } = useColonyContext();
  const { colonyAddress = '' } = colony || {};
  const installedBy = (extensionData as InstalledExtensionData)?.installedBy;

  const { data } = useGetColonyContributorQuery({
    variables: {
      id: getColonyContributorId(colonyAddress, installedBy),
      colonyAddress,
    },
  });

  const contributor = data?.getColonyContributor;
  const { user, isVerified } = contributor ?? {};
  const { displayName: userDisplayName } = user?.profile || {};

  const domains = useContributorBreakdown(contributor);
  const splitAddress = splitWalletAddress(user?.walletAddress || '');

  return (
    <div className={styles.panelRow}>
      <div className={styles.panelTitle}>{title}</div>
      <div className="flex">
        <UserAvatarPopover
          userName={userDisplayName ?? splitAddress}
          walletAddress={splitAddress}
          domains={domains}
          user={user}
          isVerified={isVerified}
        />
      </div>
    </div>
  );
};

InstalledBy.displayName = displayName;

export default InstalledBy;
