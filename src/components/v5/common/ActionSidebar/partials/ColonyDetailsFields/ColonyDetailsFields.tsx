import { FileText, Image, PencilCircle } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import {
  MAX_COLONY_DISPLAY_NAME,
  MAX_COLONY_DESCRIPTION_LENGTH,
} from '~constants/index.ts';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import FormInputBase from '~v5/common/Fields/InputBase/FormInputBase.tsx';
import FormTextareaBase from '~v5/common/Fields/TextareaBase/FormTextareaBase.tsx';

import ColonyAvatarField from './partials/ColonyAvatarField/index.ts';

const displayName = 'v5.common.ActionsContent.partials.ColonyDetailsFields';

const ColonyDetailsFields: FC = () => {
  const hasNoDecisionMethods = useHasNoDecisionMethods();

  return (
    <>
      <ActionFormRow
        icon={PencilCircle}
        fieldName="colonyName"
        title={formatText({ id: 'actionSidebar.colonyName' })}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.editColony.colonyName',
            }),
          },
        }}
        isDisabled={hasNoDecisionMethods}
      >
        <FormInputBase
          message={false}
          name="colonyName"
          maxLength={MAX_COLONY_DISPLAY_NAME}
          placeholder={formatText({
            id: 'actionSidebar.colonyName.placeholder',
          })}
          mode="secondary"
          disabled={hasNoDecisionMethods}
        />
      </ActionFormRow>
      <ActionFormRow
        icon={Image}
        fieldName="avatar"
        title={formatText({ id: 'actionSidebar.colonyLogo' })}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.editColony.colonyLogo',
            }),
          },
        }}
        isDisabled={hasNoDecisionMethods}
      >
        <div className="flex items-center">
          <ColonyAvatarField
            name="avatar"
            fileOptions={{
              fileFormat: ['.PNG', '.JPG', '.SVG'],
              fileDimension: '120x120px',
              fileSize: '1MB',
            }}
            disabled={hasNoDecisionMethods}
          />
        </div>
      </ActionFormRow>
      <ActionFormRow
        icon={FileText}
        fieldName="colonyDescription"
        title={formatText({ id: 'actionSidebar.colonyDescription' })}
        isMultiLine
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.editColony.colonyDescription',
            }),
          },
        }}
        isDisabled={hasNoDecisionMethods}
      >
        <FormTextareaBase
          message={false}
          maxLength={MAX_COLONY_DESCRIPTION_LENGTH}
          name="colonyDescription"
          placeholder={formatText({
            id: 'actionSidebar.colonyDescription.placeholder',
          })}
          wrapperClassName="w-full"
          disabled={hasNoDecisionMethods}
        />
      </ActionFormRow>
    </>
  );
};

ColonyDetailsFields.displayName = displayName;

export default ColonyDetailsFields;
