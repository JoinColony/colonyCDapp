import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { Extension } from '@colony/colony-js';

import { useLazyConsensusPage } from './hooks';
import RadioList from '~shared/Extensions/Fields/RadioList';
import Accordion from '~shared/Extensions/Accordion/Accordion';
import { mockedGovernance } from './consts';
import { useAccordion } from '~shared/Extensions/Accordion/hooks';
import ExtensionStatusBadge from '~common/Extensions/ExtensionStatusBadge';
import Navigation from '~common/Extensions/Navigation/Navigation';
import Spinner from '~shared/Extensions/Spinner';
import ThreeColumns from '~frame/Extensions/ThreeColumns/ThreeColumns';
import ExtensionDetails from '../ExtensionDetailsPage/partials/ExtensionDetails';
import ActionButtons from '../partials/ActionButtons';
import Button from '~shared/Extensions/Button/Button';
import { isInstalledExtensionData } from '~utils/extensions';
import { useFetchActiveInstallsExtension, useMobile } from '~hooks';
import ActiveInstalls from '../partials/ActiveInstalls';
import HeadingIcon from '../partials/HeadingIcon';

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
  const { oneTxPaymentData, votingReputationData } =
    useFetchActiveInstallsExtension();

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

  const activeInstalls = Number(
    extensionData.extensionId === Extension.OneTxPayment
      ? oneTxPaymentData
      : votingReputationData,
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Spinner loadingText={{ id: 'loading.extensionsPage' }}>
        <ThreeColumns
          leftAside={<Navigation />}
          topRow={
            <div className="flex justify-between flex-col flex-wrap sm:items-center sm:flex-row sm:gap-6">
              <div className="flex sm:items-center gap-2 flex-col sm:flex-row w-full">
                <div className="flex flex-col sm:items-center sm:flex-row sm:gap-2 sm:grow">
                  <HeadingIcon
                    name={extensionData.name}
                    icon={extensionData.icon}
                  />
                  <div className="flex justify-between items-center w-full mt-4 sm:mt-0">
                    <ExtensionStatusBadge
                      mode="governance"
                      text={formatMessage({ id: 'status.governance' })}
                    />
                    <ActiveInstalls activeInstalls={activeInstalls} />
                  </div>
                </div>
                <div className="sm:ml-4">
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
                    <ActionButtons extensionData={extensionData} />
                  </div>
                </div>
              </div>
            </div>
          }
          rightAside={<ExtensionDetails extensionData={extensionData} />}
        >
          <div className="w-full">
            <div className="text-md text-gray-600">
              {formatMessage(extensionData.descriptionShort)}
            </div>
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
