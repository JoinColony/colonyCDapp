import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { Extension } from '@colony/colony-js';
import { FormProvider } from 'react-hook-form';

import { useLazyConsensusPage } from './hooks';
import RadioList from '~common/Extensions/Fields/RadioList';
import Accordion from '~shared/Extensions/Accordion';
import { mockedGovernance } from './consts';
import { useAccordion } from '~shared/Extensions/Accordion/hooks';
import Navigation from '~v5/common/Navigation';
import Spinner from '~v5/shared/Spinner';
import ThreeColumns from '~v5/frame/ThreeColumns';
import ExtensionDetails from '../ExtensionDetailsPage/partials/ExtensionDetails';
import ActionButtons from '../partials/ActionButtons';
import Button from '~v5/shared/Button';
import { isInstalledExtensionData } from '~utils/extensions';
import { useMobile } from '~hooks';
import styles from '../Pages.module.css';

const LazyConsensusPage: FC = () => {
  const { openIndex, onOpenIndexChange, isAccordionOpen, manualOpen } =
    useAccordion();
  const {
    extensionData,
    initialExtensionContent,
    extensionContent,
    methods,
    handleSubmit,
    onSubmit,
    onChangeGovernance,
  } = useLazyConsensusPage(onOpenIndexChange, manualOpen);
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
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Spinner loadingText={{ id: 'loading.extensionsPage' }}>
          <ThreeColumns
            leftAside={<Navigation pageName="extensions" />}
            topRow={
              <div className="flex justify-between flex-col flex-wrap sm:items-center sm:flex-row sm:gap-6">
                <div className={styles.topContainer}>
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
                        type="submit"
                        disabled={
                          !!Object.keys(methods.formState.errors).length
                        }
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
                  register={methods.register}
                  errors={methods.formState.errors}
                  onChange={onChangeGovernance}
                  name="governance"
                />
              </div>
              <div className="mt-4">
                <Accordion
                  openIndex={isAccordionOpen ? openIndex : -1}
                  items={extensionContent || initialExtensionContent}
                  onOpenIndexChange={onOpenIndexChange}
                  errors={methods.formState.errors}
                />
              </div>
            </div>
          </ThreeColumns>
        </Spinner>
      </form>
    </FormProvider>
  );
};

export default LazyConsensusPage;
