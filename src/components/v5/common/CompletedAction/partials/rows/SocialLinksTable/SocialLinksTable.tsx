import React from 'react';

import { type ExternalLink } from '~gql';
import { formatText } from '~utils/intl.ts';
import { useSocialLinksTableColumns } from '~v5/common/ActionSidebar/partials/forms/EditColonyDetailsForm/partials/SocialLinksTable/hooks.tsx';
import { type SocialLinksTableModel } from '~v5/common/ActionSidebar/partials/forms/EditColonyDetailsForm/partials/SocialLinksTable/types.ts';
import Table from '~v5/common/Table/index.ts';

const displayName = 'v5.common.ActionsContent.partials.SocialLinksTable';

interface Props {
  socialLinks: ExternalLink[] | undefined | null;
}

const SocialLinksTable = ({ socialLinks }: Props) => {
  const columns = useSocialLinksTableColumns();
  const data: SocialLinksTableModel[] =
    socialLinks?.map(({ name, link }) => ({
      key: `${name}-${link}`,
      name,
      link,
    })) || [];

  return (
    <>
      {!!data.length && (
        <>
          <h5 className="text-2 mb-3 mt-6">
            {formatText({ id: 'editColony.socialLinks.table.title' })}
          </h5>
          <Table<SocialLinksTableModel>
            sizeUnit="%"
            meatBallMenuSize={10}
            getRowId={({ key }) => key}
            columns={columns}
            data={data}
          />
        </>
      )}
    </>
  );
};

SocialLinksTable.displayName = displayName;

export default SocialLinksTable;
