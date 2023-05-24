/* eslint-disable max-len */
import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import ExtensionItem from '~common/Extensions/ExtensionItem';
import PageTitle from '~common/Extensions/PageTitle';
import { useExtensionsData, useMobile } from '~hooks';
import { SpinnerLoader } from '~shared/Preloaders';

const displayName = 'common.Pages.MainExtensionPage';

const MainExtensionPage: FC = () => {
  const { loading } = useExtensionsData();
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  if (loading) {
    return (
      <SpinnerLoader
        loadingText={{ id: 'extensionsPage.loading' }}
        appearance={{ theme: 'primary', size: 'massive' }}
      />
    );
  }

  return (
    <div className="mb-6">
      {/* @TODO: Add sidepanel */}
      {isMobile && <div>Sidepanel</div>}
      <div className="mt-9 sm:mt-6">
        <PageTitle
          title={formatMessage({ id: 'extensionsPage.title' })}
          subtitle={formatMessage({ id: 'extensionsPage.description' })}
        />
      </div>
      <div className="flex lg:gap-[6.25rem] md:gap-12 mt-9">
        {/* @TODO: Add sidepanel */}
        {!isMobile && <div>Sidepanel</div>}
        <div>
          <h4 className="text-xl font-semibold mb-6">{formatMessage({ id: 'extensionsPage.availableExtensions' })}</h4>
          <h5 className="text-md font-semibold mb-4">{formatMessage({ id: 'extensionsPage.payments' })}</h5>
          <ul className="pb-6 border-b border-gray-100">
            <li className="mb-6">
              <ExtensionItem
                title="One Transaction Payment"
                description="Make quick and simple payments to members or any address on the same network."
                version="v3"
                badgeText="Not installed"
                status="not-installed"
                icon="extension-one-transaction-payment"
                extensionId="OneTxPayment"
              />
            </li>
            <li>
              <ExtensionItem
                title="Advanced Payments"
                description="Make payments to multiple recipients, with different tokens and times. Also make batch payments, split payments, staged payments & streaming payments."
                version="v1"
                badgeText="Coming soon"
                status="coming-soon"
                icon="extension-advanced-payments"
                extensionId="OneTxPayment"
              />
            </li>
          </ul>
          <h5 className="text-md font-semibold mb-4 mt-6">{formatMessage({ id: 'extensionsPage.governance' })}</h5>
          <ul className="pb-6 border-b border-gray-100">
            <li>
              <ExtensionItem
                title="Lazy Consensus (Reputation Weighted)"
                description="Enable efficient and decentralized decision making for your colony. Allowing members to propose actions to be taken."
                version="v7"
                badgeText="Enabled"
                status="enabled"
                icon="extension-lazy-consensus"
                extensionId="OneTxPayment"
                isInstalled
              />
            </li>
          </ul>
          <h5 className="text-md font-semibold mb-4 mt-6">{formatMessage({ id: 'extensionsPage.operations' })}</h5>
          <ul>
            <li>
              <ExtensionItem
                title="Incorporation"
                description="Create a legal wrapper for your DAO to interact with legal entities and to protect contributors."
                version="v1"
                badgeText="Coming soon"
                status="coming-soon"
                icon="extension-incorporation"
                extensionId="OneTxPayment"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

MainExtensionPage.displayName = displayName;

export default MainExtensionPage;
