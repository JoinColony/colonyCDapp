import { Pencil } from 'phosphor-react';
import React from 'react';

import { formatText } from '~utils/intl';
import RichTextDisplay from '~v5/shared/RichTextDisplay';

import { ICON_SIZE } from '../../consts';

const displayName = 'v5.common.CompletedAction.partials.DescriptionRow';

interface DescriptionRowProps {
  description: string;
}

const DescriptionRow = ({ description }: DescriptionRowProps) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <Pencil size={ICON_SIZE} />
        <span>{formatText({ id: 'actionSidebar.description' })}</span>
      </div>
      <div>
        <RichTextDisplay content={description} />
      </div>
    </>
  );
};

DescriptionRow.displayName = displayName;
export default DescriptionRow;
