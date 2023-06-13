import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { useLazyConsensusPage } from './hooks';
import RadioList from '~shared/Extensions/Fields/RadioList';
import Accordion from '~shared/Extensions/Accordion/Accordion';
import { mockedGovernance } from './consts';
import { useAccordion } from '~shared/Extensions/Accordion/hooks';
import Navigation from '~common/Extensions/Navigation/Navigation';
import Spinner from '~shared/Extensions/Spinner';
import ThreeColumns from '~frame/Extensions/ThreeColumns/ThreeColumns';
import ExtensionDetails from '../ExtensionDetailsPage/partials/ExtensionDetails/ExtensionDetails';

const LazyConsensusPage: FC = () => {
  const { formatMessage } = useIntl();
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

  if (!extensionData) {
    return null;
  }

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
          rightAside={<ExtensionDetails extensionData={extensionData} />}
        >
          <div className="w-full">
            {extensionData.descriptionShort && (
              <div className="text-md text-gray-600">
                {formatMessage(extensionData.descriptionShort)}
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
