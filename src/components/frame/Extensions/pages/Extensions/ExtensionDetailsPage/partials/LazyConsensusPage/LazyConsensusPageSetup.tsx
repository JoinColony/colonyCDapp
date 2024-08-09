import React, { type FC, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import RadioList from '~common/Extensions/Fields/RadioList/index.ts';
import { useAccordion } from '~shared/Extensions/Accordion/hooks.ts';
import Accordion from '~shared/Extensions/Accordion/index.ts';
import { type AnyExtensionData } from '~types/extensions.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';

import { GovernanceOptions } from '../../../ExtensionsListingPage/types.ts';
import ExtensionDetails from '../ExtensionDetails/ExtensionDetails.tsx';

import { governanceRadioList, initialExtensionContent } from './consts.tsx';
import { getSelectedFormData } from './hooks.tsx';

const displayName =
  'frame.Extensions.pages.ExtensionDetailsPage.partials.LazyConsensusPageSetup';

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
    <div className="flex w-full flex-col gap-9">
      <ExtensionDetails extensionData={extensionData} className="md:hidden" />
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
            title={formatText({ id: 'choose.governanceStyle' })}
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
    </div>
  );
};

LazyConsensusPageSetup.displayName = displayName;

export default LazyConsensusPageSetup;
