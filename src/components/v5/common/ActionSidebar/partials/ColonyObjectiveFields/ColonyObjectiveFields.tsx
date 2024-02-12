import { Article, FileText, Percent } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext.tsx';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import FormInputBase from '~v5/common/Fields/InputBase/FormInputBase.tsx';

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
    defaultMessage: 'Short objective overview',
  },
  progress: {
    id: `${displayName}.progress`,
    defaultMessage: 'Progress percentage',
  },
});

const ColonyObjectiveFields: FC = () => {
  const { colony } = useColonyContext();
  const { objective } = colony.metadata || {};

  return (
    <>
      <ActionFormRow
        icon={Article}
        title={formatText(MSG.title)}
        fieldName="colonyObjectiveTitle"
      >
        <FormInputBase
          name="colonyObjectiveTitle"
          placeholder={formatText(MSG.titlePlaceholder)}
          mode="secondary"
          message={undefined}
          defaultValue={objective?.title}
        />
      </ActionFormRow>
      <ActionFormRow
        icon={FileText}
        title={formatText(MSG.description)}
        fieldName="colonyObjectiveDescription"
      >
        <FormInputBase
          name="colonyObjectiveDescription"
          placeholder={formatText(MSG.descriptionPlaceholder)}
          mode="secondary"
          message={undefined}
          defaultValue={objective?.description}
        />
      </ActionFormRow>
      <ActionFormRow
        icon={Percent}
        title={formatText(MSG.progress)}
        fieldName="colonyObjectiveProgress"
      >
        <FormInputBase
          type="number"
          max={100}
          name="colonyObjectiveProgress"
          placeholder="0"
          suffix={<span className="text-md">%</span>}
          mode="secondary"
          autoWidth
          message={undefined}
          defaultValue={objective?.progress}
        />
      </ActionFormRow>
    </>
  );
};

ColonyObjectiveFields.displayName = displayName;

export default ColonyObjectiveFields;
