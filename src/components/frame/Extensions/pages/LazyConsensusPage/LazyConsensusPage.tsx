import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { Extension } from '@colony/colony-js';

import { useLazyConsensusPage } from './hooks';
import RadioList from '~shared/Extensions/Fields/RadioList';
import Accordion from '~shared/Extensions/Accordion/Accordion';
import { mockedGovernance } from './consts';
import { useAccordion } from '~shared/Extensions/Accordion/hooks';
import Navigation from '~common/Extensions/Navigation/Navigation';
import Spinner from '~shared/Extensions/Spinner';
import ThreeColumns from '~frame/Extensions/ThreeColumns/ThreeColumns';
import ExtensionDetails from '../ExtensionDetailsPage/partials/ExtensionDetails';
import ActionButtons from '../partials/ActionButtons';
import Button from '~shared/Extensions/Button/Button';
import { isInstalledExtensionData } from '~utils/extensions';
import { useMobile } from '~hooks';

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
  const isMobile = useMobile();

  if (!extensionData) {
    return (
      <p>
        {formatMessage({ id: 'extensionDetailsPage.unsupportedExtension' })}
      </p>
    );
  }

  const isEnableButtonVisible =
    isInstalledExtensionData(extensionData) &&
    extensionData.uninstallable &&
    !extensionData.isDeprecated &&
    extensionData?.extensionId === Extension.VotingReputation;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Spinner loadingText={{ id: 'loading.extensionsPage' }}>
        <ThreeColumns
          leftAside={<Navigation />}
          topRow={
            <div className="flex justify-between flex-col flex-wrap sm:items-center sm:flex-row sm:gap-6">
              <div className="flex flex-wrap gap-4 flex-col w-full sm:flex-row sm:items-center md:gap-8">
                <ActionButtons
                  extensionData={extensionData}
                  extensionStatusMode="governance"
                  extensionStatusText={formatMessage({
                    id: 'status.governance',
                  })}
                />

                <div className="flex gap-6 items-center justify-end min-h-[2rem]">
                  {isEnableButtonVisible && (
                    <Button
                      mode="primarySolid"
                      type="submit"
                      isFullSize={isMobile}
                    >
                      {formatMessage({ id: 'button.enable' })}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          }
          rightAside={<ExtensionDetails extensionData={extensionData} />}
        >
          <div className="w-full">
            <p className="text-md text-gray-600">
              {formatMessage(extensionData.descriptionShort)}
            </p>
            <br />
            <p className="text-md text-gray-600">
              {formatMessage({ id: 'extensions.lazy.consensus.description' })}
            </p>

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
