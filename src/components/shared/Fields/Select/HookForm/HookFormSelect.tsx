import React, {
  KeyboardEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { defineMessages } from 'react-intl';
import { nanoid } from 'nanoid';
import { useFormContext } from 'react-hook-form';

import { InputLabel, HookFormInputStatus as InputStatus } from '~shared/Fields';
import Icon from '~shared/Icon';
import { DOWN, ENTER, ESC, Message, SPACE, UP } from '~types';
import { getMainClasses } from '~utils/css';
import { formatText } from '~utils/intl';

import SelectListBox from '../SelectListBox';
import { Appearance, SelectProps } from '../types';

import styles from '../Select.css';

const displayName = 'Select.HookFormSelect';

const MSG = defineMessages({
  expandIconHTMLTitle: {
    id: `${displayName}.expandIconHTMLTitle`,
    defaultMessage: 'expand',
  },
});

const HookFormSelect = ({
  appearance,
  disabled,
  elementOnly,
  help,
  helpValues,
  id: idProp,
  label,
  labelValues,
  name,
  onChange: onChangeCallback,
  options,
  optionsFooter,
  placeholder,
  renderActiveOption,
  status,
  statusValues,
  dataTest,
  itemDataTest,
}: SelectProps) => {
  const [id] = useState<string>(idProp || nanoid());
  const {
    formState: { errors, touchedFields },
    watch,
    setValue,
  } = useFormContext();
  const error = errors[name]?.message as Message;
  const touched = touchedFields[name];
  const value = watch(name);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number>(-1);

  const checkedOption = options.findIndex((option) => option.value === value);

  const open = () => {
    if (disabled) return;
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setSelectedOption(-1);
  };

  const handleOutsideClick = useCallback(
    (evt: MouseEvent) => {
      if (
        wrapperRef.current &&
        evt.target instanceof Node &&
        !wrapperRef.current.contains(evt.target)
      ) {
        close();
      }
    },
    [wrapperRef],
  );

  const goUp = () => {
    if (selectedOption > 0) {
      setSelectedOption(selectedOption - 1);
    }
  };

  const goDown = () => {
    if (selectedOption < options.length - 1) {
      setSelectedOption(selectedOption + 1);
    }
  };

  const checkOption = () => {
    if (selectedOption === checkedOption || selectedOption === -1) {
      // No change
      close();
      return;
    }
    const { value: optionValue } = options[selectedOption];
    setValue(name, optionValue, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
    onChangeCallback?.(optionValue);
    close();
  };

  const handleKeyOnOpen = (evt: KeyboardEvent<any>) => {
    const { key } = evt;
    switch (key) {
      case SPACE: {
        // prevent page long-scroll when in view
        evt.preventDefault();
        close();
        break;
      }
      case UP: {
        // prevent page scroll when in view
        evt.preventDefault();
        goUp();
        break;
      }
      case DOWN: {
        // prevent page scroll when in view
        evt.preventDefault();
        goDown();
        break;
      }
      case ENTER: {
        // Do not submit form
        evt.preventDefault();
        checkOption();
        break;
      }
      default:
    }
  };

  const handleKeyOnClosed = (evt: KeyboardEvent<HTMLElement>) => {
    const { key } = evt;
    if ([UP, DOWN, SPACE].indexOf(key) > -1) {
      evt.preventDefault();
      setSelectedOption(checkedOption);
      open();
    }
  };

  const handleKeyUp = (evt: KeyboardEvent<HTMLElement>) => {
    // Special keyUp handling for ESC (modals)
    const { key } = evt;
    if (isOpen && key === ESC) {
      evt.stopPropagation();
      close();
    }
  };

  const handleKeyDown = (evt: KeyboardEvent<HTMLElement>) => {
    if (isOpen) {
      handleKeyOnOpen(evt);
      return;
    }
    handleKeyOnClosed(evt);
  };

  const toggle = () => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  };

  const selectOption = (idx: number) => {
    setSelectedOption(idx);
  };

  useEffect(() => {
    if (isOpen) {
      if (document.body) {
        document.body.addEventListener('click', handleOutsideClick, true);
      }
    }

    return () => {
      if (document.body) {
        document.body.removeEventListener('click', handleOutsideClick, true);
      }
    };
  }, [handleOutsideClick, isOpen]);

  const activeOptionDisplay = useMemo<ReactNode>(() => {
    /*
     * @NOTE If the active option is removed by something (ie: filtered out),
     * fall back to the last entry in the options array
     */
    const activeOption = options[checkedOption] || options[options.length - 1];
    let activeOptionLabel;
    if (activeOption) {
      if (typeof activeOption.label === 'object') {
        activeOptionLabel = formatText(
          activeOption.label,
          activeOption.labelValues,
        );
      } else if (activeOption.labelElement) {
        activeOptionLabel = activeOption.labelElement;
      } else {
        activeOptionLabel = activeOption.label;
      }
    }
    const activeOptionLabelText = activeOptionLabel || placeholder;
    if (renderActiveOption) {
      return renderActiveOption(activeOption, activeOptionLabelText);
    }
    return <span>{activeOptionLabelText}</span>;
  }, [checkedOption, options, placeholder, renderActiveOption]);

  const listboxId = `select-listbox-${id}`;

  return (
    <div className={styles.main} ref={wrapperRef}>
      <InputLabel
        inputId={id}
        label={label}
        labelValues={labelValues}
        help={help}
        helpValues={helpValues}
        screenReaderOnly={elementOnly}
      />
      <div className={styles.inputWrapper}>
        <button
          className={`${styles.select} ${getMainClasses(appearance, styles)}`}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-expanded={isOpen}
          aria-label={formatText(label, labelValues)}
          aria-disabled={disabled}
          id={id}
          tabIndex={0}
          onClick={toggle}
          onKeyUp={handleKeyUp}
          onKeyDown={handleKeyDown}
          type="button"
          name={name}
          data-test={dataTest}
        >
          <div className={styles.selectInner}>
            <div className={styles.activeOption}>{activeOptionDisplay}</div>
            <span className={styles.selectExpandContainer}>
              <Icon name="caret-down-small" title={MSG.expandIconHTMLTitle} />
            </span>
          </div>
        </button>
        {isOpen && !!options.length && (
          <SelectListBox
            checkedOption={checkedOption}
            selectedOption={selectedOption}
            listboxId={listboxId}
            options={options}
            optionsFooter={optionsFooter}
            onSelect={selectOption}
            onClick={checkOption}
            appearance={appearance}
            name={name}
            dataTest={itemDataTest}
          />
        )}
      </div>
      {!elementOnly && (
        <InputStatus
          appearance={{ theme: 'minimal' }}
          status={status}
          statusValues={statusValues}
          error={error}
          touched={touched}
        />
      )}
    </div>
  );
};

HookFormSelect.displayName = displayName;

HookFormSelect.defaultProps = {
  appearance: { alignOptions: 'left', theme: 'default' } as Appearance,
  options: [],
};

export default HookFormSelect;
