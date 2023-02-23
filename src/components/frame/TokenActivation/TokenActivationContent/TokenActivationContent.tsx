import React, { useState, Dispatch, SetStateAction } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { Tab, Tabs, TabList, TabPanel } from '~shared/Tabs';
// import { useClaimableStakedMotionsQuery } from '~data/generated';
// import { useAppContext, useColonyContext } from '~hooks';

import TokensTab, { TokensTabProps } from '../TokensTab';
// import StakesTab from '../StakesTab';

import styles from './TokenActivationContent.css';

const displayName = 'frame.TokenActivation.TokenActivationContent';

const MSG = defineMessages({
  yourTokens: {
    id: `${displayName}.yourTokens`,
    defaultMessage: 'Your tokens',
  },
  stakes: {
    id: `${displayName}.stakes`,
    defaultMessage: 'Stakes',
  },
});

interface TokenActivationContentProps extends TokensTabProps {
  setIsPopoverOpen: Dispatch<SetStateAction<boolean>>;
}

const TokenActivationContent = (props: TokenActivationContentProps) => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  // const { colony } = useColonyContext();
  // const { wallet } = useAppContext();
  // const { setIsPopoverOpen } = props;

  // const { data: unclaimedMotions, loading } = useClaimableStakedMotionsQuery({
  //   variables: {
  //     colonyAddress: colony?.colonyAddress.toLowerCase() || '',
  //     walletAddress: walletAddress?.toLowerCase(),
  //   },
  //   fetchPolicy: 'network-only',
  // });
  // const unclaimedMotions = {};
  // const loading = false;

  // const claimsCount = unclaimedMotions?.claimableStakedMotions
  //   ? unclaimedMotions?.claimableStakedMotions?.unclaimedMotionStakeEvents
  //       .length
  //   : 0;
  const claimsCount = 0;

  return (
    <div className={styles.main}>
      <Tabs
        selectedIndex={tabIndex}
        onSelect={(newIndex) => {
          setTabIndex(newIndex);
        }}
      >
        <TabList
          className={styles.tabsList}
          containerClassName={styles.tabsListContainer}
        >
          <Tab
            selectedClassName={styles.tabSelected}
            className={styles.tab}
            data-test="yourTokensTab"
          >
            <FormattedMessage {...MSG.yourTokens} />
          </Tab>
          <Tab selectedClassName={styles.tabSelected} className={styles.tab}>
            <div className={styles.stakesTabTitle} data-test="stakesTab">
              <FormattedMessage {...MSG.stakes} />
              {claimsCount > 0 && (
                <div className={styles.dot}>
                  <span>{claimsCount}</span>
                </div>
              )}
            </div>
          </Tab>
        </TabList>
        <TabPanel className={styles.tabContainer}>
          <TokensTab {...props} />
        </TabPanel>
        <TabPanel className={styles.tabContainer}>
          {/* <StakesTab
            {...props}
            unclaimedMotionStakeEvents={
              unclaimedMotions?.claimableStakedMotions
                ?.unclaimedMotionStakeEvents
            }
            isLoadingMotions={loading}
            setIsPopoverOpen={setIsPopoverOpen}
          /> */}
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default TokenActivationContent;
