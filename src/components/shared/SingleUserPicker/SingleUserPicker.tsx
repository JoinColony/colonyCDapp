import React, { ComponentType, ReactNode, useCallback } from 'react';
import { defineMessages, MessageDescriptor, useIntl } from 'react-intl';
import classnames from 'classnames';
import { useFormContext } from 'react-hook-form';

import { SimpleMessageValues, User } from '~types';
import { getMainClasses } from '~utils/css';
import UserAvatar from '~shared/UserAvatar';

import {
  ItemDataType,
  withOmniPicker,
  WrappedComponentProps,
} from '../OmniPicker';
import { Props as WithOmnipickerInProps } from '../OmniPicker/withOmniPicker';
import { InputLabel, HookFormInputStatus as InputStatus } from '../Fields';
import Icon from '../Icon';
import Button from '../Button';
import ItemDefault from './ItemDefault';

import styles from './SingleUserPicker.css';

type AvatarRenderFn = (user?: ItemDataType<User>) => ReactNode;

const displayName = 'SingleUserPicker';

const MSG = defineMessages({
  selectMember: {
    id: `${displayName}.selectMember`,
    defaultMessage: 'Select member',
  },
  emptyMessage: {
    id: `${displayName}.emptyMessage`,
    defaultMessage: 'No Colony members match that search.',
  },
  remove: {
    id: `${displayName}.remove`,
    defaultMessage: 'Remove',
  },
  closedCaret: {
    id: `${displayName}.closedCaret`,
    defaultMessage: 'Closed user picker',
  },
  openedCaret: {
    id: `${displayName}.openedCaret`,
    defaultMessage: 'Opened user picker',
  },
});

interface Appearance {
  direction?: 'horizontal';
  width?: 'wide';
}

interface Props extends WithOmnipickerInProps {
  /** Appearance object */
  appearance?: Appearance;

  /** Renders an extra button to remove selection */
  isResettable?: boolean;

  /** Renders an extra button to remove selection */
  disabled?: boolean;

  /** Should render the select without a label */
  elementOnly?: boolean;

  /** Help text */
  help?: string | MessageDescriptor;

  /** Help text values for intl interpolation */
  helpValues?: SimpleMessageValues;

  /** Label text */
  label: string | MessageDescriptor;

  /** Label text values for intl interpolation */
  labelValues?: SimpleMessageValues;

  /** Html `name` attribute */
  name: string;

  /** Status text */
  placeholder?: string | MessageDescriptor;

  /** Override avatar rendering */
  renderAvatar: AvatarRenderFn;

  /** Item component for omnipicker listbox */
  renderItem?: (user: ItemDataType<User>, selected?: boolean) => ReactNode;

  /** Callback for things that happend after selection  */
  onSelected?: (user: User) => void;

  value?: User;

  /** Provides value for data-test prop in the input used on cypress testing */
  dataTest?: string;

  /** Provides value for data-test prop in the item list component used on cypress testing */
  itemDataTest?: string;

  /** Provides value for data-test prop in the value of the input used on cypress testing */
  valueDataTest?: string;
}

