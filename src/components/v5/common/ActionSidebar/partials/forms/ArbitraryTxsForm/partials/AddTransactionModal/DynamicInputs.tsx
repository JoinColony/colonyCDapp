import { Interface, type ParamType } from 'ethers/lib/utils';
import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import FormSelect from '~v5/common/Fields/Select/FormSelect.tsx';

import { validateMethod } from './consts.ts';
import { MethodInput } from './MethodInput.tsx';
import { MSG } from './translation.ts';

interface MethodItem {
  value: string;
  label: string;
}

export const DynamicInputs: React.FC = () => {
  const { watch, setValue, unregister } = useFormContext();
  const jsonAbiField = watch('jsonAbi');
  const selectedMethod = watch('method');
  const [methodOptions, setMethodOptions] = useState<MethodItem[]>([]);
  const [methodArgs, setMethodArgs] = useState<ParamType[]>([]);

  const removePrevMethodArgs = useCallback(() => {
    methodArgs.forEach((_, index) => {
      unregister(`args[${index}]`);
    });
    setMethodArgs([]);
  }, [methodArgs, setMethodArgs, unregister]);

  const methodOptionsSetter = ({ jsonAbi }) => {
    try {
      const IJsonAbi = new Interface(jsonAbi);
      const functions = Object.keys(IJsonAbi.functions);
      const options =
        functions?.map((func) => ({ value: func, label: func })) || [];
      setMethodOptions(options);
    } catch (e) {
      setMethodOptions([]);
    }
  };

  const methodArgsSetter = useCallback(
    ({ jsonAbi, method }) => {
      try {
        const IJsonAbi = new Interface(jsonAbi);
        const functionFragment = IJsonAbi.getFunction(method);
        setMethodArgs(functionFragment.inputs);
        functionFragment.inputs.forEach((item, index) => {
          setValue(`args[${index}].type`, item.type); // Setting type as value to use it in table rendering
          setValue(`args[${index}].name`, item.name); // Setting title as value to use it in table rendering
        });
      } catch (e) {
        setMethodArgs([]);
      }
    },
    [setValue],
  );

  const onJsonAbiChanged = useCallback(
    ({ jsonAbi }) => {
      if (jsonAbi) {
        setValue('method', '');
        removePrevMethodArgs();
        methodOptionsSetter({ jsonAbi });
      }
    },
    [setValue, removePrevMethodArgs],
  );

  const onMethodChanged = useCallback(
    ({ method, jsonAbi }) => {
      if (method && jsonAbi) {
        removePrevMethodArgs();
        methodArgsSetter({ jsonAbi, method });
      }
    },
    [removePrevMethodArgs, methodArgsSetter],
  );

  useEffect(() => {
    // Initial render for "edit" state when we have defaultValues
    if (jsonAbiField && selectedMethod) {
      methodOptionsSetter({ jsonAbi: jsonAbiField });
      methodArgsSetter({ jsonAbi: jsonAbiField, method: selectedMethod });
    }
    // This hook is intentionally called only for the first render
    // Other updates will be handled in the "watch" subscription
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const { unsubscribe } = watch(({ method, jsonAbi }, { name }) => {
      switch (name) {
        case 'jsonAbi':
          onJsonAbiChanged({ jsonAbi });
          break;
        case 'method':
          onMethodChanged({ method, jsonAbi });
          break;
        default:
      }
    });

    return () => unsubscribe();
  }, [
    watch,
    methodArgs,
    setValue,
    unregister,
    removePrevMethodArgs,
    onMethodChanged,
    onJsonAbiChanged,
  ]);

  if (!methodOptions.length && !methodArgs.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {!!methodOptions.length && (
        <FormSelect
          labelMessage={formatText(MSG.methodsField)}
          placeholder={formatText(MSG.methodsPlaceholder)}
          name="method"
          options={methodOptions}
          rules={{ validate: validateMethod }}
        />
      )}
      {methodArgs.map((input, index) => (
        <MethodInput
          key={input.name}
          name={input.name}
          type={input.type}
          index={index}
        />
      ))}
    </div>
  );
};
