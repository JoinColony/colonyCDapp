import React, { useMemo, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
// import { Redirect, RouteChildrenProps } from 'react-router-dom';
import sortBy from 'lodash/sortBy';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
// import { Form, Select } from '~core/Fields';
// import Heading from '~core/Heading';
// import LoadingTemplate from '~pages/LoadingTemplate';
// import ColonyFundingBanner from '~dashboard/ColonyFundingBanner';
// import ColonyFundingMenu from '~dashboard/ColonyFundingMenu';
// import TokenCardList from '~dashboard/TokenCardList';
// import { useColonyFromNameQuery } from '~data/index';
import Heading from '~shared/Heading';

import styles from './ColonyFunding.css';

const displayName = 'common.ColonyFunding';

const MSG = defineMessages({
  labelSelectDomain: {
    id: `${displayName}.labelSelectDomain`,
    defaultMessage: 'Select a domain',
  },
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Funds',
  },
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Loading Colony',
  },
});

const ColonyFunding = () => {
  const { formatMessage } = useIntl();

  const [selectedDomainId, setSelectedDomainId] = useState<number>(
    COLONY_TOTAL_BALANCE_DOMAIN_ID,
  );

  // const domainChoices = useMemo<
  //   ComponentProps<typeof Select>['options']
  // >(() => {
  //   if (!data || !data.processedColony) {
  //     return [];
  //   }
  //   const {
  //     processedColony: { domains },
  //   } = data;
  //   return [
  //     {
  //       value: COLONY_TOTAL_BALANCE_DOMAIN_ID.toString(),
  //       label: { id: 'domain.all' },
  //     },
  //     ...sortBy(
  //       domains.map(({ ethDomainId, name }) => ({
  //         label: name,
  //         value: ethDomainId.toString(),
  //       })),
  //       ['value'],
  //     ),
  //   ];
  // }, [data]);

  const selectedDomainLabel = 'Dummy Domain Label';
  // const selectedDomainLabel: string = useMemo(() => {
  //   const { label = '' } =
  //     domainChoices.find(
  //       ({ value }) => value === selectedDomainId.toString(),
  //     ) || {};
  //   return typeof label === 'string' ? label : formatMessage(label);
  // }, [domainChoices, formatMessage, selectedDomainId]);

  // if (
  //   loading ||
  //   (data?.colonyAddress &&
  //     !data.processedColony &&
  //     !((data.colonyAddress as any) instanceof Error))
  // ) {
  //   return (
  //     <div className={styles.loadingWrapper}>
  //       <LoadingTemplate loadingText={MSG.loadingText} />
  //     </div>
  //   );
  // }

  // if (!colonyName || error || !data?.processedColony) {
  //   console.error(error);
  //   return <NotFoundRoute />;
  // }

  // const { processedColony: colony } = data;

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <div>
          <div className={styles.titleContainer}>
            <Heading
              text={MSG.title}
              textValues={{ selectedDomainLabel }}
              appearance={{ size: 'medium', theme: 'dark' }}
            />
            {/* <Form
              initialValues={{
                selectDomain: COLONY_TOTAL_BALANCE_DOMAIN_ID.toString(),
              }}
              onSubmit={() => {}}
            >
              <Select
                appearance={{
                  alignOptions: 'right',
                  width: 'content',
                  theme: 'alt',
                }}
                elementOnly
                label={MSG.labelSelectDomain}
                name="selectDomain"
                onChange={(value) => setSelectedDomainId(Number(value))}
                options={domainChoices}
              />
            </Form> */}
          </div>
          {/* <TokenCardList
            appearance={{ numCols: '3' }}
            nativeTokenAddress={colony.nativeTokenAddress}
            tokens={colony.tokens}
            nativeTokenLocked={colony.isNativeTokenLocked}
            domainId={selectedDomainId}
          /> */}
        </div>
        {/* <div className={styles.banner}>
          <ColonyFundingBanner colonyAddress={colony.colonyAddress} />
        </div> */}
      </div>
      {/* <aside className={styles.aside}>
        <ColonyFundingMenu
          selectedDomainId={selectedDomainId}
          colony={colony}
        />
      </aside> */}
    </div>
  );
};

ColonyFunding.displayName = displayName;

export default ColonyFunding;
