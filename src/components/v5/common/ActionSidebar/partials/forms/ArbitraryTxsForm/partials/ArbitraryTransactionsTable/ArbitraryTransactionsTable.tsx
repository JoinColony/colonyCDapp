import { Plus } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import { useMobile } from '~hooks/index.ts';
import { type SocialLinksTableProps } from '~types/colony.ts';
import { formatText } from '~utils/intl.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import { type AddTransactionTableModel } from '~v5/common/ActionSidebar/partials/forms/ArbitraryTxsForm/types.ts';
import Table from '~v5/common/Table/index.ts';
import Button from '~v5/shared/Button/Button.tsx';

import AddTransactionModal from '../AddTransactionModal/AddTransactionModal.tsx';

import { useArbitraryTxsTableColumns } from './hooks.tsx';

const displayName = 'v5.common.ActionsContent.partials.SocialLinksTable';

const ArbitraryTransactionsTable: FC<SocialLinksTableProps> = ({ name }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isMobile = useMobile();
  const fieldArrayMethods = useFieldArray({ name });
  const value = useWatch({ name });
  const { readonly } = useAdditionalFormOptionsContext();
  const hasNoDecisionMethods = useHasNoDecisionMethods();

  const columns = useArbitraryTxsTableColumns();
  const data: AddTransactionTableModel[] = fieldArrayMethods.fields.map(
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
          <h5 className="mb-3 mt-6 text-2">
            {formatText({ id: 'editColony.socialLinks.table.title' })}
          </h5>
          <Table<AddTransactionTableModel>
            sizeUnit={isMobile ? undefined : '%'}
            meatBallMenuSize={isMobile ? undefined : 10}
            className={clsx({ '!border-negative-400': !!fieldState.error })}
            getRowId={({ key }) => key}
            columns={columns}
            data={data}
            verticalLayout={isMobile}
          />
        </>
      )}
      {!readonly && (
        <>
          <Button
            mode="primaryOutline"
            icon={Plus}
            size="small"
            className="mt-6"
            isFullSize={isMobile}
            onClick={() => {
              setIsModalOpen(true);
            }}
            disabled={hasNoDecisionMethods}
          >
            {formatText({ id: 'button.addTransaction' })}
          </Button>
          <AddTransactionModal
            defaultValues={data}
            onClose={() => setIsModalOpen(false)}
            isOpen={isModalOpen}
            onSubmit={({ json, contract }) => {
              fieldArrayMethods.append({
                json,
                contract,
              });
              setIsModalOpen(false);
            }}
          />
        </>
      )}
    </>
  );
};

ArbitraryTransactionsTable.displayName = displayName;

export default ArbitraryTransactionsTable;
