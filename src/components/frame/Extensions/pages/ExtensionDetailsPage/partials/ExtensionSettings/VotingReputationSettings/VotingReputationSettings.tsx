import Decimal from 'decimal.js';
import React, { type FC, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import RadioList from '~common/Extensions/Fields/RadioList/index.ts';
import { useExtensionDetailsPageContext } from '~frame/Extensions/pages/ExtensionDetailsPage/context/ExtensionDetailsPageContext.ts';
import { getExtensionParams } from '~frame/Extensions/pages/ExtensionDetailsPage/utils.tsx';
import { GovernanceOptions } from '~frame/Extensions/pages/ExtensionsPage/types.ts';
import {
  governanceRadioList,
  initialExtensionContent,
} from '~frame/Extensions/pages/LazyConsensusPage/consts.tsx';
import { getSelectedFormData } from '~frame/Extensions/pages/LazyConsensusPage/hooks.tsx';
import { useAccordion } from '~shared/Extensions/Accordion/hooks.ts';
import Accordion from '~shared/Extensions/Accordion/index.ts';
import { type AnyExtensionData } from '~types/extensions.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';

import { paramsMap } from './consts.ts';

interface VotingReputationParamsProps {
  extensionData: AnyExtensionData;
}

const VotingReputationParams: FC<VotingReputationParamsProps> = ({
  extensionData,
}) => {
  const params = getExtensionParams(extensionData);

  if (isInstalledExtensionData(extensionData) && !extensionData.isInitialized) {
    return null;
  }

  return (
    <div>
      {Object.keys(params)
        .filter((param) => paramsMap[extensionData.extensionId][param])
        .map((param) => {
          const { title, complementaryLabel, description } =
            paramsMap[extensionData.extensionId][param];
          let value: string = params[param];

          if (complementaryLabel === 'percent') {
            value = new Decimal(value).div(new Decimal(10).pow(16)).toString();
          } else {
            const valueDecimal = new Decimal(value).div(3600);
            value = valueDecimal.isInteger()
              ? valueDecimal.toFixed(0)
              : valueDecimal.toFixed(2);
          }

          return (
            <div
              key={param}
              className="border-b border-gray-200 py-4 last:border-none"
            >
              <div className="flex items-center justify-between text-1">
                <p>{formatText(title)}</p>
                <div>
                  {value}{' '}
                  {complementaryLabel === 'percent'
                    ? '%'
                    : formatText({ id: 'hours' })}
                </div>
              </div>
              <p className="text-sm text-gray-600">{formatText(description)}</p>
            </div>
          );
        })}
    </div>
  );
};

interface VotingReputationSettingsProps {
  userHasRoot: boolean;
}

const VotingReputationSettings: FC<VotingReputationSettingsProps> = ({
  userHasRoot,
}) => {
  const { extensionData, isPendingManagement } =
    useExtensionDetailsPageContext();
  const { openIndex, onOpenIndexChange, isAccordionOpen } = useAccordion();
  const [isCustomChecked, setIsCustomChecked] = useState(false);

  const {
    setValue,
    formState: { isSubmitting },
  } = useFormContext();

  const onChangeGovernance = (selectedDefaultOption: GovernanceOptions) => {
    if (selectedDefaultOption === GovernanceOptions.CUSTOM) {
      onOpenIndexChange(0);
      setIsCustomChecked(true);
    } else {
      setIsCustomChecked(false);
    }
    const defaultFormData = getSelectedFormData(selectedDefaultOption);

    Object.keys(defaultFormData).forEach((key) => {
      setValue(key, defaultFormData[key], { shouldValidate: true });
    });
    setValue('option', selectedDefaultOption, { shouldValidate: true });
  };

  if (!extensionData) {
    return (
      <p>{formatText({ id: 'extensionDetailsPage.unsupportedExtension' })}</p>
    );
  }

  if (
    !userHasRoot ||
    (isInstalledExtensionData(extensionData) && extensionData.isInitialized)
  ) {
    return <VotingReputationParams extensionData={extensionData} />;
  }

  const isFormDisabled = isPendingManagement || isSubmitting;

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
          items={
            isFormDisabled
              ? governanceRadioList.map((item) => ({
                  ...item,
                  disabled: true,
                }))
              : governanceRadioList
          }
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
