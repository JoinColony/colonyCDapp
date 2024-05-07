import {
  Coins,
  CopySimple,
  Plus,
  Trash,
  UploadSimple,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import { type ParseResult } from 'papaparse';
import React, { useState, type FC, useEffect } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile, useTablet } from '~hooks/index.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { type ExpenditurePayoutFieldValue } from '~types/expenditures.ts';
import { formatText } from '~utils/intl.ts';
import { convertEnotationToNumber } from '~utils/numbers.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import Table from '~v5/common/Table/index.ts';
import Button from '~v5/shared/Button/Button.tsx';

import FileUploadModal from '../FileUploadModal/FileUploadModal.tsx';

import { useRecipientsFieldTableColumns } from './hooks.tsx';
import {
  type PaymentBuilderRecipientsTableModel,
  type PaymentBuilderRecipientsFieldProps,
  type PaymentBuilderRecipientsFieldModel,
} from './types.ts';

const displayName =
  'v5.common.ActionsContent.partials.PaymentBuilderRecipientsField';

const PaymentBuilderRecipientsField: FC<PaymentBuilderRecipientsFieldProps> = ({
  name,
}) => {
  const [paymentsFromFile, setPaymentsFromFile] = useState<
    ExpenditurePayoutFieldValue[] | undefined
  >(undefined);
  const {
    colony: { nativeToken },
  } = useColonyContext();
  const fieldArrayMethods = useFieldArray({
    name,
  });
  const hasNoDecisionMethods = useHasNoDecisionMethods();

  useEffect(() => {
    if (paymentsFromFile) {
      const formattedData = paymentsFromFile.map(
        (payment: ExpenditurePayoutFieldValue) => {
          const { recipientAddress, tokenAddress, amount, claimDelay } =
            payment;

          return {
            recipient: recipientAddress,
            amount: amount ? convertEnotationToNumber(amount) : '',
            tokenAddress,
            delay: claimDelay === '' ? undefined : claimDelay,
          };
        },
      );

      fieldArrayMethods.replace(formattedData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentsFromFile]);

  const data: PaymentBuilderRecipientsTableModel[] =
    fieldArrayMethods.fields.map(({ id }) => ({
      key: id,
    }));
  const value: PaymentBuilderRecipientsFieldModel[] = useWatch({ name }) || [];
  const columns = useRecipientsFieldTableColumns(name, value);
  const isTablet = useTablet();
  const isMobile = useMobile();
  const getMenuProps = ({ index }) => ({
    cardClassName: 'sm:min-w-[9.625rem]',
    items: [
      {
        key: 'add-token',
        onClick: () =>
          fieldArrayMethods.insert(index + 1, {
            recipient: undefined,
            amount: '',
            tokenAddress: nativeToken?.tokenAddress || '',
            delay: undefined,
          }),
        label: formatText({ id: 'button.addRow' }),
        icon: Coins,
      },
      {
        key: 'duplicate',
        onClick: () =>
          fieldArrayMethods.insert(index + 1, {
            ...value[index],
          }),
        label: formatText({ id: 'table.row.duplicate' }),
        icon: CopySimple,
      },
      ...(value.length > 1
        ? [
            {
              key: 'remove',
              onClick: () => fieldArrayMethods.remove(index),
              label: formatText({ id: 'table.row.remove' }),
              icon: Trash,
            },
          ]
        : []),
    ],
  });
  const { getFieldState } = useFormContext();
  const fieldState = getFieldState(name);

  const [
    isUploadModalOpen,
    { toggleOff: toggleUploadModalOff, toggleOn: toggleUploadModalOn },
  ] = useToggle();

  const onUpload = (file: ParseResult<unknown>) => {
    setPaymentsFromFile(file);
    fieldArrayMethods.remove();
  };

  return (
    <div>
      <h5 className="mb-3 mt-6 text-2">
        {formatText({ id: 'actionSidebar.payments' })}
      </h5>
      {!!data.length && !hasNoDecisionMethods && (
        <Table<PaymentBuilderRecipientsTableModel>
          virtualizedProps={
            data.length > 10
              ? {
                  virtualizedRowHeight: isTablet ? 46 : 54,
                }
              : undefined
          }
          className={clsx(
            '[&_tfoot>tr>td]:border-gray-200 [&_tfoot>tr>td]:py-2 md:[&_tfoot>tr>td]:border-t',
            {
              '[&_tfoot>tr>td:empty]:hidden [&_th]:w-[6.125rem]': isTablet,
              '[&_table]:table-auto lg:[&_table]:table-fixed [&_tbody_td]:h-[54px] [&_td:first-child]:pl-4 [&_td]:pr-4 [&_tfoot_td:first-child]:pl-4 [&_tfoot_td:not(:first-child)]:pl-0 [&_th:first-child]:pl-4 [&_th:not(:first-child)]:pl-0 [&_th]:pr-4':
                !isTablet,
              '!border-negative-400 md:[&_tfoot_td]:!border-negative-400 md:[&_th]:border-negative-400':
                !!fieldState.error,
            },
          )}
          verticalLayout={isTablet}
          getRowId={({ key }) => key}
          columns={columns}
          data={data}
          getMenuProps={getMenuProps}
          withBorder={false}
          renderCellWrapper={(_, content) => content}
          initialState={{
            pagination: {
              pageSize: 400,
            },
          }}
        />
      )}
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
        <Button
          mode="primaryOutline"
          icon={Plus}
          size="small"
          isFullSize={isMobile}
          onClick={() => {
            fieldArrayMethods.append({
              recipient: undefined,
              amount: '',
              tokenAddress: nativeToken?.tokenAddress || '',
              delay: undefined,
            });
          }}
          disabled={hasNoDecisionMethods || data.length === 400}
        >
          {formatText({ id: 'button.addPayment' })}
        </Button>
        <Button
          mode="primaryOutline"
          icon={UploadSimple}
          isFullSize={isMobile}
          size="small"
          onClick={toggleUploadModalOn}
          disabled={hasNoDecisionMethods}
        >
          {formatText({ id: 'button.uploadCSV' })}
        </Button>
      </div>
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onUpload={onUpload}
        onClose={toggleUploadModalOff}
      />
    </div>
  );
};

PaymentBuilderRecipientsField.displayName = displayName;

export default PaymentBuilderRecipientsField;
