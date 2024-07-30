import { Article, FileText, Percent } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import {
  MAX_OBJECTIVE_DESCRIPTION_LENGTH,
  MAX_OBJECTIVE_TITLE,
} from '~constants';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import FormInputBase from '~v5/common/Fields/InputBase/FormInputBase.tsx';
import FormTextareaBase from '~v5/common/Fields/TextareaBase/FormTextareaBase.tsx';

const displayName = 'v5.common.ActionsContent.partials.ColonyObjectiveFields';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Objective title',
  },
  titlePlaceholder: {
    id: `${displayName}.titlePlaceholder`,
    defaultMessage: 'Enter a title',
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage: 'Objective description',
  },
  descriptionPlaceholder: {
    id: `${displayName}.descriptionPlaceholder`,
    defaultMessage: 'Enter short description',
  },
  progress: {
    id: `${displayName}.progress`,
    defaultMessage: 'Progress percentage',
  },
});

const ColonyObjectiveFields: FC = () => {
  const { colony } = useColonyContext();
  const { objective } = colony.metadata || {};

  const hasNoDecisionMethods = useHasNoDecisionMethods();

  return (
    <>
      <ActionFormRow
        icon={Article}
        title={formatText(MSG.title)}
        fieldName="colonyObjectiveTitle"
        isMultiLine
        isDisabled={hasNoDecisionMethods}
      >
        <FormTextareaBase
          name="colonyObjectiveTitle"
          placeholder={formatText(MSG.titlePlaceholder)}
          maxLength={MAX_OBJECTIVE_TITLE}
          message={undefined}
          defaultValue={objective?.title}
          disabled={hasNoDecisionMethods}
        />
      </ActionFormRow>
      <ActionFormRow
        icon={FileText}
        title={formatText(MSG.description)}
        fieldName="colonyObjectiveDescription"
        isMultiLine
        isDisabled={hasNoDecisionMethods}
      >
        <FormTextareaBase
          name="colonyObjectiveDescription"
          placeholder={formatText(MSG.descriptionPlaceholder)}
          maxLength={MAX_OBJECTIVE_DESCRIPTION_LENGTH}
          message={undefined}
          defaultValue={objective?.description}
          disabled={hasNoDecisionMethods}
        />
      </ActionFormRow>
      <ActionFormRow
        icon={Percent}
        title={formatText(MSG.progress)}
        fieldName="colonyObjectiveProgress"
        isDisabled={hasNoDecisionMethods}
      >
        <FormInputBase
          type="number"
          max={100}
          name="colonyObjectiveProgress"
          placeholder="0"
          suffix={
            <span
              className={clsx('text-md', {
                'text-gray-300': hasNoDecisionMethods,
              })}
            >
              %
            </span>
          }
          mode="secondary"
          autoWidth
          message={undefined}
          defaultValue={objective?.progress}
          disabled={hasNoDecisionMethods}
        />
      </ActionFormRow>
    </>
  );
};

ColonyObjectiveFields.displayName = displayName;

export default ColonyObjectiveFields;
