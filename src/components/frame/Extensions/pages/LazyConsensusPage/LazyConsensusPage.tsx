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

const LazyConsensusPage: FC = () => {
  const { openIndex, onOpenIndexChange } = useAccordion();
  const {
    extensionData,
    extensionContent,
    register,
    errors,
    handleSubmit,
    onSubmit,
    onChangeGovernance,
  } = useLazyConsensusPage(onOpenIndexChange, openIndex);
  const { formatMessage } = useIntl();

  if (!extensionData) {
    return (
      <div>
        <p>
          {formatMessage({ id: 'extensionDetailsPage.unsupportedExtension' })}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Spinner loadingText={{ id: 'loading.extensionsPage' }}>
        <ThreeColumns
          leftAside={<Navigation />}
          topRow={
            <div className="flex sm:items-center gap-5 sm:gap-12 justify-between flex-col sm:flex-row">
              <div className="flex sm:items-center gap-2 flex-col sm:flex-row">
                <Icon
                  name={extensionData?.icon || ''}
                  appearance={{ size: 'large' }}
                />
                {extensionData?.name?.defaultMessage && (
                  <h4 className="ml-2 text-xl font-semibold text-gray-900">
                    {extensionData?.name?.defaultMessage as React.ReactNode}
                  </h4>
                )}

                {/* @TODO: add condition to show/hide pills */}
                <div className="flex justify-between items-center w-full sm:w-auto mt-5 sm:mt-0">
                  <ExtensionStatusBadge
                    mode="governance"
                    text={formatMessage({ id: 'extensionsPage.governance' })}
                  />
                  <span className="flex sm:hidden text-gray-400 text-sm">{`17,876 ${formatMessage(
                    {
                      id: 'active.installs',
                    },
                  )}`}</span>
                </div>
              </div>

              <div className="sm:ml-4">
                <div className="flex gap-6 items-center justify-end min-h-[2rem]">
                  <span className="hidden sm:flex text-gray-400 text-sm">{`17,876 ${formatMessage(
                    {
                      id: 'active.installs',
                    },
                  )}`}</span>
                  <ActionButtons extensionData={extensionData} />
                </div>
              </div>
            </div>
          }
          rightAside={<ExtensionDetails extensionData={extensionData} />}
        >
          <div className="w-full">
            {extensionData?.descriptionShort?.defaultMessage && (
              <div className="text-md text-gray-600">
                {
                  extensionData?.descriptionShort
                    .defaultMessage as React.ReactNode
                }
              </div>
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
              <Accordion
                openIndex={openIndex}
                items={extensionContent || []}
                onOpenIndexChange={onOpenIndexChange}
              />
            </div>
          </div>
        </ThreeColumns>
      </Spinner>
    </form>
  );
};

export default LazyConsensusPage;
