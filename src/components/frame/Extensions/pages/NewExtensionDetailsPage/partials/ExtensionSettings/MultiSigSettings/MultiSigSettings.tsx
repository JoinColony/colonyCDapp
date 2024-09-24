import { CaretDown } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import { InputGroup } from '~common/Extensions/Fields/InputGroup/InputGroup.tsx';
import RadioBase from '~common/Extensions/Fields/RadioList/RadioBase.tsx';
import { useExtensionDetailsPageContext } from '~frame/Extensions/pages/NewExtensionDetailsPage/context/ExtensionDetailsPageContext.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { formatText } from '~utils/intl.ts';
import Select from '~v5/common/Fields/Select/Select.tsx';
import AccordionItem from '~v5/shared/Accordion/partials/AccordionItem/index.ts';

import { useThresholdData } from './hooks.ts';
import { MultiSigThresholdType } from './types.ts';

const displayName = 'pages.ExtensionDetailsPage.MultiSigSettings';

const MSG = defineMessages({
  settingsFirstLine: {
    id: `${displayName}.settingsFirstLine`,
    defaultMessage: 'Enabling this extension requires additional parameters.',
  },
  settingsSecondLine: {
    id: `${displayName}.settingsSecondLine`,
    defaultMessage:
      'These parameters can be changed at any time in future. Changes to the extensions parameters require Root permissions.',
  },
  parametersTitle: {
    id: `${displayName}.parametersTitle`,
    defaultMessage: 'Extension parameters',
  },
  parametersApprovalNrSubtitle: {
    id: `${displayName}.parametersApprovalNrSubtitle`,
    defaultMessage: 'Number of approvals required Colony wide',
  },
  parametersApprovalNrDescription: {
    id: `${displayName}.parametersApprovalNrDescription`,
    defaultMessage:
      'You can set how many approvals are required before actions that use the Multi-sig Permissions Decision Method are approved and can be executed. You can apply this rule to all teams within the Colony or by individual team.',
  },
  thresholdSubtitle: {
    id: `${displayName}.thresholdSubtitle`,
    defaultMessage: 'Select threshold type:',
  },
  thresholdMajorityApprovalTitle: {
    id: `${displayName}.thresholdMajorityApprovalTitle`,
    defaultMessage: 'Majority approval',
  },
  thresholdMajorityApprovalDescription: {
    id: `${displayName}.thresholdMajorityApprovalDescription`,
    defaultMessage:
      'The number of signers required to approve an action is relative to the number of relevant permission holders. E.g: There are 10 permission holders, 6 need to approve.',
  },
  thresholdFixedTitle: {
    id: `${displayName}.thresholdFixedTitle`,
    defaultMessage: 'Fixed threshold',
  },
  thresholdFixedDescription: {
    id: `${displayName}.thresholdFixedDescription`,
    defaultMessage:
      'Define a fixed number of signers that is required to approve an action. You will need to have at least this many users with the right permissions to approve an action.',
  },
  thresholdFixedFormApprovals: {
    id: `${displayName}.thresholdFixedFormApprovals`,
    defaultMessage: 'Approvals',
  },
  thresholdFixedErrorMessage: {
    id: `${displayName}.thresholdFixedErrorMessage`,
    defaultMessage: 'A value must be entered before enabling',
  },
  thresholdFixedMaxErrorMessage: {
    id: `${displayName}.thresholdFixedMaxErrorMessage`,
    defaultMessage: 'Threshold must be less than or equal to 99999',
  },
  thresholdInherit: {
    id: `${displayName}.thresholdInherit`,
    defaultMessage: 'Inherit from Colony wide',
  },
  domainSettingsHeading: {
    id: `${displayName}.domainSettingsHeading`,
    defaultMessage: 'Customize thresholds per team',
  },
  domainSettingsDescription: {
    id: `${displayName}.domainSettingsDescription`,
    defaultMessage:
      'For more control over required approvals, you can customise the thresholds for each team.',
  },
  domainFixedThresholdDescription: {
    id: `${displayName}.domainFixedThresholdDescription`,
    defaultMessage:
      'Define a fixed number of signers that is required to approve an action for this specific team',
  },
});

const inputGroupSharedConfig = {
  min: 0,
  max: 99999,
  step: 1,
  placeholder: '0',
  type: 'number',
};

interface MultiSigSettingsProps {
  userHasRoot: boolean;
}

