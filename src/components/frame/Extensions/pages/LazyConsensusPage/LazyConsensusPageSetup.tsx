import React, { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';

import { getSelectedFormData } from './hooks';
import RadioList from '~common/Extensions/Fields/RadioList';
import Accordion from '~shared/Extensions/Accordion';
import { governanceRadioList, initialExtensionContent } from './consts';
import { useAccordion } from '~shared/Extensions/Accordion/hooks';
import { isInstalledExtensionData } from '~utils/extensions';
import { AnyExtensionData } from '~types';
import { formatText } from '~utils/intl';
import { GovernanceOptions } from '../ExtensionsPage/types';

interface LazyConsensusPageSetupProps {
  extensionData: AnyExtensionData;
}

const LazyConsensusPageSetup: FC<LazyConsensusPageSetupProps> = ({
  extensionData,
}) => {
  const { openIndex, onOpenIndexChange, isAccordionOpen } = useAccordion();
  const [isCustomChecked, setIsCustomChecked] = useState(false);

  const { setValue } = useFormContext();

  const onChangeGovernance = (selectedDefaultOption: GovernanceOptions) => {
    if (selectedDefaultOption === GovernanceOptions.CUSTOM) {
      onOpenIndexChange(0);
      setIsCustomChecked(true);
    } else {
      setIsCustomChecked(false);
    }
    const defaultFormData = getSelectedFormData(selectedDefaultOption);

    setValue('params', defaultFormData, { shouldValidate: true });
    setValue('option', selectedDefaultOption, { shouldValidate: true });
  };

  const { pathname } = useLocation();

  const navigate = useNavigate();

  /*
   * If we arrive here but the extension is either not installed or already initialised,
   * go back to main extension details page
   */

  useEffect(() => {
    if (
      !isInstalledExtensionData(extensionData) ||
      extensionData.isInitialized
    ) {
      navigate(pathname.split('/').slice(0, -1).join('/'));
    }
  }, [extensionData, pathname, navigate]);

  if (!extensionData) {
    return (
      <p>{formatText({ id: 'extensionDetailsPage.unsupportedExtension' })}</p>
    );
  }

  return (
    <div className="w-full">
      <p className="text-md text-gray-600">
        {formatText(extensionData.descriptionShort)}
      </p>
      <br />
      <p className="text-md text-gray-600">
        {formatText({ id: 'extensions.lazy.consensus.description' })}
      </p>

      <div className="mt-6">
        <RadioList
          title={formatText({ id: 'choose.governanceStyle' }) as string}
          items={governanceRadioList}
          onChange={onChangeGovernance}
          name="governance"
          checkedRadios={{ [GovernanceOptions.CUSTOM]: isCustomChecked }}
        />
      </div>
      <div className="mt-4">
        <Accordion
          openIndex={isAccordionOpen ? openIndex : -1}
          items={initialExtensionContent}
          onOpenIndexChange={onOpenIndexChange}
          onInputChange={() => setIsCustomChecked(true)}
        />
      </div>
    </div>
  );
};

export default LazyConsensusPageSetup;
