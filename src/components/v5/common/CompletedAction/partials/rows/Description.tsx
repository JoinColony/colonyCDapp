import React from 'react';
import { Pencil } from 'phosphor-react';
import { formatText } from '~utils/intl';
import { ICON_SIZE } from '../../consts';
import RichTextDisplay from '~v5/shared/RichTextDisplay';

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
