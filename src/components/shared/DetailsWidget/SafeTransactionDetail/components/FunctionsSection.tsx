import React from 'react';
import { nanoid } from 'nanoid';
import classnames from 'classnames';

import { getArrayFromString } from '~utils/safes';
import Numeral from '~shared/Numeral';
import { InvisibleCopyableMaskedAddress } from '~shared/InvisibleCopyableAddress';

import {
  DefaultArgument,
  ContractSectionProps,
} from '../../SafeTransactionDetail';

import widgetStyles from '../../DetailsWidget.css';
import styles from '../SafeTransactionDetail.css';

type FunctionsSectionProps = Pick<ContractSectionProps, 'transaction'>;

export const formatArgument = (
  type: string,
  argument: string,
  isArrayType: boolean,
) => {
  // only display first level of array
  const getFormattedArray = (
    paramType: string,
    fnArgument: string,
  ): string | JSX.Element[] => {
    if (fnArgument[0] !== '[' || fnArgument[fnArgument.length - 1] !== ']') {
      return fnArgument;
    }

    const arg = getArrayFromString(fnArgument);
    return arg.map((item) => {
      // If array is nesting one or more other arrays
      if (item[0] === '[' && item[item.length - 1] === ']') {
        return <DefaultArgument argument={item} key={nanoid()} />;
      }
      return formatArgument(paramType, item, false) as JSX.Element;
    });
  };

  if (isArrayType) {
    const formattedArgs = getFormattedArray(type, argument);
    if (!Array.isArray(formattedArgs)) {
      return <DefaultArgument argument={formattedArgs} key={nanoid()} />;
    }

    return formattedArgs.map((element, idx) => {
      return (
        <div className={styles.arrayItem} key={nanoid()}>
          <div className={widgetStyles.label}>
            <span>
              <Numeral value={idx} />:
            </span>
          </div>
          <div className={widgetStyles.value}>{element}</div>
        </div>
      );
    });
  }

  switch (true) {
    case type.includes('address'):
      return (
        <InvisibleCopyableMaskedAddress
          address={argument.trim()}
          key={nanoid()}
        />
      );
    case type.includes('int'):
      return <Numeral value={argument} key={nanoid()} />;
    default:
      return <DefaultArgument argument={argument} key={nanoid()} />;
  }
};

const FunctionsSection = ({ transaction }: FunctionsSectionProps) => {
  const functions = transaction.functionParams || [];

  return (
    <>
      {functions.map((func) => {
        const paramName = func?.name ?? '';
        const paramType = func?.type ?? '';
        const argument = func?.value ?? '';
        const isArrayType = paramType.substring(paramType.length - 2) === '[]';

        return (
          <div className={widgetStyles.item} key={nanoid()}>
            <div className={widgetStyles.label}>
              <span>{paramName}</span>
            </div>
            <div
              className={classnames(widgetStyles.value, {
                [styles.arrayContainer]: isArrayType,
              })}
            >
              {formatArgument(paramType, argument, isArrayType)}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default FunctionsSection;
