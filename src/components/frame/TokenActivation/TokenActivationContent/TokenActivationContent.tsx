import React, { useState, Dispatch, SetStateAction } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { BigNumber } from 'ethers';

import { Tab, Tabs, TabList, TabPanel } from '~shared/Tabs';
// import { useClaimableStakedMotionsQuery } from '~data/generated';
// import { useAppContext, useColonyContext } from '~hooks';

import TokensTab, { TokensTabProps } from '../TokensTab';
import StakesTab from '../StakesTab';

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

const TokenActivationContent = ({ setIsPopoverOpen, ...otherProps }: TokenActivationContentProps) => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  // const { colony } = useColonyContext();
  // const { wallet } = useAppContext();

  // const { data: unclaimedMotions, loading } = useClaimableStakedMotionsQuery({
  //   variables: {
  //     colonyAddress: colony?.colonyAddress.toLowerCase() || '',
  //     walletAddress: walletAddress?.toLowerCase(),
  //   },
  //   fetchPolicy: 'network-only',
  // });

  const loading = false;

  // const claimsCount = unclaimedMotions?.claimableStakedMotions
  //   ? unclaimedMotions?.claimableStakedMotions?.unclaimedMotionStakeEvents
  //       .length
  //   : 0;
  const claimsCount = 0;

  const unclaimedMotionStakeEvents = [
    {
      address: '0x0000000',
      blockNumber: 1234,
      hash: '0x0000000',
      index: '1',
      name: 'test',
      signature: 'test',
      timestamp: 1234567890,
      topic: 'test topic',
      values: {
        amount: '10',
        motionId: '0x0000012',
        stakeAmount: BigNumber.from(10 ** 15).toString(),
        staker: '0x0000000',
        vote: 123,
      },
    },
  ];

  return (
    <div className={styles.main}>
      <Tabs
        selectedIndex={tabIndex}
        onSelect={(newIndex) => {
          setTabIndex(newIndex);
        }}
      >
        <TabList className={styles.tabsList} containerClassName={styles.tabsListContainer}>
          <Tab selectedClassName={styles.tabSelected} className={styles.tab} data-test="yourTokensTab">
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
          <TokensTab {...otherProps} />
        </TabPanel>
        <TabPanel className={styles.tabContainer}>
          <StakesTab
            {...otherProps}
            unclaimedMotionStakeEvents={unclaimedMotionStakeEvents}
            isLoadingMotions={loading}
            setIsPopoverOpen={setIsPopoverOpen}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default TokenActivationContent;
