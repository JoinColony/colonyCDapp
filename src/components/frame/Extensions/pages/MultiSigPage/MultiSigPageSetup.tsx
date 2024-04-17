import React, { type FC, useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';

import RadioBase from '~common/Extensions/Fields/RadioList/RadioBase.tsx';
import { type AnyExtensionData } from '~types/extensions.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';

interface MultiSigPageSetupProps {
  extensionData: AnyExtensionData;
}

const displayName = 'frame.Extensions.pages.ExtensionDetailsPage.MultiSigSetup';

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
});

enum MultiSigThresholdType {
  MAJORITY_APPROVAL = 'majorityApproval',
  FIXED_THRESHOLD = 'fixedThreshold',
}

const MultiSigPageSetup: FC<MultiSigPageSetupProps> = ({ extensionData }) => {
  const [thresholdType, setThresholdType] = useState<MultiSigThresholdType>(
    MultiSigThresholdType.MAJORITY_APPROVAL,
  );
  const [fixedThreshold, setFixedThreshold] = useState(0);

  const { pathname } = useLocation();

  const navigate = useNavigate();

  // We should probably handle a min/max validation of this value depending on the number of members in a colony
  const handleThresholdChange = (newThreshold: number) => {
    if (thresholdType === MultiSigThresholdType.FIXED_THRESHOLD) {
      setFixedThreshold(newThreshold);
    }
  };

  const handleThresholdTypeChange = (
    newThresholdType: MultiSigThresholdType,
  ) => {
    setThresholdType(newThresholdType);
  };

  /*
   * If we arrive here but the extension is not installed go back to main extension details page
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
        {formatText(MSG.settingsFirstLine)}
      </p>
      <p className="mt-6 text-md text-gray-600">
        {formatText(MSG.settingsSecondLine)}
      </p>
      <h4 className="my-6 text-lg font-semibold text-gray-900">
        {formatText(MSG.parametersTitle)}
      </h4>
      <h5 className="mb-2 text-md font-semibold text-gray-900">
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
            onChange={handleThresholdTypeChange}
            item={{
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
            onChange={handleThresholdTypeChange}
            item={{
              value: MultiSigThresholdType.FIXED_THRESHOLD,
              label: formatText(MSG.thresholdFixedTitle),
              description: formatText(MSG.thresholdFixedDescription),
            }}
            checked={thresholdType === MultiSigThresholdType.FIXED_THRESHOLD}
          />
          {thresholdType === MultiSigThresholdType.FIXED_THRESHOLD && (
            <>
              <input
                className="border border-gray-600"
                value={fixedThreshold}
                onChange={(e) => handleThresholdChange(Number(e.target.value))}
                type="number"
              />
              <span>{formatText(MSG.thresholdFixedFormApprovals)}</span>
            </>
          )}
        </li>
      </ul>
    </div>
  );
};

MultiSigPageSetup.displayName = displayName;
export default MultiSigPageSetup;
