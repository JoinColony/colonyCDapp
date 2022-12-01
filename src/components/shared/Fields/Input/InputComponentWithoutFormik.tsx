import React, {
  useCallback,
  useState,
  useMemo,
  useEffect,
  forwardRef,
  RefObject,
} from 'react';
import { defineMessages } from 'react-intl';
import Cleave from 'cleave.js/react';
import { ChangeEvent } from 'cleave.js/react/props';
import isNil from 'lodash/isNil';
import Decimal from 'decimal.js';
import { useFormContext, UseFormRegisterReturn } from 'react-hook-form';

import Button from '~shared/Button';
import { getMainClasses } from '~utils/css';

import { InputWithoutFormikProps as InputProps } from './InputWithoutFormik';

import styles from './InputComponent.css';

const MSG = defineMessages({
  max: {
    id: `users.Fileds.Input.InputComponent.max`,
    defaultMessage: 'Max',
  },
});

type CleaveHTMLInputElement = HTMLInputElement & { rawValue: string };

export interface InputComponentProps<T extends Record<string, any>>
  extends Omit<InputProps<T>, 'placeholder'> {
  placeholder?: string;
}

const InputComponentWithoutFormik = <T extends Record<string, any>>({
  appearance,
  formattingOptions,
  onChange,
  onBlur,
  placeholder,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  // Cleave TS defs don't expect/allow these
  contentEditable,
  draggable,
  spellCheck,
  maxLength,
  value,
  maxButtonParams,
  dataTest,
  name,
  /* eslint-enable @typescript-eslint/no-unused-vars */
  ...props
}: InputComponentProps<T>) => {
  const { register } = useFormContext();

  const {
    onChange: hookFormOnChange,
    onBlur: hookFormOnBlur,
    ...inputFieldProps
  } = register(name);

  /* problem with cleave types, that's why `any` */
  // const [cleave, setCleave] = useState<any>(null);

  const length = value ? value.toString().length : 0;

  // const handleCleaveChange = useCallback(
  //   (evt: ChangeEvent<CleaveHTMLInputElement>): void => {
  //     // We are reassigning the value here as cleave just adds a `rawValue` prop
  //     if (evt.currentTarget !== undefined) {
  //       // eslint-disable-next-line no-param-reassign
  //       evt.currentTarget.value = evt.currentTarget.rawValue;
  //     } else {
  //       // setCleaveValue(evt.currentTarget?.rawValue);
  //       // @ts-ignore
  //       // eslint-disable-next-line no-param-reassign
  //       evt.currentTarget = {
  //         // @ts-ignore
  //         value: evt.currentTarget?.rawValue as string,
  //       };
  //     }
  //     if (onChange && evt.target.name) onChange(evt);
  //   },
  //   [onChange],
  // );
  // /*
  //  * @NOTE Coerce cleave into handling dynamically changing options
  //  * See here for why this isn't yet supported "officially":
  //  * https://github.com/nosir/cleave.js/issues/352#issuecomment-447640572
  //  */
  // const dynamicCleaveOptionKey = useMemo(
  //   () => JSON.stringify(formattingOptions),
  //   [formattingOptions],
  // );

  // useEffect(() => {
  //   if (isNil(value) && cleave) {
  //     cleave.setRawValue('');
  //   }
  // }, [cleave, value]);

  // if (formattingOptions) {
  //   if (typeof innerRef === 'object') {
  //     console.error('Cleave inner ref must be a function');
  //     return null;
  //   }
  //   return maxButtonParams === undefined ? (
  //     <Cleave
  //       {...props}
  //       value={value || ''}
  //       key={dynamicCleaveOptionKey}
  //       className={getMainClasses(appearance, styles)}
  //       htmlRef={innerRef}
  //       options={formattingOptions}
  //       onChange={handleCleaveChange}
  //       placeholder={placeholder}
  //       data-test={dataTest}
  //     />
  //   ) : (
  //     <div className={styles.inputContainer}>
  //       <Button
  //         className={styles.maxButton}
  //         text={MSG.max}
  //         onClick={() => {
  //           maxButtonParams?.setFieldValue(
  //             maxButtonParams?.fieldName,
  //             maxButtonParams.maxAmount,
  //           );
  //           const decimalValue = new Decimal(maxButtonParams.maxAmount);
  //           if (decimalValue.lt(0.00001) && decimalValue.gt(0)) {
  //             cleave?.setRawValue(
  //               decimalValue.toSD(5, Decimal.ROUND_DOWN).toNumber(),
  //             );
  //           } else {
  //             cleave?.setRawValue(
  //               new Decimal(maxButtonParams.maxAmount)
  //                 .toDP(5, Decimal.ROUND_DOWN)
  //                 .toNumber(),
  //             );
  //           }
  //         }}
  //         dataTest="inputMaxButton"
  //       />
  //       <Cleave
  //         {...props}
  //         key={dynamicCleaveOptionKey}
  //         className={getMainClasses(appearance, styles)}
  //         htmlRef={innerRef}
  //         options={formattingOptions}
  //         onChange={handleCleaveChange}
  //         placeholder={placeholder}
  //         onInit={(cleaveInstance) => setCleave(cleaveInstance)}
  //         data-test={dataTest}
  //       />
  //     </div>
  //   );
  // }

  const className = getMainClasses(
    maxLength ? { paddingRight: 'extra', ...appearance } : appearance,
    styles,
  );

  const handleChange = (e) => {
    hookFormOnChange(e);
    onChange?.(e);
  };

  const handleBlur = (e) => {
    hookFormOnBlur(e);
    onBlur?.(e);
  };

  return (
    <div className={styles.inputContainer}>
      <input
        {...props}
        {...inputFieldProps}
        className={className}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
        data-test={dataTest}
        maxLength={maxLength}
      />
      {maxLength && (
        <span className={styles.characterCounter}>
          {length}/{maxLength}
        </span>
      )}
    </div>
  );
};
export default InputComponentWithoutFormik;
