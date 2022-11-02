import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

// import { SpinnerLoader } from '~shared/Preloaders';
import Heading from '~shared/Heading';
// import InfoPopover from '~shared/InfoPopover';
import NavLink from '~shared/NavLink';
// import { Colony, useTokenBalancesForDomainsQuery } from '~data/index';
import { Colony, ColonyTokens } from '~types';

import TokenItem from './TokenItem';

import styles from './ColonyFundingWidget.css';

const displayName = 'common.ColonyHome.ColonyFundingWidget';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Available funds',
  },
});

interface Props {
  colony: Colony;
  // currentDomainId: number;
}

const ColonyFundingWidget = ({
  // currentDomainId,
  colony: {
    name,
    tokens,
    nativeToken: { tokenAddress: nativeTokenAddress },
    status,
  },
}: Props) => {
  // const {
  //   data,
  //   loading: isLoadingTokenBalances,
  // } = useTokenBalancesForDomainsQuery({
  //   variables: {
  //     colonyAddress,
  //     domainIds: [currentDomainId],
  //     tokenAddresses: colonyTokens.map(({ address }) => address),
  //   },
  //   fetchPolicy: 'network-only',
  // });

  return (
    <div className={styles.main}>
      <Heading appearance={{ size: 'normal', weight: 'bold' }}>
        <NavLink to={`/colony/${name}/funds`}>
          <FormattedMessage {...MSG.title} />
        </NavLink>
      </Heading>
      {/* {data && !isLoadingTokenBalances ? ( */}
      <ul data-test="availableFunds">
        {(tokens?.items as ColonyTokens[]).map(({ token }) => (
          <li key={token.tokenAddress}>
            {/* <InfoPopover
              token={token}
              isTokenNative={token.tokenAddress === nativeTokenAddress}
            > */}
            <div className={styles.tokenBalance}>
              <TokenItem
                // currentDomainId={currentDomainId}
                token={token}
                isTokenNative={token.tokenAddress === nativeTokenAddress}
                isNativeTokenLocked={!status?.nativeToken?.unlocked}
              />
            </div>
            {/* </InfoPopover> */}
          </li>
        ))}
      </ul>
      {/* ) : (
        <SpinnerLoader />
      )} */}
    </div>
  );
};

ColonyFundingWidget.displayName = displayName;

export default ColonyFundingWidget;
