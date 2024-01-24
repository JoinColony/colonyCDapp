import clsx from 'clsx';
import React, { type FC, useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.tsx';
import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import Table from '~v5/common/Table/index.ts';
import Button from '~v5/shared/Button/Button.tsx';

import { useSocialLinksTableColumns } from './hooks.tsx';
import SocialLinkModal from './partials/SocialLinkModal/index.ts';
import {
  type SocialLinksTableModel,
  type SocialLinksTableProps,
} from './types.ts';

const displayName = 'v5.common.ActionsContent.partials.SocialLinksTable';

const SocialLinksTable: FC<SocialLinksTableProps> = ({ name }) => {
  // -1 means we are adding new social link, otherwise we are editing existing one
  const [socialLinkIndex, setSocialLinkIndex] = useState<number>();
  const isMobile = useMobile();
  const fieldArrayMethods = useFieldArray({ name });
  const value = useWatch({ name });
  const { readonly } = useAdditionalFormOptionsContext();
  const getMenuProps = ({ index }) => {
    return {
      cardClassName: 'min-w-[9.625rem] whitespace-nowrap',
      items: [
        {
          key: 'edit',
          onClick: () => {
            setSocialLinkIndex(index);
          },
          label: formatText({ id: 'table.row.edit.link' }),
          icon: 'edit-pencil',
        },
        {
          key: 'remove',
          onClick: () => fieldArrayMethods.remove(index),
          label: formatText({ id: 'button.delete' }),
          icon: 'trash',
        },
      ],
    };
  };
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
          <Table<SocialLinksTableModel>
            sizeUnit="%"
            meatBallMenuSize={10}
            className={clsx({ '!border-negative-400': !!fieldState.error })}
            getRowId={({ key }) => key}
            columns={columns}
            data={data}
            getMenuProps={readonly ? undefined : getMenuProps}
          />
        </>
      )}
      {!readonly && (
        <>
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
      )}
    </>
  );
};

SocialLinksTable.displayName = displayName;

export default SocialLinksTable;
