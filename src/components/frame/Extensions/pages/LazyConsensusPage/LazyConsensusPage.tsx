import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { useLazyConsensusPage } from './hooks';
import Icon from '~shared/Icon';
import RadioList from '~shared/Extensions/Fields/RadioList';
import Accordion from '~shared/Extensions/Accordion/Accordion';
import { mockedGovernance } from './consts';
import { useAccordion } from '~shared/Extensions/Accordion/hooks';
import ExtensionStatusBadge from '~common/Extensions/ExtensionStatusBadge';
import Navigation from '~common/Extensions/Navigation/Navigation';
import Spinner from '~shared/Extensions/Spinner';
import ThreeColumns from '~frame/Extensions/ThreeColumns/ThreeColumns';
import ExtensionDetails from '../ExtensionDetailsPage/partials/ExtensionDetails/ExtensionDetails';
import ActionButtons from '../partials/ActionButtons';
import { useFetchActiveInstallsExtension } from '../ExtensionDetailsPage/hooks';
import { ACTIVE_INSTALLED_LIMIT } from '~constants';

const LazyConsensusPage: FC = () => {
  const { formatMessage } = useIntl();
  const { openIndex, onOpenIndexChange } = useAccordion();
  const { extensionData, extensionContent, register, errors, handleSubmit, onSubmit, onChangeGovernance } =
    useLazyConsensusPage(onOpenIndexChange, openIndex);

  const { oneTxPaymentData, votingReputationData } = useFetchActiveInstallsExtension();

  if (!extensionData) {
    return null;
  }

  if (!extensionData) {
    return (
      <div>
        <p>{formatMessage({ id: 'extensionDetailsPage.unsupportedExtension' })}</p>
      </div>
    );
  }

  const activeInstalls = Number(extensionData.extensionId === 'OneTxPayment' ? oneTxPaymentData : votingReputationData);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Spinner loadingText={{ id: 'loading.extensionsPage' }}>
        <ThreeColumns
          leftAside={<Navigation />}
          topRow={
            <div className="flex justify-between flex-col flex-wrap sm:items-center sm:flex-row sm:gap-6">
              <div className="flex flex-col sm:items-center sm:flex-row sm:gap-2 sm:grow">
                <div className="flex items-center shrink-0">
                  <Icon name={extensionData.icon} appearance={{ size: 'large' }} />
                  <h4 className="ml-2 text-xl font-semibold text-gray-900">{formatMessage(extensionData.name)}</h4>
                </div>
                {/* @TODO: add condition to show/hide pills */}
                <div className="flex items-center justify-between gap-4 mt-4 sm:mt-0 sm:grow">
                  <ExtensionStatusBadge mode="governance" text={formatMessage({ id: 'status.governance' })} />
                  {activeInstalls >= ACTIVE_INSTALLED_LIMIT ? (
                    <p className="text-gray-400 text-sm">
                      {activeInstalls.toLocaleString('en-US')} {formatMessage({ id: 'active.installs' })}
                    </p>
                  ) : (
                    <ExtensionStatusBadge mode="new" text={{ id: 'status.new' }} />
                  )}
                </div>
              </div>
              <ActionButtons extensionData={extensionData} />
            </div>
          }
          rightAside={<ExtensionDetails extensionData={extensionData} />}
        >
          <div className="w-full">
            {extensionData.descriptionShort && (
              <div className="text-md text-gray-600">{formatMessage(extensionData.descriptionShort)}</div>
            )}
            <br />
            <div className="text-md text-gray-600">
              {formatMessage({ id: 'extensions.lazy.consensus.description' })}
            </div>

            <div className="mt-6">
              <RadioList
                title={formatMessage({ id: 'choose.governanceStyle' })}
                items={mockedGovernance}
                register={register}
                errors={errors}
                onChange={onChangeGovernance}
                name="governance"
              />
            </div>
            <div className="mt-6">
              <Accordion openIndex={openIndex} items={extensionContent || []} onOpenIndexChange={onOpenIndexChange} />
            </div>
          </div>
        </ThreeColumns>
      </Spinner>
    </form>
  );
};

export default LazyConsensusPage;
