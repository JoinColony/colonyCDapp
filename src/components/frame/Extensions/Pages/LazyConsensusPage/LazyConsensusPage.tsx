import React from 'react';
import { useIntl } from 'react-intl';
import SpecificSidePanel from '~common/Extensions/SpecificSidePanel';
import ThreeColumns from '../../ThreeColumns';
import { SpinnerLoader } from '~shared/Preloaders';
import { useLazyConsensusPage } from './hooks';
import Icon from '~shared/Icon';
import RadioList from '~shared/Extensions/Fields/RadioList';
import Accordion from '~shared/Extensions/Accordion/Accordion';
import { mockedGovernance } from './consts';
import Button from '~shared/Extensions/Button';
import { useAccordion } from '~shared/Extensions/Accordion/hooks';
import ExtensionStatusBadge from '~common/Extensions/ExtensionStatusBadge';

const LazyConsensusPage = () => {
  const { openIndex, onOpenIndexChange } = useAccordion();
  const { loading, extensionData, extensionContent, register, errors, handleSubmit, onSubmit } =
    useLazyConsensusPage(onOpenIndexChange);
  const { formatMessage } = useIntl();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {loading ? (
        <SpinnerLoader appearance={{ theme: 'primary', size: 'massive' }} />
      ) : (
        <ThreeColumns
          leftAside=""
          rightAside={
            <>
              <div className="flex gap-6 items-center justify-end min-h-[2rem]">
                <span className="text-gray-400 text-sm">{`17,876 ${formatMessage({ id: 'active.installs' })}`}</span>
                {!extensionData?.isInitialized && (
                  <Button mode="primarySolid" type="submit">
                    {formatMessage({ id: 'button.enable' })}
                  </Button>
                )}
              </div>
              <div className="mt-8">
                <SpecificSidePanel />
              </div>
            </>
          }
        >
          <>
            <div className="flex items-center gap-2">
              <Icon name={extensionData?.icon || ''} className="w-[2.125rem]" />
              {extensionData?.name?.defaultMessage && (
                // @ts-ignore
                <div className="text-gray-900 text-xl font-semibold">{extensionData?.name?.defaultMessage}</div>
              )}
              <ExtensionStatusBadge mode="governance" text={formatMessage({ id: 'extensionsPage.governance' })} />
            </div>

            {extensionData?.descriptionShort?.defaultMessage && (
              // @ts-ignore
              <div className="text-md text-gray-600 mt-8">{extensionData?.descriptionShort.defaultMessage}</div>
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
              />
            </div>
            <div className="mt-6">
              <Accordion openIndex={openIndex} items={extensionContent || []} onOpenIndexChange={onOpenIndexChange} />
            </div>
          </>
        </ThreeColumns>
      )}
    </form>
  );
};

export default LazyConsensusPage;