const MultiSigSettings: FC<MultiSigSettingsProps> = ({ userHasRoot }) => {
  const { extensionData } = useExtensionDetailsPageContext();
  const {
    thresholdType,
    isFixedThresholdError,
    fixedThresholdErrorMessage,
    domainThresholdConfigs,
    handleThresholdValueChange,
    handleDomainThresholdTypeChange,
    handleGlobalThresholdTypeChange,
  } = useThresholdData(extensionData);
  const { register } = useFormContext();

  const [isCustomSettingsVisible, { toggle: toggleCustomSettings }] =
    useToggle();

  const handleOnKeyDown = (e) => {
    if (['.', ','].includes(e.key)) {
      e.preventDefault();
    }
  };

  if (!extensionData) {
    return (
      <p>{formatText({ id: 'extensionDetailsPage.unsupportedExtension' })}</p>
    );
  }

  const isFormDisabled = !userHasRoot;

  return (
    <div className="w-full">
      <p className="text-md text-gray-600">
        {formatText(MSG.settingsFirstLine)}
      </p>
      <p className="mt-[14px] text-md text-gray-600">
        {formatText(MSG.settingsSecondLine)}
      </p>
      <h4 className="my-6 text-lg font-semibold text-gray-900">
        {formatText(MSG.parametersTitle)}
      </h4>
      <h5 className="mb-4 text-md font-medium text-gray-900">
        {formatText(MSG.parametersApprovalNrSubtitle)}
      </h5>
      <p className="text-md text-gray-600">
        {formatText(MSG.parametersApprovalNrDescription)}
      </p>
      <h5 className="mb-3 mt-4 text-md font-semibold text-gray-900">
        {formatText(MSG.thresholdSubtitle)}
      </h5>
      <ul className="flex flex-col gap-3">
        <li key="multiSig.config.majorityApproval">
          <RadioBase
            name="multiSig.config.majorityApproval"
            onChange={handleGlobalThresholdTypeChange}
            item={{
              disabled: isFormDisabled,
              value: MultiSigThresholdType.MAJORITY_APPROVAL,
              label: formatText(MSG.thresholdMajorityApprovalTitle),
              description: formatText(MSG.thresholdMajorityApprovalDescription),
            }}
            checked={thresholdType === MultiSigThresholdType.MAJORITY_APPROVAL}
          />
        </li>
        <li key="multiSig.config.fixedThreshold" className="flex flex-col">
          <RadioBase
            name="multiSig.config.fixedThreshold"
            onChange={handleGlobalThresholdTypeChange}
            item={{
              disabled: isFormDisabled,
              value: MultiSigThresholdType.FIXED_THRESHOLD,
              label: formatText(MSG.thresholdFixedTitle),
              description: formatText(MSG.thresholdFixedDescription),
            }}
            checked={thresholdType === MultiSigThresholdType.FIXED_THRESHOLD}
            isError={isFixedThresholdError}
          >
            {thresholdType === MultiSigThresholdType.FIXED_THRESHOLD && (
              <InputGroup
                {...register('globalThreshold', {
                  required: formatText(MSG.thresholdFixedErrorMessage),
                  min: {
                    value: 1,
                    message: formatText(MSG.thresholdFixedErrorMessage),
                  },
                  max: {
                    value: 99999,
                    message: formatText(MSG.thresholdFixedMaxErrorMessage),
                  },
                  onChange: (e) => {
                    handleThresholdValueChange(
                      'globalThreshold',
                      Number(e.target.value),
                    );
                  },
                })}
                {...inputGroupSharedConfig}
                isDisabled={isFormDisabled}
                onKeyDown={handleOnKeyDown}
                isError={isFixedThresholdError}
                errorMessage={fixedThresholdErrorMessage}
                appendMessage={formatText(MSG.thresholdFixedFormApprovals)}
              />
            )}
          </RadioBase>
        </li>
      </ul>
      <div>
        <AccordionItem
          className="mt-12"
          icon={CaretDown}
          title={
            <h5 className="mb-3 mt-4 text-md font-semibold text-gray-900">
              {formatText(MSG.domainSettingsHeading)}
            </h5>
          }
          isOpen={isCustomSettingsVisible}
          onToggle={toggleCustomSettings}
          withDelimiter
        >
          <>
            <div className="mb-6 mt-4">
              <p className="text-sm text-gray-600">
                {formatText(MSG.domainSettingsDescription)}
              </p>
            </div>
            <div className="flex flex-col gap-6">
              {domainThresholdConfigs.map(
                ({ id, name, type, isError, errorMessage }) => (
                  <div key={id}>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-md font-medium">{name}</p>
                      <Select
                        isDisabled={isFormDisabled}
                        menuPosition="fixed"
                        menuShouldScrollIntoView={false}
                        className="w-full sm:w-72"
                        onChange={(option) =>
                          handleDomainThresholdTypeChange(
                            id,
                            option?.value as MultiSigThresholdType,
                          )
                        }
                        value={type}
                        options={[
                          {
                            label: formatText(MSG.thresholdInherit),
                            value: MultiSigThresholdType.INHERIT_FROM_COLONY,
                          },
                          {
                            label: formatText(
                              MSG.thresholdMajorityApprovalTitle,
                            ),
                            value: MultiSigThresholdType.MAJORITY_APPROVAL,
                          },
                          {
                            label: formatText(MSG.thresholdFixedTitle),
                            value: MultiSigThresholdType.FIXED_THRESHOLD,
                          },
                        ]}
                      />
                    </div>
                    {type === MultiSigThresholdType.FIXED_THRESHOLD && (
                      <div className="flex items-center justify-between gap-4 border-b pb-6 pt-4">
                        <div>
                          <p className="mb-0.5 text-md font-medium">
                            {formatText(MSG.thresholdFixedTitle)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatText(MSG.domainFixedThresholdDescription)}
                          </p>
                        </div>

                        <InputGroup
                          {...register(name, {
                            required: formatText(
                              MSG.thresholdFixedErrorMessage,
                            ),
                            min: {
                              value: 1,
                              message: formatText(
                                MSG.thresholdFixedErrorMessage,
                              ),
                            },
                            max: {
                              value: 99999,
                              message: formatText(
                                MSG.thresholdFixedMaxErrorMessage,
                              ),
                            },
                            onChange: (e) => {
                              handleThresholdValueChange(
                                name,
                                Number(e.target.value),
                              );
                            },
                          })}
                          {...inputGroupSharedConfig}
                          onKeyDown={handleOnKeyDown}
                          isError={isError}
                          isDisabled={isFormDisabled}
                          errorMessage={errorMessage}
                          appendMessage={formatText(
                            MSG.thresholdFixedFormApprovals,
                          )}
                          className="flex shrink-0 grow-0 basis-auto flex-col items-end"
                        />
                      </div>
                    )}
                  </div>
                ),
              )}
            </div>
          </>
        </AccordionItem>
      </div>
    </div>
  );
};

MultiSigSettings.displayName = displayName;
export default MultiSigSettings;
