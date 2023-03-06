import React, { ComponentProps, useMemo, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { Form, Select } from '~shared/Fields';
import Heading from '~shared/Heading';
import ColonyFundingBanner from '~common/ColonyFundingBanner';
import ColonyFundingMenu from '~common/ColonyFundingMenu';
import TokenCardList from '~common/TokenCardList';
import UnclaimedTransfers from '~common/UnclaimedTransfers';
import ColonyHomeInfo from '~common/ColonyHome/ColonyHomeInfo';
import ColonyDomainSelector from '~common/ColonyHome/ColonyDomainSelector';
// import { useColonyFromNameQuery } from '~data/index';
import { useColonyContext, useMobile } from '~hooks';
import { ColonyTokens } from '~gql';

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
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { colony } = useColonyContext();
  const { domains, tokens } = colony || {};

  const [selectedDomainId, setSelectedDomainId] = useState<number>(
    COLONY_TOTAL_BALANCE_DOMAIN_ID,
  );

  const domainChoices = useMemo<
    ComponentProps<typeof Select>['options']
  >(() => {
    if (!domains?.items) {
      return [];
    }
    return [
      {
        value: COLONY_TOTAL_BALANCE_DOMAIN_ID.toString(),
        label: { id: 'domain.all' },
      },
      ...(domains?.items ?? [])
        .map((domain) => ({
          label: domain?.name ?? '',
          value: domain?.nativeId.toString() ?? '',
        }))
        .sort(
          (first, second) =>
            parseInt(first.value, 10) - parseInt(second.value, 10),
        ),
    ];
  }, [domains]);

  const selectedDomainLabel: string = useMemo(() => {
    const { label = '' } =
      domainChoices.find(
        ({ value }) => value === selectedDomainId.toString(),
      ) || {};
    return typeof label === 'string' ? label : formatMessage(label);
  }, [domainChoices, formatMessage, selectedDomainId]);

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
              textValues={{ selectedDomainLabel }}
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
            tokens={tokens?.items as unknown as ColonyTokens[]}
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
