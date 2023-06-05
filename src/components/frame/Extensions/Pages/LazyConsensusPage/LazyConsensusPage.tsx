import React from 'react';
import { useIntl } from 'react-intl';
import { useLazyConsensusPage } from './hooks';
import Icon from '~shared/Icon';
import RadioList from '~shared/Extensions/Fields/RadioList';
import Accordion from '~shared/Extensions/Accordion/Accordion';
import { mockedGovernance } from './consts';
import Button from '~shared/Extensions/Button';
import { useAccordion } from '~shared/Extensions/Accordion/hooks';
import ExtensionStatusBadge from '~common/Extensions/ExtensionStatusBadge';
import Navigation from '~common/Extensions/Navigation/Navigation';
import Spinner from '~shared/Extensions/Spinner';
import ThreeColumns from '~frame/Extensions/ThreeColumns/ThreeColumns';
import ExtensionDetails from '../ExtensionDetailsPage/partials/ExtensionDetails/ExtensionDetails';
import { AnyExtensionData } from '~types';
import { useMobile } from '~hooks';

const LazyConsensusPage = () => {
  const { openIndex, onOpenIndexChange } = useAccordion();
  const { extensionData, extensionContent, register, errors, handleSubmit, onSubmit, onChangeGovernance } =
    useLazyConsensusPage(onOpenIndexChange, openIndex);
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Spinner loadingText="extensionsPage">
        <ThreeColumns
          leftAside={<Navigation />}
          topRow={
            <div className="flex items-center gap-12 justify-between">
              <div className="flex items-center gap-2">
                <Icon name={extensionData?.icon || ''} appearance={{ size: 'large' }} />
                {extensionData?.name?.defaultMessage && (
                  <h4 className="ml-2 text-xl font-semibold text-gray-900">
                    {extensionData?.name?.defaultMessage as React.ReactNode}
                  </h4>
                )}

                {/* @TODO: add condition to show/hide pills */}
                <ExtensionStatusBadge mode="governance" text={formatMessage({ id: 'extensionsPage.governance' })} />
              </div>

              <div className="sm:ml-4">
                <div className="flex gap-6 items-center justify-end min-h-[2rem]">
                  <span className="text-gray-400 text-sm">{`17,876 ${formatMessage({ id: 'active.installs' })}`}</span>
                  {!extensionData?.isInitialized && (
                    <Button mode="primarySolid" isFullSize={isMobile} type="submit">
                      {formatMessage({ id: 'button.enable' })}
                    </Button>
                  )}
                </div>

                {/* @TODO: add install action */}
                {/* <Button mode="primarySolid" isFullSize={isMobile} onClick={handleInstallClick}>
                  <p className="text-sm font-medium">{formatMessage({ id: 'extension.installButton' })}</p>
                </Button> */}
              </div>
            </div>
          }
          rightAside={<ExtensionDetails extensionData={extensionData as AnyExtensionData} />}
        >
          <div className="w-full">
            {extensionData?.descriptionShort?.defaultMessage && (
              <div className="text-md text-gray-600">
                {extensionData?.descriptionShort.defaultMessage as React.ReactNode}
              </div>
            )}
            <br />
            <div className="text-md text-gray-600">
              {formatMessage({ id: 'extensions.lazy.consensus.description' })}
            </div>

            <div className="mt-6">
              <RadioList
                title={formatMessage({ id: 'choose.governancestyle' })}
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
