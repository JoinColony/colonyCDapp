import React, { type FC, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import RadioList from '~common/Extensions/Fields/RadioList/index.ts';
import { GovernanceOptions } from '~frame/Extensions/pages/ExtensionsPage/types.ts';
import {
  governanceRadioList,
  initialExtensionContent,
} from '~frame/Extensions/pages/LazyConsensusPage/consts.tsx';
import { getSelectedFormData } from '~frame/Extensions/pages/LazyConsensusPage/hooks.tsx';
import { useExtensionDetailsPageContext } from '~frame/Extensions/pages/NewExtensionDetailsPage/context/ExtensionDetailsPageContext.ts';
import { useAccordion } from '~shared/Extensions/Accordion/hooks.ts';
import Accordion from '~shared/Extensions/Accordion/index.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';

const VotingReputationSettings: FC = () => {
  const { extensionData } = useExtensionDetailsPageContext();
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
    if (!isInstalledExtensionData(extensionData)) {
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

export default VotingReputationSettings;
