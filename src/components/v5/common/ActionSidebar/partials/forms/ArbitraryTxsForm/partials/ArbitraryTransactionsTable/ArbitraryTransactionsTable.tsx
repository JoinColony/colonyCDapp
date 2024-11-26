import { Plus, WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import { type AddTransactionTableModel } from '~v5/common/ActionSidebar/partials/forms/ArbitraryTxsForm/types.ts';
import Table from '~v5/common/Table/index.ts';
import Button from '~v5/shared/Button/Button.tsx';
import Modal from '~v5/shared/Modal/Modal.tsx';

import AddTransactionModal from '../AddTransactionModal/AddTransactionModal.tsx';

import { useArbitraryTxsTableColumns } from './hooks.tsx';
import { displayName, MSG } from './translation.ts';

interface ArbitraryTransactionsTableProps {
  name: string;
}

const ArbitraryTransactionsTable: FC<ArbitraryTransactionsTableProps> = ({
  name,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const isMobile = useMobile();
  const fieldArrayMethods = useFieldArray({ name });
  const value = useWatch({ name });
  const { readonly } = useAdditionalFormOptionsContext();
  const hasNoDecisionMethods = useHasNoDecisionMethods();

  const openTransactionModal = () => {
    setIsModalOpen(true);
  };
  const closeTransactionModal = () => {
    setIsModalOpen(false);
    setIsCancelModalOpen(false);
  };
  const { getFieldState } = useFormContext();
  const fieldState = getFieldState(name);

  const columns = useArbitraryTxsTableColumns({
    openTransactionModal,
    isError: !!fieldState.error,
  });
  const data: AddTransactionTableModel[] = fieldArrayMethods.fields.map(
    ({ id }, index) => ({
      key: id,
      ...(value?.[index] || {}),
    }),
  );

  return (
    <div className="pt-4">
      <h5 className="mb-4 text-2">
        {formatText({ id: 'actionSidebar.transactions' })}
      </h5>
      <Table<AddTransactionTableModel>
        sizeUnit={isMobile ? undefined : '%'}
        meatBallMenuSize={isMobile ? undefined : 10}
        className={clsx('mb-6', {
          '[&_table]:!border-negative-400 md:[&_tfoot_td]:!border-negative-400 md:[&_th]:border-negative-400':
            !!fieldState.error,
        })}
        getRowId={({ key }) => key}
        columns={columns}
        data={data.length === 0 ? [{} as AddTransactionTableModel] : data}
        verticalLayout={isMobile}
      />
      {!readonly && (
        <>
          <Button
            mode="primaryOutline"
            icon={Plus}
            size="small"
            isFullSize={isMobile}
            onClick={openTransactionModal}
            disabled={hasNoDecisionMethods}
          >
            {formatText({ id: 'button.addTransaction' })}
          </Button>
          <AddTransactionModal
            onClose={() => {
              setIsCancelModalOpen(true);
            }}
            isOpen={isModalOpen}
            onSubmit={({ jsonAbi, contractAddress, method, args = [] }) => {
              fieldArrayMethods.append({
                jsonAbi,
                contractAddress,
                method,
                args,
              });
              setIsModalOpen(false);
            }}
          />
          <Modal
            title={formatText(MSG.contractModalCancelTitle)}
            subTitle={formatText(MSG.contractModalCancelSubtitle)}
            isOpen={isCancelModalOpen}
            className="md:mt-[3rem]"
            onClose={() => {
              setIsCancelModalOpen(false);
            }}
            isFullOnMobile={false}
            onConfirm={closeTransactionModal}
            icon={WarningCircle}
            buttonMode="primarySolid"
            confirmMessage={formatText(MSG.contractModalCancelButtonCancel)}
            closeMessage={formatText(MSG.contractModalCancelButtonContinue)}
          />
        </>
      )}
    </div>
  );
};

ArbitraryTransactionsTable.displayName = displayName;

export default ArbitraryTransactionsTable;
