import React, { type FC, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import RadioList from '~common/Extensions/Fields/RadioList/index.ts';
import { GovernanceOptions } from '~frame/Extensions/pages/ExtensionsPage/types.ts';
import { useAccordion } from '~shared/Extensions/Accordion/hooks.ts';
import Accordion from '~shared/Extensions/Accordion/index.ts';
import { formatText } from '~utils/intl.ts';

import { type ExtensionSetupPageBaseProps } from '../../types.ts';

import { governanceRadioList, initialExtensionContent } from './consts.tsx';
import { getSelectedFormData } from './utils.ts';

const displayName =
  'frame.Extensions.pages.ExtensionSetupPage.partials.LazyConsensusSetup';

const LazyConsensusSetup: FC<ExtensionSetupPageBaseProps> = ({
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
  );
};

LazyConsensusSetup.displayName = displayName;

export default LazyConsensusSetup;
