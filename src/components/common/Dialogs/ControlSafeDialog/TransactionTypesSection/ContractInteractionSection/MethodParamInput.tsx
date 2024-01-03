import { JsonFragment } from '@ethersproject/abi';
import React from 'react';

import { Input } from '~shared/Fields';

import { UpdatedMethods } from '../../types';

import styles from './ContractInteractionSection.css';

const displayName = `common.ControlSafeDialog.ControlSafeForm.ContractInteractionSection.MethodParamInput`;

interface Props {
  disabledInput: boolean;
  transactionIndex: number;
  selectedContractMethods: UpdatedMethods;
  param: JsonFragment;
}

const MethodParamInput = ({
  disabledInput,
  transactionIndex,
  selectedContractMethods = {},
  param,
}: Props) => (
  <div className={styles.inputParamContainer}>
    <Input
      label={`${param.name} (${param.type})`}
      // eslint-disable-next-line max-len
      name={`transactions.${transactionIndex}.${param.name}-${selectedContractMethods[transactionIndex]?.name}`}
      appearance={{ colorSchema: 'grey', theme: 'fat' }}
      disabled={disabledInput}
      placeholder={`${param.name} (${param.type})`}
    />
  </div>
);

MethodParamInput.displayName = displayName;

export default MethodParamInput;
