import React, { FC, useState } from 'react';
import clsx from 'clsx';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { formatText } from '~utils/intl';
import TableWithMeatballMenu from '~v5/common/TableWithMeatballMenu';
import Button from '~v5/shared/Button/Button';
import { useMobile } from '~hooks';

import SocialLinkModal from './partials/SocialLinkModal';
import { useGetTableMenuProps, useSocialLinksTableColumns } from './hooks';
import { SocialLinksTableModel, SocialLinksTableProps } from './types';

const displayName = 'v5.common.ActionsContent.partials.SocialLinksTable';

const SocialLinksTable: FC<SocialLinksTableProps> = ({ name }) => {
  // -1 means we are adding new social link, otherwise we are editing existing one
  const [socialLinkIndex, setSocialLinkIndex] = useState<number>();
  const isMobile = useMobile();
  const fieldArrayMethods = useFieldArray({ name });
  const value = useWatch({ name });
  const getMenuProps = useGetTableMenuProps(
    fieldArrayMethods,
    setSocialLinkIndex,
  );
  const columns = useSocialLinksTableColumns();
  const data: SocialLinksTableModel[] = fieldArrayMethods.fields.map(
    ({ id }, index) => ({
      key: id,
      ...(value?.[index] || {}),
    }),
  );
  const { getFieldState } = useFormContext();
  const fieldState = getFieldState(name);

  return (
    <>
      {!!data.length && (
        <>
          <h5 className="text-2 mb-3 mt-6">
            {formatText({ id: 'editColony.socialLinks.table.title' })}
          </h5>
          <TableWithMeatballMenu<SocialLinksTableModel>
            sizeUnit="%"
            meatBallMenuSize={10}
            className={clsx({ '!border-negative-400': !!fieldState.error })}
            getRowId={({ key }) => key}
            columns={columns}
            data={data}
            getMenuProps={getMenuProps}
          />
        </>
      )}
      <Button
        mode="primaryOutline"
        iconName="plus"
        size="small"
        className="mt-6"
        isFullSize={isMobile}
        onClick={() => setSocialLinkIndex(-1)}
      >
        {formatText({ id: 'button.addSocialLinks' })}
      </Button>
      <SocialLinkModal
        key={socialLinkIndex}
        isOpen={socialLinkIndex !== undefined}
        onClose={() => setSocialLinkIndex(undefined)}
        defaultValues={data}
        initialLinkType={
          socialLinkIndex !== undefined
            ? data[socialLinkIndex]?.name
            : undefined
        }
        onSubmit={({ name: linkName, link }) => {
          if (socialLinkIndex === undefined) {
            return;
          }

          const existingSocialLinkIndex = data.findIndex(
            (socialLink) => socialLink.name === linkName,
          );

          if (existingSocialLinkIndex === -1) {
            fieldArrayMethods.append({
              name: linkName,
              link,
            });
          } else {
            fieldArrayMethods.update(existingSocialLinkIndex, {
              name: linkName,
              link,
            });
          }

          setSocialLinkIndex(undefined);
        }}
      />
    </>
  );
};

SocialLinksTable.displayName = displayName;

export default SocialLinksTable;