const SingleUserPicker = ({
  appearance,
  disabled,
  elementOnly,
  help,
  helpValues,
  inputProps,
  isResettable,
  label,
  labelValues,
  name,
  OmniPicker,
  omniPickerIsOpen,
  OmniPickerWrapper,
  onSelected,
  openOmniPicker,
  placeholder,
  registerInputNode,
  renderAvatar = (item?: ItemDataType<User>) => (
    <UserAvatar user={item} size="xs" />
  ),
  renderItem: renderItemProp,
  dataTest,
  itemDataTest,
  valueDataTest,
}: Props & WrappedComponentProps) => {
  const {
    formState: { errors, touchedFields },
    setValue,
    watch,
  } = useFormContext();
  const value = watch(name);
  const { formatMessage } = useIntl();

  const handleActiveUserClick = useCallback(() => {
    if (!disabled) {
      setValue(name, undefined, { shouldTouch: true, shouldValidate: true });
      openOmniPicker();
    }
  }, [disabled, openOmniPicker, setValue, name]);
  const handlePick = useCallback(
    (user: User) => {
      setValue(name, user, { shouldValidate: true });
      if (onSelected) onSelected(user);
    },
    [onSelected, setValue, name],
  );
  const resetSelection = useCallback(() => {
    if (!disabled && setValue) {
      setValue(name, undefined, { shouldValidate: true });
    }
  }, [disabled, setValue, name]);
  // Use custom render prop for item or the default one with the given renderAvatar function
  const renderItem =
    renderItemProp || // eslint-disable-next-line react-hooks/rules-of-hooks
    useCallback(
      (user: ItemDataType<User>) => (
        <ItemDefault
          itemData={user}
          renderAvatar={renderAvatar}
          showMaskedAddress
          dataTest={itemDataTest}
        />
      ),
      [renderAvatar, itemDataTest],
    );

  const labelAppearance = appearance
    ? { direction: appearance.direction }
    : undefined;

  const placeholderText =
    !placeholder || typeof placeholder === 'string'
      ? placeholder
      : formatMessage(placeholder);

  return (
    <div className={styles.omniContainer}>
      <OmniPickerWrapper className={getMainClasses(appearance, styles)}>
        <div className={styles.inputContainer}>
          <InputLabel
            inputId={inputProps.id}
            label={label}
            labelValues={labelValues}
            help={help}
            helpValues={helpValues}
            appearance={labelAppearance}
            screenReaderOnly={elementOnly}
          />
          {value ? (
            <div className={styles.avatarContainer}>{renderAvatar(value)}</div>
          ) : (
            <Icon
              className={omniPickerIsOpen ? styles.focusIcon : styles.icon}
              name="filled-circle-person"
              title={MSG.selectMember}
            />
          )}
          <div className={styles.container}>
            {
              /* eslint-disable jsx-a11y/click-events-have-key-events */
              value && (
                <button
                  type="button"
                  className={styles.recipientName}
                  onClick={handleActiveUserClick}
                  onFocus={handleActiveUserClick}
                  tabIndex={0}
                  disabled={disabled}
                  data-test={valueDataTest}
                >
                  {value.profile.displayName ||
                    value.name ||
                    value.walletAddress}
                </button>
              )
            }
            {/* eslint-enable jsx-a11y/click-events-have-key-events */}
            <input
              disabled={disabled}
              className={classnames(styles.input, {
                [styles.inputInvalid]: touchedFields[name] && errors[name],
              })}
              {...inputProps}
              placeholder={placeholderText}
              hidden={!!value}
              ref={registerInputNode}
              data-test={dataTest}
            />
            <div className={styles.inputStatusContainer}>
              <InputStatus
                appearance={{ theme: 'minimal' }}
                error={
                  errors[name]?.message as
                    | MessageDescriptor
                    | string
                    | undefined
                }
                touched={touchedFields[name]}
              />
            </div>
            <div className={styles.omniPickerContainer}>
              <OmniPicker renderItem={renderItem} onPick={handlePick} />
            </div>
            {(!value || (value && !isResettable)) && (
              <Icon
                {...(disabled ? {} : { onClick: openOmniPicker })}
                className={classnames(styles.arrowIcon, {
                  [styles.arrowIconActive]: omniPickerIsOpen,
                })}
                name="caret-down-small"
                title={omniPickerIsOpen ? MSG.openedCaret : MSG.closedCaret}
              />
            )}
          </div>
        </div>
      </OmniPickerWrapper>
      {value && isResettable && (
        <Button
          onClick={resetSelection}
          appearance={{ theme: 'blue', size: 'small' }}
          text={{ id: 'button.remove' }}
        />
      )}
    </div>
  );
};

SingleUserPicker.displayName = displayName;

/** @NOTE I don't like it either, but digging through the HOC types seems counter productive considering we'll refactor it soon */
export default withOmniPicker(
  SingleUserPicker,
) as unknown as ComponentType<Props>;
