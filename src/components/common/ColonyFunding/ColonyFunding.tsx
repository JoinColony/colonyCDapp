import React, { useState } from 'react';
import { defineMessages } from 'react-intl';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { Form, Select } from '~shared/Fields';
import Heading from '~shared/Heading';
import ColonyFundingBanner from '~common/ColonyFundingBanner';
import ColonyFundingMenu from '~common/ColonyFundingMenu';
import TokenCardList from '~common/TokenCardList';
import UnclaimedTransfers from '~common/UnclaimedTransfers';
import ColonyHomeInfo from '~common/ColonyHome/ColonyHomeInfo';
import ColonyDomainSelector from '~common/ColonyHome/ColonyDomainSelector';
import { useColonyContext, useMobile } from '~hooks';
import { formatText } from '~utils/intl';
import { notNull } from '~utils/arrays';

import styles from './ColonyFunding.css';

const MSG = defineMessages({
  labelSelectDomain: {
    id: 'dashboard.ColonyFunding.labelSelectDomain',
    defaultMessage: 'Select a domain',
  },
  title: {
    id: 'dashboard.ColonyFunding.title',
    defaultMessage: 'Funds',
  },
  loadingText: {
    id: 'dashboard.ColonyFunding.loadingText',
    defaultMessage: 'Loading Colony',
  },
});

const componentDisplayName = 'dashboard.ColonyFunding';

const ColonyFunding = () => {
  const isMobile = useMobile();
  const { colony } = useColonyContext();
  const { domains, tokens } = colony || {};

  const [selectedDomainId, setSelectedDomainId] = useState<number>(
    COLONY_TOTAL_BALANCE_DOMAIN_ID,
  );

  const domainChoices = [
    {
      value: COLONY_TOTAL_BALANCE_DOMAIN_ID.toString(),
      label: { id: 'domain.all' },
    },
    ...(domains?.items ?? [])
      .map((domain) => ({
        label: domain?.metadata?.name ?? '',
        value: domain?.nativeId.toString() ?? '',
      }))
      .sort(
        (first, second) =>
          parseInt(first.value, 10) - parseInt(second.value, 10),
      ),
  ];

  const { label: selectedDomainLabel = '' } =
    domainChoices.find(({ value }) => value === selectedDomainId.toString()) ||
    {};

  // eslint-disable-next-line react/no-unstable-nested-components
  const Aside = () => (
    <aside className={styles.aside}>
      <ColonyFundingMenu />
    </aside>
  );

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <div>
          {isMobile && <ColonyHomeInfo showNavigation isMobile />}
          <div className={styles.titleContainer}>
            <Heading
              text={MSG.title}
              textValues={{
                selectedDomainLabel: formatText(selectedDomainLabel),
              }}
              appearance={{ size: 'medium', theme: 'dark' }}
            />
            {isMobile ? (
              <ColonyDomainSelector
                filteredDomainId={selectedDomainId}
                onDomainChange={setSelectedDomainId}
              />
            ) : (
              <Form
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
              </Form>
            )}
          </div>
          <UnclaimedTransfers />
          <TokenCardList
            appearance={{ numCols: '3' }}
            tokens={
              tokens?.items.filter(notNull).map((token) => token.token) ?? []
            }
            domainId={selectedDomainId}
          />
        </div>
        {isMobile && <Aside />}
        <div className={styles.banner}>
          <ColonyFundingBanner />
        </div>
      </div>
      {!isMobile && <Aside />}
    </div>
  );
};

ColonyFunding.displayName = componentDisplayName;

export default ColonyFunding;
