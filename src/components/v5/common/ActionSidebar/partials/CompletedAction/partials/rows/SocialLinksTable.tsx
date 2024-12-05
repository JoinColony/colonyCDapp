import React from 'react';

import { type ExternalLink } from '~gql';
import { useMobile } from '~hooks/index.ts';
import { useSocialLinksTableColumns } from '~hooks/useSocialLinksTableColumns.tsx';
import { type SocialLinksTableModel } from '~types/colony.ts';
import { formatText } from '~utils/intl.ts';
import Table from '~v5/common/Table/index.ts';

const displayName = 'v5.common.ActionsContent.partials.SocialLinksTable';

interface Props {
  socialLinks: ExternalLink[];
}

const SocialLinksTable = ({ socialLinks }: Props) => {
  const isMobile = useMobile();
  const columns = useSocialLinksTableColumns();
  const data: SocialLinksTableModel[] = socialLinks.map(({ name, link }) => ({
    key: `${name}-${link}`,
    name,
    link,
  }));

  return (
    <>
      {!!data.length && (
        <>
          <h5 className="mb-3 mt-6 text-2">
            {formatText({ id: 'editColony.socialLinks.table.title' })}
          </h5>
          <Table<SocialLinksTableModel>
            sizeUnit={isMobile ? undefined : '%'}
            meatBallMenuSize={isMobile ? undefined : 10}
            getRowId={({ key }) => key}
            columns={columns}
            data={data}
            verticalLayout={isMobile}
            withBorder={false}
          />
        </>
      )}
    </>
  );
};

SocialLinksTable.displayName = displayName;

export default SocialLinksTable;
