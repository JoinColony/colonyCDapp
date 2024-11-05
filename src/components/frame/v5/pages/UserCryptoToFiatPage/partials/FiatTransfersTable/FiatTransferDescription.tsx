import { ArrowSquareOut } from '@phosphor-icons/react';
import { type Row } from '@tanstack/react-table';
import clsx from 'clsx';
import React, { type FC } from 'react';

import ExternalLink from '~shared/ExternalLink/ExternalLink.tsx';
import { type BridgeDrain } from '~types/graphql.ts';
import { getFormattedDateFrom } from '~utils/getFormattedDateFrom.ts';
import { formatText } from '~utils/intl.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import { statusPillScheme, STATUS_MSGS } from './consts.ts';
import { FiatTransferDescriptionRow } from './FiatTransferDescriptionRow.tsx';

export interface FiatTransferDescriptionProps {
  actionRow: Row<BridgeDrain>;
  loading: boolean;
}

interface ContentObject {
  title: string;
  content: React.ReactNode;
}

const generateContentObjects = ({ status, date, receipt }): ContentObject[] => {
  const statusScheme = statusPillScheme[status] || statusPillScheme.default;
  return [
    {
      title: formatText({ id: 'table.row.date' }),
      content: <span className="text-md">{getFormattedDateFrom(date)}</span>,
    },
    {
      title: formatText({ id: 'table.row.status' }),
      content: (
        <PillsBase
          isCapitalized={false}
          className={clsx(statusScheme.bgClassName, 'text-sm font-medium')}
        >
          <span className={statusScheme.textClassName}>
            {formatText(STATUS_MSGS[status as keyof typeof STATUS_MSGS])}
          </span>
        </PillsBase>
      ),
    },
    {
      title: formatText({ id: 'table.row.receipt' }),
      content: !receipt ? (
        <div className="text-gray-400">
          {formatText({ id: 'table.content.receiptGenerating' })}
        </div>
      ) : (
        <ExternalLink
          href={receipt.url}
          key={receipt.url}
          className="ml-1 flex items-center gap-2 text-gray-700 underline transition-colors hover:text-blue-400"
        >
          <ArrowSquareOut size={18} />
          {formatText({ id: 'table.content.viewReceipt' })}
        </ExternalLink>
      ),
    },
  ];
};

const FiatTransferDescription: FC<FiatTransferDescriptionProps> = ({
  actionRow,
  loading,
}) => {
  const status = actionRow.getValue('state') as keyof typeof statusPillScheme;
  const contentObjects = generateContentObjects({
    status,
    date: actionRow.getValue('createdAt'),
    receipt: actionRow.original.receipt,
  });
  return (
    <div className="expandable flex items-start justify-between gap-1 pb-4 pl-[1.125rem] pr-[.9375rem] pt-1">
      <div className="flex flex-col gap-3 text-gray-500">
        {contentObjects.map(({ title, content }) => {
          return (
            <FiatTransferDescriptionRow loading={loading} title={title}>
              {content}
            </FiatTransferDescriptionRow>
          );
        })}
      </div>
    </div>
  );
};

export default FiatTransferDescription;
