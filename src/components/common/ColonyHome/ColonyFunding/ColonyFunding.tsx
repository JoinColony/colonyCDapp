import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

// import { SpinnerLoader } from '~shared/Preloaders';
import Heading from '~shared/Heading';
// import InfoPopover from '~shared/InfoPopover';
import NavLink from '~shared/NavLink';
// import { Colony, useTokenBalancesForDomainsQuery } from '~data/index';
import { FullColony, FullColonyTokens } from '~gql';

import TokenItem from './TokenItem';

import styles from './ColonyFunding.css';

const displayName = 'common.ColonyHome.ColonyFunding';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Available funds',
  },
});

interface Props {
  colony: FullColony;
  // currentDomainId: number;
}

const ColonyFunding = ({
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
        {(tokens?.items as FullColonyTokens[]).map(({ token }) => (
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

ColonyFunding.displayName = displayName;

export default ColonyFunding;
